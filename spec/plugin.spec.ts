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
import { getDatabases, getPages } from '#plugin';
import { mockDatabase, mockPage } from './mock';

const client = new Notion({ token: 'token' });

describe('fn:getDatabases', () => {
  it('return nothing if no database is supplied', async () => {
    expect(await getDatabases(client, { plugins: [] })).toEqual([]);
  });

  it('return a combined list of databases from the options and environment variables', async () => {
    mockDatabase('database_from_options');
    mockDatabase('database_from_env_1');
    mockDatabase('database_from_env_2');

    process.env['GATSBY_NOTION_DATABASES'] =
      'database_from_env_1, database_from_env_2';

    const databases = await getDatabases(client, {
      plugins: [],
      databases: ['database_from_options'],
    });
    expect(databases.length).toEqual(3);
    expect(databases.map((database) => database.id)).toEqual([
      'database_from_options',
      'database_from_env_1',
      'database_from_env_2',
    ]);
  });
});

describe('fn:getPages', () => {
  it('return nothing if no page is supplied', async () => {
    expect(await getPages(client, { plugins: [] })).toEqual([]);
  });

  it('return a combined list of pages from the options and environment variables', async () => {
    mockPage('page_from_options');
    mockPage('page_from_env_1');
    mockPage('page_from_env_2');

    process.env['GATSBY_NOTION_PAGES'] = 'page_from_env_1, page_from_env_2';

    const pages = await getPages(client, {
      plugins: [],
      pages: ['page_from_options'],
    });
    expect(pages.length).toEqual(3);
    expect(pages.map((page) => page.id)).toEqual([
      'page_from_options',
      'page_from_env_1',
      'page_from_env_2',
    ]);
  });
});
