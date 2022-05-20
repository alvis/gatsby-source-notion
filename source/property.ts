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

import type {
  InaccessibleNotionAPIUser,
  NormalizedValue,
  NotionAPIFile,
  NotionAPIPage,
  NotionAPIPropertyValue,
  NotionAPIPropertyValueWithoutID,
  NotionAPIRichText,
  NotionAPIUser,
  Person,
} from './types';

/* eslint-disable complexity,max-lines-per-function,sonarjs/cognitive-complexity */
/**
 * extract the content from a property
 * @param property a property returned from Notion API
 * @returns its content
 */
export function getPropertyContent<
  T extends NotionAPIPropertyValueWithoutID<NotionAPIPropertyValue>['type'],
>(
  property: NotionAPIPropertyValueWithoutID<NotionAPIPropertyValue>,
): {
  /* eslint-disable @typescript-eslint/naming-convention */
  [K: string]: any;
  title: string;
  rich_text: string;
  number: number;
  select: string | null;
  multi_select: string[];
  date: string | null;
  people: Person[];
  files: File[];
  checkbox: boolean;
  url: string | null;
  email: string | null;
  phone_number: string | null;
  formula: boolean | number | string | null;
  rollup: number | string | null;
  created_time: string;
  last_edited_time: string;
  /* eslint-enable @typescript-eslint/naming-convention */
}[T];
export function getPropertyContent(
  property: NotionAPIPropertyValueWithoutID<NotionAPIPropertyValue>,
): NormalizedValue {
  switch (property.type) {
    case 'title':
      return getPropertyContentFromRichText(property.title);
    case 'rich_text':
      return getPropertyContentFromRichText(property.rich_text);
    case 'number':
      return property.number;
    case 'select':
      return property.select?.name ?? null;
    case 'multi_select':
      return property.multi_select.map((value) => value.name);
    case 'date':
      return property.date;
    case 'people':
      return property.people
        .filter(isPropertyAccessible)
        .map(getPropertyContentFromUser)
        .filter((user) => !!user);
    case 'files':
      return property.files.map((file) => ({
        name: file.name,
        url: getPropertyContentFromFile(file),
      }));
    case 'checkbox':
      return property.checkbox;
    case 'url':
      return property.url;
    case 'email':
      return property.email;
    case 'phone_number':
      return property.phone_number;
    case 'formula':
      return getPropertyContentFromFormula(property.formula);
    case 'rollup':
      return getPropertyContentFromRollup(property.rollup);
    case 'created_time':
      return property.created_time;
    case 'last_edited_time':
      return property.last_edited_time;
    // @ts-expect-error Notion has unsupported property type in the past and also maybe in future
    case 'unsupported':
      return null;
    /* istanbul ignore next */
    default:
      throw new TypeError(`unknown property`);
  }
}
/* eslint-enable complexity,max-lines-per-function,sonarjs/cognitive-complexity */

/**
 * get the url of a file property
 * @param file a file property returned from Notion API
 * @returns its url
 */
export function getPropertyContentFromFile(file: NotionAPIFile): string {
  if (file.type === 'external') {
    return file.external.url;
  } else if (file.type === 'file') {
    return file.file.url;
  } else {
    throw new TypeError(`unknown file type`);
  }
}

/**
 * extract the content from a formula property
 * @param formula a formula property returned from Notion API
 * @returns its content
 */
export function getPropertyContentFromFormula(
  formula: Extract<NotionAPIPropertyValue, { type: 'formula' }>['formula'],
): NormalizedValue {
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
 * get the plain text from a rich text property
 * @param richtext a rich text property returned from Notion API
 * @returns its content
 */
export function getPropertyContentFromRichText(
  richtext: NotionAPIRichText[],
): string {
  return richtext.map((text) => text.plain_text).join('');
}

/**
 * get the content from a formula property
 * @param rollup a formula property returned from Notion API
 * @returns its content
 */
export function getPropertyContentFromRollup(
  rollup: Extract<NotionAPIPropertyValue, { type: 'rollup' }>['rollup'],
): NormalizedValue {
  switch (rollup.type) {
    case 'number':
      return rollup.number;
    case 'date':
      return rollup.date;
    case 'array':
      return rollup.array.map((item) =>
        getPropertyContent<'people' | 'title' | 'rich_text'>(item),
      );
    /* istanbul ignore next */
    default:
      throw new TypeError(`unknown rollup property`);
  }
}

/**
 * get useful user information
 * @param user a user property returned from Notion API
 * @returns its content
 */
export function getPropertyContentFromUser(
  user: NotionAPIUser | InaccessibleNotionAPIUser | null,
): Person | null {
  if (!user || !isPropertyAccessible(user)) {
    return null;
  }

  if (user.type === 'person') {
    // extract user information from a real user
    return {
      name: user.name,
      avatar: user.avatar_url,
      email: user.person.email ?? null,
    };
  } else if (user.bot.owner.type === 'user') {
    // extract user information from a bot authorized by a user (i.e. not an internal integration)
    return getPropertyContentFromUser(user.bot.owner.user);
  }

  return null;
}

/**
 * indicates if a property is accessible
 * @param property a property returned from Notion API
 * @returns whether it is accessible
 */
export function isPropertyAccessible<
  P extends {
    id: string;
    type?: string;
  },
>(property: P): property is Extract<P, { type: string }> {
  return !!property.type;
}

/**
 * indicates if a property is supported by Notion API
 * @param property a property returned from Notion API
 * @returns whether it is supported
 */
export function isPropertySupported<
  P extends {
    id: string;
    type?: string;
  },
>(property: P): property is Exclude<P, Extract<P, { type: 'unsupported' }>> {
  return property.type !== 'unsupported';
}

/**
 * indicates if a database or page is accessible
 * @param page a database or page returned from Notion API
 * @returns whether it is accessible
 */
export function isPageAccessible<
  P extends {
    id: string;
    object: string;
    url?: string;
  },
>(page: P): page is Extract<P, { url: string }> {
  return !!page.url;
}

/**
 * transform properties from Notion API to its plain value
 * @param properties properties from Notion API
 * @returns properties in plain value
 */
export function normalizeProperties(
  properties: NotionAPIPage['properties'],
): Record<string, NormalizedValue> {
  return Object.fromEntries(
    Object.entries(properties)
      // omit common metadata
      .filter(
        ([, property]) =>
          ![
            'created_by',
            'created_time',
            'last_edited_by',
            'last_edited_time',
            'title',
          ].includes(property.type),
      )
      .map(([key, property]) => [key, getPropertyContent(property)]),
  );
}
