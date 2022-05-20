/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Tests on the metadata extractor
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import { getMetadata } from '#metadata';

import * as examples from './examples';

describe('fn:getMetadata', () => {
  it('return metadata from a page or database, except for the title', () => {
    expect(getMetadata(examples.page)).toEqual({
      createdTime: '2020-01-01T00:00:00Z',
      lastEditedTime: '2020-01-01T00:00:00Z',
      url: 'https://www.notion.so/workspace/page',
    });
  });
});
