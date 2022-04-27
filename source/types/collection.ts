/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Collection of collection related types
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

/* eslint-disable @typescript-eslint/naming-convention */

import type { Block, FullBlock } from './block';
import type { RichText } from './format';
import type { PropertyMetaMap, PropertyValueMap } from './property';
import type { User } from './user';

/*
 * Parent
 */

interface ParentDatabase {
  type: 'database_id';
  database_id: string;
}

interface ParentPage {
  type: 'page_id';
  page_id: string;
}

interface ParentWorkspace {
  type: 'workspace';
}

/*
 * File
 */

interface UploadedFile {
  type: 'file';
  file: {
    url: string,
  }
}

interface ExternalFile {
  type: 'external';
  external: {
    url: string,
    expiry_time?: string
  }
}

interface Emoji {
  type: 'emoji';
  emoji: string
}

export type File = UploadedFile | ExternalFile;

export type Icon = Emoji | File;

/*
 * Page
 */

export interface Page {
  object: 'page';
  id: string;
  parent: ParentDatabase | ParentPage | ParentWorkspace;
  created_time: string;
  last_edited_time: string;
  archived: boolean;
  icon?: Icon;
  cover?: File;
  properties: PropertyValueMap;
  url: string;
}

export interface FullPage extends Page {
  blocks: FullBlock[];
  markdown: string;
  title: string;
}

/*
 * Database
 */

export interface Database {
  object: 'database';
  id: string;
  parent: ParentPage | ParentWorkspace;
  created_time: string;
  last_edited_time: string;
  archived: boolean;
  title: RichText[];
  icon?: Icon;
  cover?: File;
  properties: PropertyMetaMap;
}

export interface FullDatabase extends Omit<Database, 'title'> {
  pages: FullPage[];
  title: string;
}

/*
 * List
 */

export type Entity = Block | Database | Page | User;

export interface List<E extends Entity = Entity> {
  object: 'list';
  results: E[];
  has_more: boolean;
  next_cursor: string | null;
}

/* eslint-enable */
