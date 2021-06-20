/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Collection of API mockers
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import nock from 'nock';
import { URL } from 'url';

import type { Block, Database, List, Page } from '#types';

export function mockBlockList(
  blockID: string,
  count: number = 0,
  hasChildren: boolean = true,
) {
  if (hasChildren) {
    // mock the API for the children
    for (let i = 0; i < count; i++) {
      mockBlockList(`${blockID}-block${i}`, 1, false);
    }
  }

  nock('https://api.notion.com')
    .get(`/v1/blocks/${blockID}/children`)
    .query(true)
    .reply((uri) => {
      const query = new URL(uri, 'https://api.notion.com').searchParams;

      const current = Number(query.get('start_cursor') ?? 0);
      const text = `block ${current} for block ${blockID}`;

      const body: List<Block> = {
        object: 'list',
        results:
          current < count
            ? [
                {
                  object: 'block',
                  id: `${blockID}-block${current}`,
                  created_time: '2020-01-01T00:00:00Z',
                  last_edited_time: '2020-01-01T00:00:00Z',
                  has_children: hasChildren,
                  type: 'paragraph',
                  paragraph: {
                    text: [
                      {
                        type: 'text',
                        text: {
                          content: text,
                          link: null,
                        },
                        annotations: {
                          bold: false,
                          italic: false,
                          strikethrough: false,
                          underline: false,
                          code: false,
                          color: 'default',
                        },
                        plain_text: text,
                        href: null,
                      },
                    ],
                  },
                },
              ]
            : [],
        next_cursor: current + 1 < count ? `${current + 1}` : null,
        has_more: current + 1 < count,
      };

      return [200, body];
    })
    .persist();
}

export function mockDatabase(
  databaseID: string,
  pages: number = 0,
  blocks: number = 1,
) {
  mockDatabasePageList(databaseID, pages, blocks);

  const body: Database = {
    object: 'database',
    id: databaseID,
    created_time: '2020-01-01T00:00:00Z',
    last_edited_time: '2020-01-01T00:00:00Z',
    parent: {
      type: 'workspace',
    },
    title: [
      {
        type: 'text',
        text: {
          content: 'Title',
          link: null,
        },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Title',
        href: null,
      },
    ],
    properties: {
      Name: {
        id: 'title',
        type: 'title',
        title: {},
      },
    },
  };

  nock('https://api.notion.com')
    .get(`/v1/databases/${databaseID}`)
    .reply(200, body)
    .persist();
}

export function mockDatabasePageList(
  databaseID: string,
  pages: number = 0,
  blocks = 1,
) {
  for (const pageID of [...Array(pages).keys()]) {
    mockBlockList(`${databaseID}-page${pageID}`, blocks);
  }
  nock('https://api.notion.com')
    .post(`/v1/databases/${databaseID}/query`)
    .reply((_uri, _body) => {
      const body: List<Page> = {
        object: 'list',
        results: [...Array(pages).keys()].map((pageID) => ({
          object: 'page',
          id: `${databaseID}-page${pageID}`,
          created_time: '2020-01-01T00:00:00Z',
          last_edited_time: '2020-01-01T00:00:00Z',
          parent: {
            type: 'database_id',
            database_id: databaseID,
          },
          archived: false,
          url: `https://www.notion.so/page-title-${databaseID}-page${pageID}`,
          properties: {
            Name: {
              id: 'title',
              title: [
                {
                  annotations: {
                    bold: false,
                    code: false,
                    color: 'default',
                    italic: false,
                    strikethrough: false,
                    underline: false,
                  },
                  href: null,
                  plain_text: 'Title',
                  text: {
                    content: 'Title',
                    link: null,
                  },
                  type: 'text',
                },
              ],
              type: 'title',
            },
          },
        })),

        has_more: false,
        next_cursor: null,
      };

      return [200, body];
    })
    .persist();
}

export function mockPage(pageID: string, blocks: number = 1) {
  mockBlockList(pageID, blocks);

  const body: Page = {
    object: 'page',
    id: pageID,
    created_time: '2020-01-01T00:00:00Z',
    last_edited_time: '2020-01-01T00:00:00Z',
    parent: {
      type: 'database_id',
      database_id: `database-${pageID}`,
    },
    archived: false,
    url: `https://www.notion.so/${pageID}`,
    properties: {
      title: {
        id: 'title',
        title: [
          {
            annotations: {
              bold: false,
              code: false,
              color: 'default',
              italic: false,
              strikethrough: false,
              underline: false,
            },
            href: null,
            plain_text: 'Title',
            text: {
              content: 'Title',
              link: null,
            },
            type: 'text',
          },
        ],
        type: 'title',
      },
    },
  };

  nock('https://api.notion.com')
    .get(`/v1/pages/${pageID}`)
    .reply(200, body)
    .persist();
}
