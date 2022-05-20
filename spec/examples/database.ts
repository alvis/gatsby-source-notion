/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Collection of database related examples
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import { buildDummyPage } from './page';
import { titleProperty } from './properties';
import { personUser } from './user';

import type {
  InaccessibleNotionAPIDatabase,
  NotionAPIDatabase,
  NotionAPIList,
  NotionAPIPage,
} from '#types';

export const database = buildDummyDatabase();

export const inaccessibleDatabase: InaccessibleNotionAPIDatabase = {
  object: 'database',
  id: 'id',
  properties: {},
};

/**
 * generate a dummy Notion API's database object with the given properties
 * @param arg collection of properties to be altered
 * @param arg.databaseID the ID of the database to be retrieved
 * @returns an object mimicking the body of the return of Notion's database's retrieval API
 */
export function buildDummyDatabase(arg?: {
  databaseID?: string;
}): NotionAPIDatabase {
  const { databaseID = 'database' } = { ...arg };

  return {
    object: 'database',
    id: databaseID,
    url: `https://www.notion.so/workspace/${databaseID}`,
    archived: false,
    created_by: personUser,
    created_time: '2020-01-01T00:00:00Z',
    last_edited_by: personUser,
    last_edited_time: '2020-01-01T00:00:00Z',
    parent: {
      type: 'workspace',
      workspace: true,
    },
    cover: {
      type: 'external',
      external: {
        url: 'https://www.notion.so/cover.png',
      },
    },
    icon: {
      type: 'emoji',
      emoji: '📚',
    },
    title: titleProperty.title,
    properties: {
      Name: {
        id: 'title',
        type: 'title',
        name: 'title',
        title: {},
      },
    },
  };
}

/**
 * generate a dummy Notion API's database page list object with the given properties
 * @param arg collection of properties to be altered
 * @param arg.databaseID the ID of the database to be retrieved
 * @param arg.pageIDs list of page ids to be returned
 * @param arg.next value of `next_cursor`
 * @returns an object mimicking the body of the return of Notion's database's retrieval API
 */
export function buildDummyDatabasePageList(arg: {
  databaseID: string;
  pageIDs: string[];
  next?: string | null;
}): NotionAPIList<NotionAPIPage> {
  const { databaseID, pageIDs, next } = arg;

  return {
    object: 'list',
    results: pageIDs.map((pageID) =>
      buildDummyPage({
        pageID,
        parent: {
          type: 'database_id',
          database_id: databaseID,
        },
      }),
    ),

    next_cursor: next ?? null,
    has_more: !!next,
  };
}
