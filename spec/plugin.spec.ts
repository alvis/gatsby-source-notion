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
  normalizeConfig,
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

  it('increase the call demand if database title and properties etc. needed to be synchronized as well', () => {
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

describe('fn:normalizeConfig', () => {
  const env = { ...process.env };
  afterEach(() => (process.env = { ...env }));

  it('combine options from the environment variables as well', () => {
    process.env.GATSBY_NOTION_DATABASES = 'database_env_1, database_env_2';
    process.env.GATSBY_NOTION_PAGES = 'page_env_1, page_env_2';

    const normalizedConfig = normalizeConfig({
      databases: ['database_options'],
      pages: ['page_options'],
    });

    expect(normalizedConfig.databases).toEqual([
      'database_options',
      'database_env_1',
      'database_env_2',
    ]);

    expect(normalizedConfig.pages).toEqual([
      'page_options',
      'page_env_1',
      'page_env_2',
    ]);
  });
});

describe('fn:getDatabases', () => {
  it('return nothing if no database is supplied', async () => {
    expect(await getDatabases(client, normalizeConfig({}))).toEqual([]);
  });

  it('return databases from Notion API', async () => {
    mockDatabase({ databaseID: 'database' });

    const databases = await getDatabases(
      client,
      normalizeConfig({
        databases: ['database'],
      }),
    );
    expect(databases.length).toEqual(1);
    expect(databases.map((database) => database.id)).toEqual(['database']);
  });
});

describe('fn:getPages', () => {
  it('return nothing if no page is supplied', async () => {
    expect(await getPages(client, normalizeConfig({}))).toEqual([]);
  });

  it('return pages from Notion API', async () => {
    mockPage({ pageID: 'page' });

    const pages = await getPages(
      client,
      normalizeConfig({
        pages: ['page'],
      }),
    );

    expect(pages.length).toEqual(1);
    expect(pages.map((page) => page.id)).toEqual(['page']);
  });
});

describe('fn:sync', () => {
  mockDatabase({ databaseID: 'database' });
  mockPage({ pageID: 'page' });

  it('source all nodes', async () => {
    await sync(
      {} as any,
      normalizeConfig({
        token: 'token',
        databases: ['database'],
        pages: ['page'],
      }),
    );

    expect(mockUpdate).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 'database' }),
        expect.objectContaining({ id: 'page' }),
      ]),
    );
  });
});
