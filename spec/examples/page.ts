/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Collection of page related examples
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import { titleProperty } from './properties';
import { personUser } from './user';

import type {
  InaccessibleNotionAPIPage,
  InaccessibleNotionAPIBlock,
  NotionAPIList,
  NotionAPIPage,
  NotionAPIPropertyValue,
} from '#types';

export const page: NotionAPIPage = buildDummyPage();

export const inaccessiblePage: InaccessibleNotionAPIPage = {
  object: 'page',
  id: 'id',
};

/**
 * generate a dummy Notion API's page object with the given properties
 * @param arg collection of properties to be altered
 * @param arg.pageID the ID of the page to be retrieved
 * @param arg.parent the page's parent object
 * @param arg.properties properties to be altered
 * @returns an object mimicking the body of the return of Notion's page's retrieval API
 */
export function buildDummyPage(arg?: {
  pageID?: string;
  parent?: NotionAPIPage['parent'];
  properties?: Record<string, NotionAPIPropertyValue>;
}): NotionAPIPage {
  const { pageID = 'page', parent, properties = {} } = { ...arg };

  return {
    object: 'page',
    id: pageID,
    url: `https://www.notion.so/workspace/${pageID}`,
    archived: false,
    created_by: personUser,
    created_time: '2020-01-01T00:00:00Z',
    last_edited_by: personUser,
    last_edited_time: '2020-01-01T00:00:00Z',
    cover: {
      type: 'file',
      file: {
        url: 'https://www.notion.so/cover.png',
        expiry_time: '2020-01-01T00:00:00Z',
      },
    },
    icon: {
      type: 'emoji',
      emoji: '📚',
    },
    parent: parent ?? {
      type: 'workspace',
      workspace: true,
    },
    properties: {
      Name: titleProperty,
      ...properties,
    },
  };
}

/**
 * generate a dummy Notion API's page object with the given properties
 * @param arg collection of properties to be altered
 * @param arg.blockIDs list of block IDs to be generated
 * @param arg.hasChildren indicate whether the blocks generated have children
 * @param arg.next value of `next_cursor`
 * @returns an object mimicking the body of the return of Notion's page's retrieval API
 */
export function buildDummyBlockList(arg: {
  blockIDs: string[];
  hasChildren?: boolean;
  next?: string | null;
}): NotionAPIList<InaccessibleNotionAPIBlock> {
  const { blockIDs, hasChildren = false, next } = arg;

  return {
    object: 'list',
    results: blockIDs.map((blockID) => ({
      object: 'block',
      id: blockID,
      archived: false,
      created_by: personUser,
      created_time: '2020-01-01T00:00:00Z',
      last_edited_by: personUser,
      last_edited_time: '2020-01-01T00:00:00Z',
      has_children: hasChildren,
      type: 'paragraph',
      paragraph: {
        color: 'default',
        rich_text: [
          {
            type: 'text',
            text: {
              content: blockID,
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
            plain_text: blockID,
            href: null,
          },
        ],
      },
    })),

    next_cursor: next ?? null,
    has_more: !!next,
  };
}
