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

import { dump } from 'js-yaml';
import got from 'got';

import { markdown } from '#markdown';

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
  TitleValue,
} from './types';

interface Pagination extends Record<string, number | string | undefined> {
  /* eslint-disable @typescript-eslint/naming-convention */
  start_cursor?: string;
  page_size?: number;
  /* eslint-enable */
}

export interface NotionOptions {
  /** access token, default to be the environment variable GATSBY_NOTION_TOKEN */
  token?: string;
  /** api version, default to be 2021-05-13 */
  version?: string;
}

/** A simple Notion client */
export class Notion {
  private client: Got;

  /**
   * create a Notion client with plugin options
   * @param options token and api version etc.
   * @returns a Notion client
   */
  constructor(options?: NotionOptions) {
    const { token = process.env.GATSBY_NOTION_TOKEN, version = '2021-05-13' } =
      {
        ...options,
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
    const { body } = await this.client.get<Database>(`databases/${id}`);
    const pages = await this.getCompleteList<Page>({
      method: 'post',
      url: `databases/${id}/query`,
    });

    return {
      ...body,
      title: body.title.map((text) => text.plain_text).join(''),
      pages: await Promise.all(pages.map(this.normalisePage.bind(this))),
    };
  }

  /**
   * get everything related to a page
   * @param id the uuid of the page
   * @returns metadata and its content
   */
  public async getPage(id: string): Promise<FullPage> {
    const { body } = await this.client.get<Page>(`pages/${id}`);

    return this.normalisePage(body);
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
    const blocks = await this.getBlocks(page.id);
    // Name for a page in a database, title for an ordinary page
    /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */
    const titleBlock = (page.properties.Name ??
      page.properties.title) as TitleValue;

    const title = titleBlock.title.map((text) => text.plain_text).join('');
    const frontmatter = [
      '---',
      dump(
        {
          id: page.id,
          title,
          createdTime: page.created_time,
          lastEditedTime: page.last_edited_time,
        },
        { forceQuotes: true },
      ).trim(),
      '---',
    ].join('\n');
    const md = markdown(blocks);

    return { ...page, blocks, title, markdown: [frontmatter, md].join('\n') };
  }
}
