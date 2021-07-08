/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Tests on property handling
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import { getPropertyContent } from '#property';

describe('fn:getPropertyContent', () => {
  it('return the content of a title property', () => {
    expect(
      getPropertyContent({
        type: 'title',
        title: [
          {
            type: 'text',
            text: {
              content: 'Title',
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
            plain_text: 'Title',
            href: null,
          },
        ],
      }),
    ).toEqual('Title');
  });

  it('return the content of a rich text property', () => {
    expect(
      getPropertyContent({
        type: 'rich_text',
        rich_text: [
          {
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
          },
        ],
      }),
    ).toEqual('Text');
  });

  it('return the content of a number property', () => {
    expect(
      getPropertyContent({
        type: 'number',
        number: 0,
      }),
    ).toEqual(0);
  });

  it('return the content of a selection property', () => {
    expect(
      getPropertyContent({
        type: 'select',
        select: {
          color: 'default',
          id: 'id',
          name: 'Selection',
        },
      }),
    ).toEqual('Selection');
  });

  it('return the content of a multiple selection property', () => {
    expect(
      getPropertyContent({
        type: 'multi_select',
        multi_select: [
          {
            color: 'default',
            id: 'id',
            name: 'Selection',
          },
        ],
      }),
    ).toEqual(['Selection']);
  });

  it('return the content of a date property', () => {
    expect(
      getPropertyContent({
        type: 'date',
        date: { start: '2020-01-01T00:00:00Z' },
      }),
    ).toEqual({ start: '2020-01-01T00:00:00Z' });
  });

  it('return the content of a people property', () => {
    expect(
      getPropertyContent({
        type: 'people',
        people: [
          {
            avatar_url: 'url',
            id: 'id',
            name: 'Name',
            object: 'user',
            type: 'person',
          },
        ],
      }),
    ).toEqual([{ name: 'Name', avatar: 'url' }]);
  });

  it('return the content of a files property', () => {
    expect(
      getPropertyContent({
        type: 'files',
        files: [
          {
            name: 'file name',
          },
        ],
      }),
    ).toEqual(['file name']);
  });

  it('return the content of a checkbox property', () => {
    expect(
      getPropertyContent({
        type: 'checkbox',
        checkbox: true,
      }),
    ).toEqual(true);
  });

  it('return the content of a url property', () => {
    expect(
      getPropertyContent({
        type: 'url',
        url: 'url',
      }),
    ).toEqual('url');
  });

  it('return the content of a email property', () => {
    expect(
      getPropertyContent({
        type: 'email',
        email: 'email',
      }),
    ).toEqual('email');
  });

  it('return the content of a string formula property', () => {
    expect(
      getPropertyContent({
        type: 'formula',
        formula: {
          string: 'text',
          type: 'string',
        },
      }),
    ).toEqual('text');
  });

  it('return the content of a number formula property', () => {
    expect(
      getPropertyContent({
        type: 'formula',
        formula: {
          number: 0,
          type: 'number',
        },
      }),
    ).toEqual(0);
  });

  it('return the content of a boolean formula property', () => {
    expect(
      getPropertyContent({
        type: 'formula',
        formula: {
          boolean: true,
          type: 'boolean',
        },
      }),
    ).toEqual(true);
  });

  it('return the content of a date formula property', () => {
    expect(
      getPropertyContent({
        type: 'formula',
        formula: {
          date: { start: '2020-01-01T00:00:00Z' },
          type: 'date',
        },
      }),
    ).toEqual({ start: '2020-01-01T00:00:00Z' });
  });

  it('return the content of a phone number property', () => {
    expect(
      getPropertyContent({
        type: 'phone_number',
        phone_number: 'number',
      }),
    ).toEqual('number');
  });

  it('return the content of a number rollup property', () => {
    expect(
      getPropertyContent({
        type: 'rollup',
        rollup: {
          number: 0,
          type: 'number',
        },
      }),
    ).toEqual(0);
  });

  it('return the content of a date rollup property', () => {
    expect(
      getPropertyContent({
        type: 'rollup',
        rollup: {
          date: { start: '2020-01-01T00:00:00Z' },
          type: 'date',
        },
      }),
    ).toEqual({ start: '2020-01-01T00:00:00Z' });
  });

  it('return the content of an array rollup property', () => {
    expect(
      getPropertyContent({
        type: 'rollup',
        rollup: {
          array: [
            {
              number: 0,
              type: 'number',
            },
          ],
          type: 'array',
        },
      }),
    ).toEqual([0]);
  });

  it('return the content of a created by property', () => {
    expect(
      getPropertyContent({
        type: 'created_by',
        created_by: {
          avatar_url: 'url',
          id: 'id',
          name: 'Name',
          object: 'user',
          person: {
            email: 'email',
          },
          type: 'person',
        },
      }),
    ).toEqual({ name: 'Name', avatar: 'url' });
  });

  it('return the content of a created time property', () => {
    expect(
      getPropertyContent({
        type: 'created_time',
        created_time: '2020-01-01T00:00:00Z',
      }),
    ).toEqual('2020-01-01T00:00:00Z');
  });

  it('return the content of a last edited by property', () => {
    expect(
      getPropertyContent({
        type: 'last_edited_by',
        last_edited_by: {
          avatar_url: 'url',
          id: 'id',
          name: 'Name',
          object: 'user',
          person: {
            email: 'email',
          },
          type: 'person',
        },
      }),
    ).toEqual({ name: 'Name', avatar: 'url' });
  });

  it('return the content of a lasted edited time property', () => {
    expect(
      getPropertyContent({
        type: 'last_edited_time',
        last_edited_time: '2020-01-01T00:00:00Z',
      }),
    ).toEqual('2020-01-01T00:00:00Z');
  });

  it('ignore properties which has no content', () => {
    expect(
      getPropertyContent({
        type: 'relation',
        relation: [
          {
            id: 'id',
          },
        ],
      }),
    ).toEqual(undefined);
  });
});
