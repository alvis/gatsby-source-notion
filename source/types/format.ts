/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Collection of formatting related types
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import type { DateValue } from './property';
import type { User } from './user';

/*
 * Color
 */

export type Color =
  | 'default'
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red';

export type BackgroundColor =
  | 'gray_background'
  | 'brown_background'
  | 'orange_background'
  | 'yellow_background'
  | 'green_background'
  | 'blue_background'
  | 'purple_background'
  | 'pink_background'
  | 'red_background';

/*
 * Flags
 */

export interface Annotation {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: Color | BackgroundColor;
}

/*
 * Base
 */

interface RichTextBase<T extends string> {
  plain_text: string;
  href: string | null;
  annotations: Annotation;
  type: T;
}

/*
 * Text
 */

interface RichTextText extends RichTextBase<'text'> {
  text: {
    content: string;
    link: { url: string } | null;
  };
}

/*
 * Mention
 */

interface UserMention {
  type: 'user';
  user: User;
}

interface PageMention {
  type: 'page';
  page: { id: string };
}

interface DatabaseMention {
  type: 'database';
  database: { id: string };
}

interface DateMention {
  type: 'date';
  date: DateValue;
}

interface RichTextMention extends RichTextBase<'mention'> {
  mention: UserMention | PageMention | DatabaseMention | DateMention;
}

/*
 * Equation
 */

interface RichTextEquation extends RichTextBase<'equation'> {
  equation: {
    expression: string;
  };
}

/*
 * Main
 */

export type RichText = RichTextText | RichTextMention | RichTextEquation;
