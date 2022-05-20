/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Collection of Notion API types
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import type { Client } from '@notionhq/client';

/*
 * User
 */

export type NotionAPIUser = Awaited<ReturnType<Client['users']['retrieve']>>;

export type InaccessibleNotionAPIUser = Pick<NotionAPIUser, 'object' | 'id'>;

/*
 * Block
 */

export type NotionAPIBlock = Extract<
  Awaited<ReturnType<Client['blocks']['retrieve']>>,
  { type: string }
>;

export type InaccessibleNotionAPIBlock = Exclude<
  Awaited<ReturnType<Client['blocks']['retrieve']>>,
  NotionAPIBlock
>;

export type NotionAPIRichText = Extract<
  NotionAPIBlock,
  {
    type: 'paragraph';
  }
>['paragraph']['rich_text'][number];

export type NotionAPITitle = Extract<NotionAPIPropertyValue, { type: 'title' }>;

/*
 * Property
 */

export type NotionAPIPropertyValueWithoutID<P> =
  P extends NotionAPIPage['properties'][string] ? Omit<P, 'id'> : never;
export type NotionAPIPropertyValue = NotionAPIPage['properties'][string];

/*
 * Database
 */

export type NotionAPIDatabase = Extract<
  Awaited<ReturnType<Client['databases']['retrieve']>>,
  { url: string }
>;

export type InaccessibleNotionAPIDatabase = Omit<
  Awaited<ReturnType<Client['databases']['retrieve']>>,
  NotionAPIDatabase
>;

/*
 * Page
 */

export type NotionAPIPage = Extract<
  Awaited<ReturnType<Client['pages']['retrieve']>>,
  { url: string }
>;

export type InaccessibleNotionAPIPage = Omit<
  Awaited<ReturnType<Client['pages']['retrieve']>>,
  NotionAPIPage
>;

/*
 * File
 */

export type NotionAPIFile =
  | {
      type?: 'external';
      external: {
        url: string;
      };
    }
  | {
      type?: 'file';
      file: {
        url: string;
      };
    };

/*
 * List
 */

export type NotionAPIEntity =
  | InaccessibleNotionAPIBlock
  | InaccessibleNotionAPIDatabase
  | InaccessibleNotionAPIPage
  | NotionAPIBlock
  | NotionAPIDatabase
  | NotionAPIPage
  | NotionAPIUser;

export interface NotionAPIList<E extends NotionAPIEntity = NotionAPIEntity> {
  object: 'list';
  results: E[];
  has_more: boolean;
  next_cursor: string | null;
}
