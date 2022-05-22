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

import { APIErrorCode } from '@notionhq/client';

import { Notion } from '#client';
import { mockDatabase, mockPage, mockUser } from './mock';

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
lastEditedByAvatar: 'url'
lastEditedByEmail: 'email'
lastEditedByName: 'Name'
lastEditedTime: '2020-01-01T00:00:00Z'
createdByAvatar: 'url'
createdByEmail: 'email'
createdByName: 'Name'
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

  describe('fn:getUser', () => {
    it('return user information as detail as possible', async () => {
      const userID = 'user_with_full_detail';
      mockUser({ userID });

      const user = await client.getUser(userID);

      expect(user).toEqual({
        object: 'user',
        type: 'person',
        id: userID,
        name: 'Name',
        avatar_url: 'url',
        person: {
          email: 'email',
        },
      });
    });

    it('return null for API token without user read capability', async () => {
      const userID = 'inaccessible_user';
      mockUser(
        { userID },
        {
          error: {
            type: 'code',
            status: 403,
            code: APIErrorCode.RestrictedResource,
          },
        },
      );

      const user = await client.getUser(userID);

      expect(user).toEqual(null);
    });

    it('throw an error if there is any unexpected http error other than 403', async () => {
      const userID = 'http_error';
      mockUser(
        { userID },
        {
          error: { type: 'code', status: 400, code: APIErrorCode.InvalidJSON },
        },
      );

      await expect(async () => client.getUser(userID)).rejects.toThrowError();
    });

    it('throw any non http error', async () => {
      const userID = 'network_error';
      mockUser({ userID }, { error: { type: 'network' } });

      await expect(async () => client.getUser(userID)).rejects.toThrowError();
    });
  });
});
