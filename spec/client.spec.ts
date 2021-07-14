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

import { Notion } from '#client';
import { mockDatabase, mockPage } from './mock';

describe('cl:Notion', () => {
  const client = new Notion({ token: 'token' });

  describe('fn:constructor', () => {
    it('warn if no access token is given', () => {
      process.env['GATSBY_NOTION_TOKEN'] = '';
      expect(() => new Notion()).toThrow();
    });
  });

  describe('fn:getDatabase', () => {
    mockDatabase('database', 1);

    it('return full database meta', async () => {
      const database = await client.getDatabase('database');

      expect(database.id).toEqual('database');
      expect(database.pages.length).toEqual(1);
      expect(database.pages[0].id).toEqual('database-page0');
      expect(database.pages[0].title).toEqual('Title');
      expect(database.pages[0].blocks.length).toEqual(1);
    });
  });

  describe('fn:getPage', () => {
    const BLOCKS_PER_PAGE = 2;
    mockPage('page', BLOCKS_PER_PAGE, {
      title: {
        id: 'title',
        type: 'title',
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
      },
      extra: {
        id: 'extra',
        type: 'number',
        number: 0,
      },
    });

    it('return a page in detail', async () => {
      const page = await client.getPage('page');

      expect(page.id).toEqual('page');
      expect(page.title).toEqual('Title');
      expect(page.blocks.length).toEqual(BLOCKS_PER_PAGE);
      expect(page.markdown).toEqual(
        `
---
id: 'page'
title: 'Title'
createdTime: '2020-01-01T00:00:00Z'
lastEditedTime: '2020-01-01T00:00:00Z'
extra: 0
---
block 0 for block page

block 0 for block page-block0

block 1 for block page

block 0 for block page-block1
`.trimStart(),
      );
    });

    it('return a page from the cache', async () => {
      // NOTE:
      const page = await client.getPage('page');

      expect(page.id).toEqual('page');
      expect(page.title).toEqual('Title');
      expect(page.blocks.length).toEqual(BLOCKS_PER_PAGE);
    });
  });
});
