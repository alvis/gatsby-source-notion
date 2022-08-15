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

import {
  onCreateDevServer,
  pluginOptionsSchema,
  sourceNodes,
} from '#gatsby-node';
import { sync } from '#plugin';

jest.mock('gatsby/package.json', () => {
  return { version: '3.0.0' };
});

jest.mock('#plugin', () => {
  return {
    __esModule: true,
    ...jest.requireActual('#plugin'),
    sync: jest.fn(),
  };
});

// unset any environment variables that may be set from the parent environment
delete process.env['GATSBY_NOTION_TOKEN'];
delete process.env['GATSBY_NOTION_DATABASES'];
delete process.env['GATSBY_NOTION_PAGES'];

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
  it('pass with future gatsby after v3', testVersion('4.0.0', true));
});

describe('fn:onCreateDevServer', () => {
  beforeEach(() => jest.clearAllMocks());
  beforeEach(() => jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  it('disable preview mode if the API rate is 0', async () => {
    await onCreateDevServer(
      {} as any,
      {
        previewCallRate: 0,
        databases: ['database'],
        pages: ['page'],
        plugins: [],
      },
      jest.fn(),
    );

    jest.advanceTimersToNextTimer();

    // not calling because it's disabled
    expect(sync).toBeCalledTimes(0);
  });

  it('disable preview mode if no database or page is given', async () => {
    await onCreateDevServer({} as any, { plugins: [] }, jest.fn());

    jest.advanceTimersToNextTimer();

    // not calling because it's disabled
    expect(sync).toBeCalledTimes(0);
  });

  it('continuously sync data with Notion', async () => {
    jest.clearAllMocks();
    await onCreateDevServer(
      {} as any,
      { databases: ['database_continuous'], pages: ['page'], plugins: [] },
      jest.fn(),
    );

    jest.advanceTimersToNextTimer();
    await Promise.resolve();
    expect(sync).toBeCalledTimes(1);

    // sync again after a certain time
    jest.advanceTimersToNextTimer();
    await Promise.resolve();
    expect(sync).toBeCalledTimes(2);
  });
});

describe('fn:sourceNodes', () => {
  beforeEach(() => jest.clearAllMocks());
  beforeEach(() => jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  it('sync data with Notion', async () => {
    await sourceNodes({} as any, { plugins: [] }, jest.fn());

    expect(sync).toBeCalledTimes(1);
  });
});
