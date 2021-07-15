/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   A simple notion client
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import { caching } from 'cache-manager';
import { dump } from 'js-yaml';
import got from 'got';

import { markdown } from '#markdown';
import { getPropertyContent } from '#property';

import type { Cache } from 'cache-manager';
import type { Got, OptionsOfJSONResponseBody, Response } from 'got';
import type {
  Block,
  Database,
  Entity,
  FullBlock,
  FullDatabase,
  FullPage,
  List,
  Page,
} from './types';

interface Pagination extends Record<string, number | string | undefined> {
  /* eslint-disable @typescript-eslint/naming-convention */
  start_cursor?: string;
  page_size?: number;
  /* eslint-enable */
}

export interface NotionTTL {
  /** the number of seconds in which a database metadata will be cached */
  databaseMeta: number;
  /** the number of seconds in which a metadata of a database's entries will be cached */
  databaseEntries: number;
  /** the number of seconds in which a page metadata will be cached */
  pageMeta: number;
  /** the number of seconds in which a page content will be cached */
  pageContent: number;
}

export interface NotionOptions {
  /** access token, default to be the environment variable GATSBY_NOTION_TOKEN */
  token?: string;
  /** api version, default to be 2021-05-13 */
  version?: string;
  /** cache setting for the client, default to the shared memory store */
  /** a cache manager for saving unnecessary calls, default to the shared memory store */
  cache?: Cache;
  /** TTL settings for each API call types, default to cache database metadata and blocks */
  ttl?: Partial<NotionTTL>;
}

export const DEFAULT_CACHE: Cache = caching({ store: 'memory', ttl: 0 });
export const DEFAULT_TTL: NotionTTL = {
  databaseMeta: 0,
  databaseEntries: 0.5,
  pageMeta: 0.5,
  pageContent: 0,
};

const ONE_MINUTE = 60000;

/** A simple Notion client */
export class Notion {
  private cache: Cache;
  private ttl: NotionTTL;
  private client: Got;

  /**
   * create a Notion client with plugin options
   * @param options token and api version etc.
   * @returns a Notion client
   */
  constructor(options?: NotionOptions) {
    const {
      token = process.env.GATSBY_NOTION_TOKEN,
      version = '2021-05-13',
      cache = DEFAULT_CACHE,
    } = { ...options };

    // setup the cache
    this.cache = cache;
    this.ttl = {
      ...DEFAULT_TTL,
      ...options?.ttl,
    };

    if (!token) {
      throw new Error('missing API token');
    }

    this.client = got.extend({
      prefixUrl: 'https://api.notion.com/v1',
      headers: {
        'authorization': `Bearer ${token}`,
        'notion-version': version,
      },
      responseType: 'json',
    });
  }

  /**
   * get everything related to a database
   * @param id the uuid of the database
   * @returns database metadata
   */
  public async getDatabase(id: string): Promise<FullDatabase> {
    // get the database metadata from cache, if available
    const { body } = await this.cache.wrap<Response<Database>>(
      `database:${id}`,
      async () => this.client.get<Database>(`databases/${id}`),
      // NOTE: by default the cache would last forever and
      //       therefore no API call will be make after the first attempt
      { ttl: this.ttl.databaseMeta },
    );
    // get a list of pages in the database from cache, if available
    const pages = await this.cache.wrap<Page[]>(
      `database:${id}:pages`,
      async () =>
        this.getCompleteList<Page>({
          method: 'post',
          url: `databases/${id}/query`,
        }),
      // NOTE: by default the cache has only got a 0.5s TTL and
      //       therefore we will almost always make an API call and
      //       get the most up-to-date last_edited_time of each page
      { ttl: this.ttl.databaseEntries },
    );

    return {
      ...body,
      title: body.title.map((text) => text.plain_text).join(''),
      pages: await Promise.all(
        pages.map(this.normalisePageAndCache.bind(this)),
      ),
    };
  }

  /**
   * get everything related to a page
   * @param id the uuid of the page
   * @returns metadata and its content
   */
  public async getPage(id: string): Promise<FullPage> {
    const { body } = await this.cache.wrap<Response<Page>>(
      `page:${id}`,
      async () => this.client.get<Page>(`pages/${id}`),
      // NOTE: by default the cache has only got a 0.5s TTL and
      //       therefore we will almost always make an API call and
      //       get the most up-to-date last_edited_time of the page
      { ttl: this.ttl.pageMeta },
    );

    return this.normalisePageAndCache(body);
  }

  /**
   * get all block related to a collection
   * @param id the uuid of the collection, either a database or page or a parent block
   * @returns a list of blocks and all its children
   */
  private async getBlocks(id: string): Promise<FullBlock[]> {
    const blocks = await this.getCompleteList<Block>({
      method: 'get',
      url: `blocks/${id}/children`,
    });

    return Promise.all(
      blocks.map(
        async (block): Promise<FullBlock> => ({
          ...block,
          /* eslint-disable @typescript-eslint/naming-convention */
          ...(block.has_children
            ? { has_children: true, children: await this.getBlocks(block.id) }
            : { has_children: false }),
          /* eslint-enable */
        }),
      ),
    );
  }

  /**
   * get all records from a method that need to be called multiple times to get all the paginated records
   * @param options options for Got without the page_size and start_cursor payload
   * @returns all records returned
   */
  private async getCompleteList<E extends Entity = Entity>(
    options: OptionsOfJSONResponseBody,
  ): Promise<E[]> {
    let next: string | undefined = undefined;
    let hasMore = true;
    const entities: E[] = [];

    while (hasMore) {
      /* eslint-disable @typescript-eslint/naming-convention */
      const searchParams: Pagination = { page_size: 100, start_cursor: next };

      const {
        body: { has_more, next_cursor, results },
      }: Response<List<E>> = await this.client<List<E>>({
        ...options,
        ...(options.method === 'get'
          ? {
              searchParams,
            }
          : {
              json: {
                ...options.json,
                ...searchParams,
              },
            }),
      });
      /* eslint-enable */

      hasMore = has_more;
      next = next_cursor ?? undefined;
      entities.push(...results);
    }

    return entities;
  }

  /**
   * complete the missing fields in Page
   * @param page the page object returned from Notion API
   * @returns page with title and its content
   */
  private async normalisePage(page: Page): Promise<FullPage> {
    // NOTE: API calls will be made for getting blocks as no cache will be set
    const blocks = await this.getBlocks(page.id);
    // Name for a page in a database, title for an ordinary page
    const title = getPropertyContent(
      /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */
      page.properties.Name ?? page.properties.title,
    ) as string;
    const frontmatter = [
      '---',
      dump(
        {
          id: page.id,
          title,
          createdTime: page.created_time,
          lastEditedTime: page.last_edited_time,
          ...Object.fromEntries(
            Object.entries(page.properties)
              // omit the already transformed title
              .filter(([key]) => !['title', 'Name'].includes(key))
              .map(([key, property]) => [key, getPropertyContent(property)]),
          ),
        },
        { forceQuotes: true },
      ).trim(),
      '---',
    ].join('\n');
    const md = markdown(blocks);

    return { ...page, blocks, title, markdown: [frontmatter, md].join('\n') };
  }

  /**
   * normalised a page, or get it from the cache
   * @param page the page object returned from Notion API
   * @returns page with title and its content
   */
  private async normalisePageAndCache(page: Page): Promise<FullPage> {
    const cacheKey = `page:${page.id}:content`;
    const cachedPage = await this.cache.get<FullPage>(cacheKey);

    if (
      cachedPage &&
      cachedPage.last_edited_time === page.last_edited_time &&
      // don't use the cache if the last edited time happened to be the last minute since Notion rounded the time resolution to minute level recently
      Date.now() - new Date(page.last_edited_time).getTime() > ONE_MINUTE
    ) {
      return cachedPage;
    } else {
      const normalisedPage = await this.normalisePage(page);
      await this.cache.set(
        cacheKey,
        normalisedPage,
        // NOTE: by default the cache would last forever and
        //       therefore no API call will be make unless the last_edit_time has changed
        { ttl: this.ttl.pageContent },
      );

      return normalisedPage;
    }
  }
}
