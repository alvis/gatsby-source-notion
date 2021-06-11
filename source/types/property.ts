/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Collection of property related types
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import type { Color, RichText } from './format';
import type { User } from './user';

/*
 * Base
 */

interface PropertyBase<T extends string = string> {
  type: T;
}

/*
 * Title
 */

export interface TitleMeta extends PropertyBase<'title'> {
  title: Record<string, never>;
}
export interface TitleValue extends PropertyBase<'title'> {
  title: RichText[];
}

/*
 * Rich Text
 */

export interface RichTextMeta extends PropertyBase<'rich_text'> {
  rich_text: Record<string, never>;
}
export interface RichTextValue extends PropertyBase<'rich_text'> {
  rich_text: RichText[];
}

/*
 * Number
 */

export interface NumberMeta extends PropertyBase<'number'> {
  number: {
    format:
      | 'number'
      | 'number_with_commas'
      | 'percent'
      | 'dollar'
      | 'euro'
      | 'pound'
      | 'yen'
      | 'ruble'
      | 'rupee'
      | 'won'
      | 'yuan';
  };
}
export interface NumberValue extends PropertyBase<'number'> {
  number: number;
}

/*
 * Selection
 */

export interface SelectOption {
  name: string;
  id: string;
  color: Color;
}

export interface SelectMeta extends PropertyBase<'select'> {
  select: { options: SelectOption[] };
}
export interface SelectValue extends PropertyBase<'select'> {
  select: SelectOption;
}

export interface MultiSelectMeta extends PropertyBase<'multi_select'> {
  multi_select: {
    options: SelectOption[];
  };
}
export interface MultiSelectValue extends PropertyBase<'multi_select'> {
  multi_select: SelectOption[];
}

/*
 * Date
 */

export interface DateMeta extends PropertyBase<'date'> {
  date: Record<string, never>;
}
export interface DateValue extends PropertyBase<'date'> {
  date: {
    start: string;
    end?: string;
  };
}

/*
 * People
 */

export interface PeopleMeta extends PropertyBase<'people'> {
  people: Record<string, never>;
}
export interface PeopleValue extends PropertyBase<'people'> {
  people: User[];
}

/*
 * File
 */

export interface FilesMeta extends PropertyBase<'files'> {
  files: Record<string, never>;
}
export interface FilesValue extends PropertyBase<'files'> {
  files: { name: string }[];
}

/*
 * Checkbox
 */

export interface CheckboxMeta extends PropertyBase<'checkbox'> {
  checkbox: Record<string, never>;
}
export interface CheckboxValue extends PropertyBase<'checkbox'> {
  checkbox: boolean;
}

/*
 * URL
 */

export interface URLMeta extends PropertyBase<'url'> {
  url: Record<string, never>;
}
export interface URLValue extends PropertyBase<'url'> {
  url: string;
}

/*
 * Contact
 */

export interface EmailMeta extends PropertyBase<'email'> {
  email: Record<string, never>;
}
export interface EmailValue extends PropertyBase<'email'> {
  email: string;
}

export interface PhoneNumberMeta extends PropertyBase<'phone_number'> {
  phone_number: Record<string, never>;
}
export interface PhoneNumberValue extends PropertyBase<'phone_number'> {
  phone_number: string;
}

/*
 * Formula
 */
export interface StringFormulaValue {
  type: 'string';
  string?: string;
}
export interface NumberFormulaValue {
  type: 'number';
  number?: number;
}
export interface BooleanFormulaValue {
  type: 'boolean';
  boolean: boolean;
}

export interface FormulaMeta extends PropertyBase<'formula'> {
  formula: {
    expression: string;
  };
}
export interface FormulaValue extends PropertyBase<'formula'> {
  formula:
    | StringFormulaValue
    | NumberFormulaValue
    | BooleanFormulaValue
    | DateValue;
}

/*
 * Relation
 */

export interface RelationMeta extends PropertyBase<'relation'> {
  relation: {
    database_id: string;
    synced_property_name?: string;
    synced_property_id?: string;
  };
}
export interface RelationValue extends PropertyBase<'relation'> {
  relation: Array<{
    id: string;
  }>;
}

/*
 * Rollup
 */

export interface ArrayRollupValue {
  type: 'array';
  array: PropertyValue[];
}

export interface RollupMeta extends PropertyBase<'rollup'> {
  rollup: {
    relation_property_name: string;
    relation_property_id: string;
    rollup_property_name: string;
    rollup_property_id: string;
    function:
      | 'count_all'
      | 'count_values'
      | 'count_unique_values'
      | 'count_empty'
      | 'count_not_empty'
      | 'percent_empty'
      | 'percent_not_empty'
      | 'sum'
      | 'average'
      | 'median'
      | 'min'
      | 'max'
      | 'range'
      | 'show_unique'
      | 'show_original';
  };
}
export interface RollupValue extends PropertyBase<'rollup'> {
  rollup: NumberValue | DateValue | ArrayRollupValue;
}

/*
 * Metadata
 */

export interface CreatedByMeta extends PropertyBase<'created_by'> {
  created_by: Record<string, never>;
}
export interface CreatedByValue extends PropertyBase<'created_by'> {
  created_by: User;
}
export interface CreatedTimeMeta extends PropertyBase<'created_time'> {
  created_time: Record<string, never>;
}
export interface CreatedTimeValue extends PropertyBase<'created_time'> {
  created_time: string;
}

export interface LastEditedByMeta extends PropertyBase<'last_edited_by'> {
  last_edited_by: Record<string, never>;
}
export interface LastEditedByValue extends PropertyBase<'last_edited_by'> {
  last_edited_by: User;
}

export interface LastEditedTimeMeta extends PropertyBase<'last_edited_time'> {
  last_edited_time: Record<string, never>;
}
export interface LastEditedTimeValue extends PropertyBase<'last_edited_time'> {
  last_edited_time: string;
}

/*
 * Main
 */

export type PropertyMeta =
  | TitleMeta
  | RichTextMeta
  | NumberMeta
  | SelectMeta
  | MultiSelectMeta
  | DateMeta
  | PeopleMeta
  | FilesMeta
  | CheckboxMeta
  | URLMeta
  | EmailMeta
  | PhoneNumberMeta
  | FormulaMeta
  | RelationMeta
  | RollupMeta
  | CreatedByMeta
  | CreatedTimeMeta
  | LastEditedByMeta
  | LastEditedTimeMeta;

export type PropertyValue =
  | TitleValue
  | RichTextValue
  | NumberValue
  | SelectValue
  | MultiSelectValue
  | DateValue
  | PeopleValue
  | FilesValue
  | CheckboxValue
  | URLValue
  | EmailValue
  | PhoneNumberValue
  | FormulaValue
  | RelationValue
  | RollupValue
  | CreatedByValue
  | CreatedTimeValue
  | LastEditedByValue
  | LastEditedTimeValue;

export type PropertyMetaMap = {
  [propertyName: string]: { id: string } & PropertyMeta;
};
export type PropertyValueMap = {
  [propertyName: string]: { id: string } & PropertyValue;
};
