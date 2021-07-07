/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Tests on node generation
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import gatsbyPackage from 'gatsby/package.json';
import joi from 'joi';

import { pluginOptionsSchema, sourceNodes } from '#gatsby-node';

import { mockDatabase, mockPage } from './mock';

jest.mock('gatsby/package.json', () => {
  return { version: '3.0.0' };
});

const mockUpdate = jest.fn();
jest.mock('#node', () => ({
  __esModule: true,
  NodeManager: jest.fn().mockImplementation(() => {
    return { update: mockUpdate };
  }),
}));

describe('fn:pluginOptionsSchema', () => {
  it('pass with no option provided at all', () => {
    expect(
      pluginOptionsSchema({
        Joi: joi,
      } as any).validate({}).error,
    ).toEqual(undefined);
  });

  it('give an error if some data is given in the wrong format', () => {
    expect(
      pluginOptionsSchema({
        Joi: joi,
      } as any).validate({ databases: ['database', 0] }).error,
    ).toBeInstanceOf(Error);
  });
});

describe('fn:onPreBootstrap', () => {
  const testVersion = (version: string, shouldPass: boolean) => {
    return async () => {
      // edit the mocked package version here
      gatsbyPackage.version = version;
      const { onPreBootstrap } = await import('#gatsby-node');
      const panic = jest.fn();
      await onPreBootstrap(
        {
          reporter: { panic },
        } as any,
        { plugins: [] },
        jest.fn(),
      );

      expect(panic).toBeCalledTimes(shouldPass ? 0 : 1);
    };
  };

  it('fail with gatsby earlier than v3', testVersion('2.0.0', false));
  it('pass with gatsby v3', testVersion('3.0.0', true));
  it('fail with future gatsby after v3', testVersion('4.0.0', false));
});

describe('fn:sourceNodes', () => {
  mockDatabase('database');
  mockPage('page');

  it('source all nodes', async () => {
    await sourceNodes(
      {} as any,
      { token: 'token', databases: ['database'], pages: ['page'], plugins: [] },
      jest.fn(),
    );

    expect(mockUpdate).toBeCalledWith([
      {
        created_time: '2020-01-01T00:00:00Z',
        id: 'database',
        last_edited_time: '2020-01-01T00:00:00Z',
        object: 'database',
        pages: [],
        parent: { type: 'workspace' },
        properties: { Name: { id: 'title', title: {}, type: 'title' } },
        title: 'Title',
      },
      {
        archived: false,
        blocks: [
          {
            children: [
              {
                created_time: '2020-01-01T00:00:00Z',
                has_children: false,
                id: 'page-block0-block0',
                last_edited_time: '2020-01-01T00:00:00Z',
                object: 'block',
                paragraph: {
                  text: [
                    {
                      annotations: {
                        bold: false,
                        code: false,
                        color: 'default',
                        italic: false,
                        strikethrough: false,
                        underline: false,
                      },
                      href: null,
                      plain_text: 'block 0 for block page-block0',
                      text: {
                        content: 'block 0 for block page-block0',
                        link: null,
                      },
                      type: 'text',
                    },
                  ],
                },
                type: 'paragraph',
              },
            ],
            created_time: '2020-01-01T00:00:00Z',
            has_children: true,
            id: 'page-block0',
            last_edited_time: '2020-01-01T00:00:00Z',
            object: 'block',
            paragraph: {
              text: [
                {
                  annotations: {
                    bold: false,
                    code: false,
                    color: 'default',
                    italic: false,
                    strikethrough: false,
                    underline: false,
                  },
                  href: null,
                  plain_text: 'block 0 for block page',
                  text: { content: 'block 0 for block page', link: null },
                  type: 'text',
                },
              ],
            },
            type: 'paragraph',
          },
        ],
        created_time: '2020-01-01T00:00:00Z',
        id: 'page',
        last_edited_time: '2020-01-01T00:00:00Z',
        markdown:
          '---\nid: page\ntitle: Title\n---\nblock 0 for block page\n\nblock 0 for block page-block0\n',
        object: 'page',
        parent: { database_id: 'database-page', type: 'database_id' },
        properties: {
          title: {
            id: 'title',
            title: [
              {
                annotations: {
                  bold: false,
                  code: false,
                  color: 'default',
                  italic: false,
                  strikethrough: false,
                  underline: false,
                },
                href: null,
                plain_text: 'Title',
                text: { content: 'Title', link: null },
                type: 'text',
              },
            ],
            type: 'title',
          },
        },
        title: 'Title',
        url: 'https://www.notion.so/page',
      },
    ]);
  });
});
