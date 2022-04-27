/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Tests on node generation
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import { Notion } from '#client';
import {
  computePreviewUpdateInterval,
  getDatabases,
  getPages,
  normaliseConfig,
  sync,
} from '#plugin';
import { mockDatabase, mockPage } from './mock';

const mockUpdate = jest.fn();
jest.mock('#node', () => ({
  __esModule: true,
  NodeManager: jest.fn().mockImplementation(() => {
    return { update: mockUpdate };
  }),
}));

const client = new Notion({ token: 'token' });

describe('fn:computeUpdateInterval', () => {
  it('compute the interval based on the total number of databases and pages', () => {
    expect(
      computePreviewUpdateInterval({
        databases: ['database1', 'database2'],
        pages: ['page1', 'page2'],
        // 2 for database page query, 2 for page query
        previewCallRate: 4,
        // cache database title, but not pages' properties
        previewTTL: {
          databaseMeta: 0,
          databaseEntries: 1,
          pageMeta: 1,
          pageContent: 0,
        },
        plugins: [],
      }),
    ).toEqual(1000);
  });

  it('increase the call demand if database title and properties etc. needed to be synchronised as well', () => {
    expect(
      computePreviewUpdateInterval({
        databases: ['database1', 'database2'],
        pages: ['page1', 'page2'],
        // 2 for database meta, 2 for database page query, 2 for page query
        previewCallRate: 6,
        // cache database title, but not pages' properties
        previewTTL: {
          databaseMeta: 1,
          databaseEntries: 1,
          pageMeta: 1,
          // NOTE pageContent doesn't make a difference here because it will be reloaded if the `last_edited_time` has changed
          pageContent: 1,
        },
        plugins: [],
      }),
    ).toEqual(1000);
  });

  it('return null if everything is cached', () => {
    expect(
      computePreviewUpdateInterval({
        databases: ['database1', 'database2'],
        pages: ['page1', 'page2'],
        // 2 for database meta, 2 for database page query, 2 for page query
        previewCallRate: 100,
        // cache database title, but not pages' properties
        previewTTL: {
          databaseMeta: 0,
          databaseEntries: 0,
          pageMeta: 0,
          pageContent: 0,
        },
        plugins: [],
      }),
    ).toEqual(null);
  });
});

describe('fn:normaliseConfig', () => {
  const env = { ...process.env };
  afterEach(() => (process.env = { ...env }));

  it('combine options from the environment variables as well', () => {
    process.env.GATSBY_NOTION_DATABASES = 'database_env_1, database_env_2';
    process.env.GATSBY_NOTION_PAGES = 'page_env_1, page_env_2';

    const normalisedConfig = normaliseConfig({
      databases: ['database_options'],
      pages: ['page_options'],
    });

    expect(normalisedConfig.databases).toEqual([
      'database_options',
      'database_env_1',
      'database_env_2',
    ]);

    expect(normalisedConfig.pages).toEqual([
      'page_options',
      'page_env_1',
      'page_env_2',
    ]);
  });
});

describe('fn:getDatabases', () => {
  it('return nothing if no database is supplied', async () => {
    expect(await getDatabases(client, normaliseConfig({}))).toEqual([]);
  });

  it('return databases from Notion API', async () => {
    mockDatabase('database');

    const databases = await getDatabases(
      client,
      normaliseConfig({
        databases: ['database'],
      }),
    );
    expect(databases.length).toEqual(1);
    expect(databases.map((database) => database.id)).toEqual(['database']);
  });
});

describe('fn:getPages', () => {
  it('return nothing if no page is supplied', async () => {
    expect(await getPages(client, normaliseConfig({}))).toEqual([]);
  });

  it('return pages from Notion API', async () => {
    mockPage('page');

    const pages = await getPages(
      client,
      normaliseConfig({
        pages: ['page'],
      }),
    );
    expect(pages.length).toEqual(1);
    expect(pages.map((page) => page.id)).toEqual(['page']);
  });
});

describe('fn:sync', () => {
  mockDatabase('database');
  mockPage('page');

  it('source all nodes', async () => {
    await sync(
      {} as any,
      normaliseConfig({
        token: 'token',
        databases: ['database'],
        pages: ['page'],
      }),
    );

    expect(mockUpdate).toBeCalledWith([
      {
        created_time: '2020-01-01T00:00:00Z',
        id: 'database',
        last_edited_time: '2020-01-01T00:00:00Z',
        archived: false,
        object: 'database',
        pages: [],
        parent: { type: 'workspace' },
        properties: { Name: { id: 'title', title: {}, type: 'title' } },
        title: 'Title',
      },
      {
        archived: false,
        blocks: [
          {
            children: [
              {
                created_time: '2020-01-01T00:00:00Z',
                has_children: false,
                id: 'page-block0-block0',
                last_edited_time: '2020-01-01T00:00:00Z',
                object: 'block',
                paragraph: {
                  text: [
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
                      plain_text: 'block 0 for block page-block0',
                      text: {
                        content: 'block 0 for block page-block0',
                        link: null,
                      },
                      type: 'text',
                    },
                  ],
                },
                type: 'paragraph',
              },
            ],
            created_time: '2020-01-01T00:00:00Z',
            has_children: true,
            id: 'page-block0',
            last_edited_time: '2020-01-01T00:00:00Z',
            object: 'block',
            paragraph: {
              text: [
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
                  plain_text: 'block 0 for block page',
                  text: { content: 'block 0 for block page', link: null },
                  type: 'text',
                },
              ],
            },
            type: 'paragraph',
          },
        ],
        created_time: '2020-01-01T00:00:00Z',
        id: 'page',
        last_edited_time: '2020-01-01T00:00:00Z',
        markdown:
          "---\nid: 'page'\ntitle: 'Title'\ncreatedTime: '2020-01-01T00:00:00Z'\nlastEditedTime: '2020-01-01T00:00:00Z'\n---\nblock 0 for block page\n\nblock 0 for block page-block0\n",
        object: 'page',
        parent: { database_id: 'database-page', type: 'database_id' },
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
                text: { content: 'Title', link: null },
                type: 'text',
              },
            ],
            type: 'title',
          },
        },
        title: 'Title',
        url: 'https://www.notion.so/page',
      },
    ]);
  });
});
