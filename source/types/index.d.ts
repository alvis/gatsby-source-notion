/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Collection of types
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

/** istanbul ignore file */

import type {
  NotionAPIDatabase,
  NotionAPIBlock,
  NotionAPIPage,
  NotionAPIUser,
  InaccessibleNotionAPIUser,
} from './api';

export * from './api';

/*
 * Helper
 */

export type EntityWithUserDetail<
  E extends NotionAPIBlock | NotionAPIDatabase | NotionAPIPage,
> = E extends any
  ? Omit<E, 'created_by' | 'last_edited_by'> & {
      created_by: NotionAPIUser | null;
      last_edited_by: NotionAPIUser | null;
    }
  : never;

/*
 * Property
 */

export type Date = {
  start: string;
  end: string | null;
  time_zone: string | null;
};

export type File = {
  name: string | null;
  url: string;
};

export type Person = {
  name: string | null;
  avatar: string | null;
  email: string | null;
};

export type NormalizedValue =
  | null
  | boolean
  | number
  | string
  | string[]
  | Date
  | File
  | Person
  | NormalizedValue[];

/*
 * Block
 */

export type Block = NotionAPIBlock &
  ({ has_children: false } | { has_children: true; children: Block[] });

/*
 * Page & Database
 */

export type Metadata = {
  url: string;
  createdTime: string;
  lastEditedTime: string;
};

export type Page = {
  id: string;
  object: NotionAPIPage['object'];
  parent: NotionAPIPage['parent'];
  title: string;
  metadata: Metadata;
  properties: Record<string, NormalizedValue>;
  blocks: Block[];
  markdown: string;
};

export type Database = {
  id: string;
  object: NotionAPIDatabase['object'];
  parent: NotionAPIDatabase['parent'];
  title: string;
  metadata: Metadata;
  pages: Page[];
};
