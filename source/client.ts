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

import { Client } from '@notionhq/client';
import { caching } from 'cache-manager';
import { dump } from 'js-yaml';

import { markdown } from '#markdown';
import { getMetadata } from '#metadata';
import {
  getPropertyContentFromRichText,
  isPageAccessible,
  isPropertyAccessible,
  isPropertySupported,
  normalizeProperties,
} from '#property';

import type {
  Block,
  Database,
  NotionAPIDatabase,
  NotionAPIList,
  NotionAPIPage,
  NotionAPITitle,
  Page,
} from './types';

import type { Cache } from 'cache-manager';

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
  /** cache setting for the client, default to the shared memory store */
  /** a cache manager for saving unnecessary calls, default to the shared memory store */
  cache?: Cache;
  /** TTL settings for each API call types, default to cache database metadata and blocks */
  ttl?: Partial<NotionTTL>;
}

export const DEFAULT_CACHE: Cache = caching({ store: 'memory', ttl: 0 });
export const DEFAULT_TTL: NotionTTL = {
  databaseMeta: 0,
  databaseEntries: 5,
  pageMeta: 5,
  pageContent: 0,
};

const ONE_MINUTE = 60000;

/** A simple Notion client */
export class Notion {
  private cache: Cache;
  private ttl: NotionTTL;
  private client: Client;

  /**
   * create a Notion client with plugin options
   * @param options token and api version etc.
   * @returns a Notion client
   */
  constructor(options?: NotionOptions) {
    const { token = process.env.GATSBY_NOTION_TOKEN, cache = DEFAULT_CACHE } = {
      ...options,
    };

    // setup the cache
    this.cache = cache;
    this.ttl = {
      ...DEFAULT_TTL,
      ...options?.ttl,
    };

    if (!token) {
      throw new Error('missing API token');
    }

    this.client = new Client({
      auth: token,
      notionVersion: '2022-02-22', // fix the version to ensure compatability
    });
  }

  /**
   * get everything related to a database
   * @param id the uuid of the database
   * @returns database metadata
   */
  public async getDatabase(id: string): Promise<Database | null> {
    // get the database metadata from cache, if available
    const database = (await this.cache.wrap(
      `database:${id}`,
      /* eslint-disable @typescript-eslint/naming-convention */
      async () => this.client.databases.retrieve({ database_id: id }),
      /* eslint-enable */
      // NOTE: by default the cache would last forever and
      //       therefore no API call will be make after the first attempt
      { ttl: this.ttl.databaseMeta },
    )) as NotionAPIDatabase; // NOTE: force casting here because unlike the older API version the version using here always return metadata like url etc.

    // get a list of pages in the database from cache, if available
    const pages = await this.cache.wrap(
      `database:${id}:pages`,
      /* eslint-disable @typescript-eslint/naming-convention */
      async () => getAll(this.client.databases.query, { database_id: id }),
      /* eslint-enable @typescript-eslint/naming-convention */
      // NOTE: by default the cache has only got a 5s TTL and
      //       therefore we will almost always make an API call and
      //       get the most up-to-date last_edited_time of each page
      //       during build but skip any unnecessary API calls in the same build
      { ttl: this.ttl.databaseEntries },
    );

    const normalizedPages = await Promise.all(
      pages.filter(isPageAccessible).map(this.normalizePageAndCache.bind(this)),
    );

    return {
      id: database.id,
      object: 'database',
      parent: database.parent,
      title: getPropertyContentFromRichText(database.title),
      metadata: getMetadata(database),
      pages: normalizedPages,
    };
  }

  /**
   * get everything related to a page
   * @param id the uuid of the page
   * @returns metadata and its content
   */
  public async getPage(id: string): Promise<Page | null> {
    const page = (await this.cache.wrap(
      `page:${id}`,
      /* eslint-disable @typescript-eslint/naming-convention */
      async () => this.client.pages.retrieve({ page_id: id }),
      /* eslint-enable */
      // NOTE: by default the cache has only got a 5s TTL and
      //       therefore we will almost always make an API call and
      //       get the most up-to-date last_edited_time of the page
      //       during build but skip any unnecessary API calls in the same build
      { ttl: this.ttl.pageMeta },
    )) as NotionAPIPage; // NOTE: force casting here because unlike the older API version the version using here always return metadata like url etc.

    return this.normalizePageAndCache(page);
  }

  /**
   * get all block related to a collection
   * @param id the uuid of the collection, either a database or page or a parent block
   * @returns a list of blocks and all its children
   */
  private async getBlocks(id: string): Promise<Block[]> {
    /* eslint-disable @typescript-eslint/naming-convention */
    const blocks = await getAll(this.client.blocks.children.list, {
      block_id: id,
    });
    /* eslint-enable */

    // remove any blocks that cannot be read due to access restriction
    const filteredBlocks = blocks
      .filter(isPropertyAccessible)
      .filter(isPropertySupported);

    return Promise.all(
      filteredBlocks.map(
        async (block): Promise<Block> => ({
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
   * complete the missing fields in Page
   * @param page the page object returned from Notion API
   * @returns page with title and its content
   */
  private async normalizePage(page: NotionAPIPage): Promise<Page> {
    // NOTE: API calls will be made for getting blocks as no cache will be set
    const blocks = await this.getBlocks(page.id);
    const properties = normalizeProperties(page.properties);
    const titleProperty = Object.values(page.properties).filter(
      (property): property is NotionAPITitle => property.type === 'title',
    )[0];
    const title = getPropertyContentFromRichText(titleProperty.title);

    const metadata = getMetadata(page);

    return {
      id: page.id,
      object: 'page',
      parent: page.parent,
      title,
      metadata,
      properties,
      blocks,
      markdown: [
        '---',
        dump({ title, ...metadata }, { forceQuotes: true }).trim(),
        '---',
        markdown(blocks),
      ].join('\n'),
    };
  }

  /**
   * normalized a page, or get it from the cache
   * @param page the page object returned from Notion API
   * @returns page with title and its content
   */
  private async normalizePageAndCache(page: NotionAPIPage): Promise<Page> {
    const cacheKey = `page:${page.id}:content`;
    const cachedPage = await this.cache.get<Page>(cacheKey);

    if (
      cachedPage &&
      cachedPage.metadata.lastEditedTime === page.last_edited_time &&
      // don't use the cache if the last edited time happened to be the last minute since Notion rounded the time resolution to minute level recently
      Date.now() - new Date(page.last_edited_time).getTime() > ONE_MINUTE
    ) {
      return cachedPage;
    } else {
      const normalizedPage = await this.normalizePage(page);
      await this.cache.set(
        cacheKey,
        normalizedPage,
        // NOTE: by default the cache would last forever and
        //       therefore no API call will be make unless the last_edit_time has changed
        { ttl: this.ttl.pageContent },
      );

      return normalizedPage;
    }
  }
}

/**
 * get all records from a method that need to be called multiple times to get all the paginated records
 * @param fn a Notion client function that returns paginated results
 * @param arg arguments for the function
 * @returns complete list of records
 */
async function getAll<
  F extends Client['blocks']['children']['list'] | Client['databases']['query'],
>(fn: F, arg: Parameters<F>[0]): Promise<Awaited<ReturnType<F>>['results']>;
/* eslint-disable @typescript-eslint/naming-convention */
async function getAll<A extends object>(
  fn2: (
    arg: { page_size: number; start_cursor: string | undefined } & A,
  ) => Promise<NotionAPIList>,
  arg: A,
): Promise<NotionAPIList['results']> {
  const state: { next: string | undefined; hasMore: boolean } = {
    next: undefined,
    hasMore: true,
  };
  const entities: NotionAPIList['results'] = [];

  while (state.hasMore) {
    const { has_more, next_cursor, results } = await fn2({
      ...arg,
      page_size: 100,
      start_cursor: state.next,
    });

    // update the current state
    Object.assign(state, { hasMore: has_more, next: next_cursor ?? undefined });

    // push the results to the list
    entities.push(...results);
  }

  return entities;
}
/* eslint-enable @typescript-eslint/naming-convention */
