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
import { getDatabases, getPages, normaliseConfig } from '#plugin';
import { mockDatabase, mockPage } from './mock';

const client = new Notion({ token: 'token' });

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
