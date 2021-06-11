/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Collection of block related types
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import type { RichText } from './format';

interface BlockBase<T extends string> {
  object: 'block';
  id: string;
  type: T;
  created_time: string;
  last_edited_time: string;
  has_children: boolean;
}

interface HeadingOneBlock extends BlockBase<'heading_1'> {
  heading_1: { text: RichText[] };
}

interface HeadingTwoBlock extends BlockBase<'heading_2'> {
  heading_2: { text: RichText[] };
}

interface HeadingThreeBlock extends BlockBase<'heading_3'> {
  heading_3: { text: RichText[] };
}

interface ParagraphBlock extends BlockBase<'paragraph'> {
  paragraph: {
    text: RichText[];
  };
}

interface BulletedListItemBlock extends BlockBase<'bulleted_list_item'> {
  bulleted_list_item: {
    text: RichText[];
  };
}

interface NumberedListItemBlock extends BlockBase<'numbered_list_item'> {
  numbered_list_item: {
    text: RichText[];
  };
}

interface ToDoBlock extends BlockBase<'to_do'> {
  to_do: {
    text: RichText[];
    checked: boolean;
  };
}

interface ToggleBlock extends BlockBase<'toggle'> {
  toggle: {
    text: RichText[];
  };
}

interface ChildPageBlock extends BlockBase<'child_page'> {
  child_page: { title: string };
}

interface UnsupportedBlock extends BlockBase<'unsupported'> {
  unsupported: Record<string, never>;
}

export type Block =
  | ParagraphBlock
  | HeadingOneBlock
  | HeadingTwoBlock
  | HeadingThreeBlock
  | BulletedListItemBlock
  | NumberedListItemBlock
  | ToDoBlock
  | ToggleBlock
  | ChildPageBlock
  | UnsupportedBlock;

export type FullBlock = Block &
  ({ has_children: false } | { has_children: true; children: FullBlock[] });
