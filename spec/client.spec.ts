/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Tests on notion client
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import assert from 'assert';

import { Notion, getCommonMetadata } from '#client';
import { mockDatabase, mockPage } from './mock';
import { NotionAPIPage } from '#types';

describe('cl:Notion', () => {
  const client = new Notion({ token: 'token' });

  describe('fn:constructor', () => {
    it('warn if no access token is given', () => {
      process.env['GATSBY_NOTION_TOKEN'] = '';
      expect(() => new Notion()).toThrow();
    });
  });

  describe('fn:getDatabase', () => {
    mockDatabase({ databaseID: 'database', pages: 1 });

    it('return full database meta', async () => {
      const database = await client.getDatabase('database');
      assert(database !== null);

      expect(database.id).toEqual('database');
      expect(database.pages.length).toEqual(1);
      expect(database.pages[0].id).toEqual('database-page0');
      expect(database.pages[0].title).toEqual('Text');
      expect(database.pages[0].blocks.length).toEqual(1);
    });
  });

  describe('fn:getPage', () => {
    const BLOCKS_PER_PAGE = 2;
    mockPage({
      pageID: 'page',
      blocks: BLOCKS_PER_PAGE,
      properties: {
        extra: {
          id: 'extra',
          type: 'number',
          number: 0,
        },
      },
    });

    it('return a page in detail', async () => {
      const page = await client.getPage('page');
      assert(page !== null);

      expect(page.id).toEqual('page');
      expect(page.title).toEqual('Text');
      expect(page.blocks.length).toEqual(BLOCKS_PER_PAGE);
      expect(page.markdown).toEqual(
        `
---
title: 'Text'
url: 'https://www.notion.so/workspace/page'
lastEditedTime: '2020-01-01T00:00:00Z'
createdTime: '2020-01-01T00:00:00Z'
coverImage: 'https://www.notion.so/cover.png'
iconEmoji: '📚'
iconImage: null
---
page-block0

page-block0-block0

page-block1

page-block1-block0
`.trimStart(),
      );
    });

    it('return a page from the cache', async () => {
      // NOTE:
      const page = await client.getPage('page');
      assert(page !== null);

      expect(page.id).toEqual('page');
      expect(page.title).toEqual('Text');
      expect(page.blocks.length).toEqual(BLOCKS_PER_PAGE);
    });
  });
});
