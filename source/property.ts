/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Helpers for property handling
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import type { FormulaValue, PropertyValue, RollupValue, User } from './types';

type Date = { start: string; end?: string };

type Person = { name: string; avatar?: string };

type NormalisedValue =
  | undefined
  | boolean
  | number
  | string
  | string[]
  | Date
  | Person
  | NormalisedValue[];

/* eslint-disable max-lines-per-function */
/**
 * extract the content from a property
 * @param property a property returned from Notion API
 * @returns its content
 */
export function getPropertyContent(property: PropertyValue): NormalisedValue {
  switch (property.type) {
    case 'title':
      return property.title.map((text) => text.plain_text).join('');
    case 'rich_text':
      return property.rich_text.map((text) => text.plain_text).join('');
    case 'number':
      return property.number;
    case 'select':
      return property.select.name;
    case 'multi_select':
      return property.multi_select.map((value) => value.name);
    case 'date':
      return property.date;
    case 'people':
      return property.people.map(getUserContent);
    case 'files':
      return property.files.map((file) => file.name);
    case 'checkbox':
      return property.checkbox;
    case 'url':
      return property.url;
    case 'email':
      return property.email;
    case 'phone_number':
      return property.phone_number;
    case 'formula':
      return getFormulaPropertyContent(property.formula);
    case 'relation':
      return undefined;
    case 'rollup':
      return getRollupPropertyContent(property.rollup);
    case 'created_by':
      return getUserContent(property.created_by);
    case 'created_time':
      return property.created_time;
    case 'last_edited_by':
      return getUserContent(property.last_edited_by);
    case 'last_edited_time':
      return property.last_edited_time;
    /* istanbul ignore next */
    default:
      throw new TypeError(`unknown property`);
  }
}
/* eslint-enable */

/**
 * extract the content from a formula property
 * @param formula a formula property returned from Notion API
 * @returns its content
 */
function getFormulaPropertyContent(
  formula: FormulaValue['formula'],
): NormalisedValue {
  switch (formula.type) {
    case 'string':
      return formula.string;
    case 'number':
      return formula.number;
    case 'boolean':
      return formula.boolean;
    case 'date':
      return formula.date;
    /* istanbul ignore next */
    default:
      throw new TypeError(`unknown formula property`);
  }
}

/**
 * extract the content from a formula property
 * @param rollup a formula property returned from Notion API
 * @returns its content
 */
function getRollupPropertyContent(
  rollup: RollupValue['rollup'],
): NormalisedValue | NormalisedValue[] {
  switch (rollup.type) {
    case 'number':
      return rollup.number;
    case 'date':
      return rollup.date;
    case 'array':
      return rollup.array.map(getPropertyContent);
    /* istanbul ignore next */
    default:
      throw new TypeError(`unknown rollup property`);
  }
}

/**
 * extract useful user information
 * @param user a user property returned from Notion API
 * @returns its content
 */
function getUserContent(user: User): Person {
  return {
    name: user.name,
    avatar: user.avatar_url,
  };
}
