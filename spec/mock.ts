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

import * as examples from './examples';

import type { APIErrorCode } from '@notionhq/client';
import type { Interceptor } from 'nock';

import type { NotionAPIPropertyValue } from '#types';

type MockedError =
  | { type: 'code'; status: number; code: APIErrorCode }
  | { type: 'network' };

function mockError(arg: { instance: Interceptor; error: MockedError }): void {
  const { error, instance } = arg;
  if (error.type === 'code') {
    instance.reply(error.status, {
      object: 'error',
      status: error.status,
      code: error.code,
      message: 'error message',
    });
  } else if (error.type === 'network') {
    instance.replyWithError('Network error');
  }
}

export function mockBlockList(arg: {
  blockID: string;
  blocks?: number;
  hasChildren?: boolean;
}) {
  const { blockID, blocks: count = 0, hasChildren = true } = arg;

  if (hasChildren) {
    // mock the API for the children
    for (let i = 0; i < count; i++) {
      mockBlockList({
        blockID: `${blockID}-block${i}`,
        blocks: 1,
        hasChildren: false,
      });
    }
  }

  nock('https://api.notion.com')
    .get(`/v1/blocks/${blockID}/children`)
    .query(true)
    // .times(count)
    .reply((uri) => {
      const query = new URL(uri, 'https://api.notion.com').searchParams;

      const current = Number(query.get('start_cursor') ?? 0);
      const body = examples.buildDummyBlockList({
        // NOTE: one block per call
        blockIDs: [`${blockID}-block${current}`],
        hasChildren,
        next: current + 1 < count ? `${current + 1}` : null,
      });

      return [200, body];
    })
    .persist();
}

export function mockUser(
  arg: Parameters<typeof examples.buildDummyUser>[0],
  options?: {
    error?: MockedError;
    count?: number;
  },
) {
  const { userID } = arg;
  const { error, count = 0 } = { ...options };

  const instance = nock('https://api.notion.com')
    .get(`/v1/users/${userID}`)
    .times(count);

  if (error) {
    mockError({ instance, error });
  } else {
    const body = examples.buildDummyUser(arg);
    instance.reply(200, body);
  }
}

export function mockDatabase(arg: {
  databaseID: string;
  pages?: number;
  blocks?: number;
}) {
  const { databaseID, pages = 1, blocks = 1 } = arg;

  mockUser({ userID: 'person_user' });
  mockDatabasePageList({ databaseID, pages, blocks });

  const body = examples.buildDummyDatabase({ databaseID });

  nock('https://api.notion.com')
    .get(`/v1/databases/${databaseID}`)
    .reply(200, body)
    .persist();
}

export function mockDatabasePageList(arg: {
  databaseID: string;
  pages?: number;
  blocks?: number;
}): void {
  const { databaseID, pages = 0, blocks = 1 } = arg;

  for (const pageID of [...Array(pages).keys()]) {
    mockBlockList({ blockID: `${databaseID}-page${pageID}`, blocks });
  }

  nock('https://api.notion.com')
    .post(`/v1/databases/${databaseID}/query`)
    .reply((_uri, payload) => {
      const current = Number(
        (payload as { start_cursor?: string }).start_cursor ?? 0,
      );

      const body = examples.buildDummyDatabasePageList({
        databaseID,
        // NOTE: one page per call
        pageIDs: [`${databaseID}-page${current}`],
        next: current + 1 < pages ? `${databaseID}-page${current + 1}` : null,
      });

      return [200, body];
    })
    .persist();
}

export function mockPage(arg: {
  pageID: string;
  blocks?: number;
  properties?: Record<string, NotionAPIPropertyValue>;
}): void {
  const { pageID, blocks = 1, properties = {} } = arg;

  mockUser({ userID: 'person_user' });
  mockBlockList({ blockID: pageID, blocks: blocks });

  const body = examples.buildDummyPage({ pageID, properties });

  nock('https://api.notion.com')
    .get(`/v1/pages/${pageID}`)
    .reply(200, body)
    .persist();
}
