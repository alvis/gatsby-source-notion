/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Collection of property related examples
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import { personUser } from './user';

import type {
  NormalizedValue,
  NotionAPIPropertyValue,
  NotionAPIRichText,
} from '#types';

export const embeddedFile: Extract<
  NotionAPIPropertyValue,
  { type: 'files' }
>['files'][number] = {
  name: 'embedded file name',
  type: 'file',
  file: {
    url: 'url',
    expiry_time: '2020-01-01T00:00:00Z',
  },
};

export const externalFile: Extract<
  NotionAPIPropertyValue,
  { type: 'files' }
>['files'][number] = {
  name: 'external file name',
  type: 'external',
  external: {
    url: 'url',
  },
};

export const text: NotionAPIRichText = {
  type: 'text',
  text: {
    content: 'Text',
    link: null,
  },
  annotations: {
    bold: true,
    italic: true,
    strikethrough: true,
    underline: true,
    code: true,
    color: 'default',
  },
  plain_text: 'Text',
  href: null,
};

export const personUserContent: NormalizedValue = {
  avatar: 'url',
  email: 'email',
  name: 'Name',
};

export const personUserWithoutEmailContent: NormalizedValue = {
  avatar: 'url',
  email: null,
  name: 'Name',
};

export const titleProperty: Extract<NotionAPIPropertyValue, { type: 'title' }> =
  {
    id: 'id',
    type: 'title',
    title: [text],
  };

export const titleContent: NormalizedValue = 'Text';

export const richTextProperty: Extract<
  NotionAPIPropertyValue,
  { type: 'rich_text' }
> = {
  id: 'id',
  type: 'rich_text',
  rich_text: [text],
};

export const richTextContent: NormalizedValue = 'Text';

export const numberProperty: NotionAPIPropertyValue = {
  id: 'id',
  type: 'number',
  number: 0,
};

export const numberContent: NormalizedValue = 0;

export const selectionProperty: NotionAPIPropertyValue = {
  id: 'id',
  type: 'select',
  select: {
    color: 'default',
    id: 'id',
    name: 'Selection',
  },
};

export const selectionContent: NormalizedValue = 'Selection';

export const multipleSelectionProperty: NotionAPIPropertyValue = {
  id: 'id',
  type: 'multi_select',
  multi_select: [
    {
      color: 'default',
      id: 'id',
      name: 'Selection',
    },
  ],
};

export const multipleSelectionContent: NormalizedValue = ['Selection'];

export const dateProperty: NotionAPIPropertyValue = {
  id: 'id',
  type: 'date',
  date: { start: '2020-01-01T00:00:00Z', end: null, time_zone: null },
};

export const dateContent: NormalizedValue = {
  start: '2020-01-01T00:00:00Z',
  end: null,
  time_zone: null,
};

export const peopleProperty: NotionAPIPropertyValue = {
  id: 'id',
  type: 'people',
  people: [
    {
      object: 'user',
      id: 'id',
      type: 'person',
      person: {
        email: 'email',
      },
      name: 'Name',
      avatar_url: 'url',
    },
  ],
};

export const peopleContent: NormalizedValue = [
  { name: 'Name', avatar: 'url', email: 'email' },
];

export const filesProperty: NotionAPIPropertyValue = {
  id: 'id',
  type: 'files',
  files: [embeddedFile, externalFile],
};

export const filesContent: NormalizedValue = [
  { name: 'embedded file name', url: 'url' },
  { name: 'external file name', url: 'url' },
];

export const checkboxProperty: NotionAPIPropertyValue = {
  id: 'id',
  type: 'checkbox',
  checkbox: true,
};

export const checkboxContent: NormalizedValue = true;

export const urlProperty: NotionAPIPropertyValue = {
  id: 'id',
  type: 'url',
  url: 'url',
};

export const urlContent: NormalizedValue = 'url';

export const emailProperty: NotionAPIPropertyValue = {
  id: 'id',
  type: 'email',
  email: 'email',
};

export const emailContent: NormalizedValue = 'email';

export const formulaStringProperty: NotionAPIPropertyValue = {
  id: 'id',
  type: 'formula',
  formula: {
    string: 'text',
    type: 'string',
  },
};

export const formulaStringContent: NormalizedValue = 'text';

export const formulaNumberProperty: NotionAPIPropertyValue = {
  id: 'id',
  type: 'formula',
  formula: {
    number: 0,
    type: 'number',
  },
};

export const formulaNumberContent: NormalizedValue = 0;

export const formulaBooleanProperty: NotionAPIPropertyValue = {
  id: 'id',
  type: 'formula',
  formula: {
    boolean: true,
    type: 'boolean',
  },
};

export const formulaBooleanContent: NormalizedValue = true;

export const formulaDateProperty: NotionAPIPropertyValue = {
  id: 'id',
  type: 'formula',
  formula: {
    date: {
      start: '2020-01-01T00:00:00Z',
      end: null,
      time_zone: null,
    },
    type: 'date',
  },
};

export const formulaDateContent: NormalizedValue = {
  start: '2020-01-01T00:00:00Z',
  end: null,
  time_zone: null,
};

export const phoneNumberProperty: NotionAPIPropertyValue = {
  id: 'id',
  type: 'phone_number',
  phone_number: 'number',
};

export const phoneNumberContent: NormalizedValue = 'number';

export const rollupNumberProperty: NotionAPIPropertyValue = {
  id: 'id',
  type: 'rollup',
  rollup: {
    number: 0,
    type: 'number',
    function: 'sum',
  },
};

export const rollupNumberContent: NormalizedValue = 0;

export const rollupDateProperty: NotionAPIPropertyValue = {
  id: 'id',
  type: 'rollup',
  rollup: {
    date: { start: '2020-01-01T00:00:00Z', end: null, time_zone: null },
    type: 'date',
    function: 'date_range',
  },
};

export const rollupDateContent: NormalizedValue = {
  start: '2020-01-01T00:00:00Z',
  end: null,
  time_zone: null,
};

export const rollupArrayProperty: NotionAPIPropertyValue = {
  id: 'id',
  type: 'rollup',
  rollup: {
    array: [titleProperty, richTextProperty, peopleProperty],
    type: 'array',
    function: 'not_empty',
  },
};

export const rollupArrayContent: NormalizedValue = [
  titleContent,
  richTextContent,
  peopleContent,
];

export const createdByProperty: NotionAPIPropertyValue = {
  id: 'id',
  type: 'created_by',
  created_by: personUser,
};

export const createdByContent: NormalizedValue = {
  name: 'Name',
  avatar: 'url',
  email: 'email',
};

export const createdTimeProperty: NotionAPIPropertyValue = {
  id: 'id',
  type: 'created_time',
  created_time: '2020-01-01T00:00:00Z',
};

export const createdTimeContent: NormalizedValue = '2020-01-01T00:00:00Z';

export const lastEditedByProperty: NotionAPIPropertyValue = {
  id: 'id',
  type: 'last_edited_by',
  last_edited_by: personUser,
};

export const lastEditedByContent: NormalizedValue = {
  name: 'Name',
  avatar: 'url',
  email: 'email',
};

export const lastEditedTimeProperty: NotionAPIPropertyValue = {
  id: 'id',
  type: 'last_edited_time',
  last_edited_time: '2020-01-01T00:00:00Z',
};

export const lastEditedTimeContent: NormalizedValue = '2020-01-01T00:00:00Z';

export const unsupportedProperty = {
  type: 'unsupported',
};
