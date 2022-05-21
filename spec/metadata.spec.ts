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
      coverImage: 'https://www.notion.so/cover.png',
      iconEmoji: '📚',
      iconImage: null,
    });
  });

  it('return null if no cover is set', () => {
    expect(getMetadata({ ...examples.page, cover: null })).toEqual(
      expect.objectContaining({ coverImage: null }),
    );
  });

  it('return the file url if the cover is embedded', () => {
    expect(
      getMetadata({
        ...examples.page,
        cover: {
          type: 'file',
          file: {
            url: 'url',
            expiry_time: '2020-01-01T00:00:00Z',
          },
        },
      }),
    ).toEqual(expect.objectContaining({ coverImage: 'url' }));
  });

  it('return the file url if the cover is external', () => {
    expect(
      getMetadata({
        ...examples.page,
        cover: {
          type: 'external',
          external: {
            url: 'url',
          },
        },
      }),
    ).toEqual(expect.objectContaining({ coverImage: 'url' }));
  });

  it('return null if no icon is set', () => {
    expect(getMetadata({ ...examples.page, icon: null })).toEqual(
      expect.objectContaining({ iconEmoji: null, iconImage: null }),
    );
  });

  it('return the emoji string if the icon is set as an emoji', () => {
    expect(
      getMetadata({
        ...examples.page,
        icon: {
          type: 'emoji',
          emoji: '☀️',
        },
      }),
    ).toEqual(expect.objectContaining({ iconEmoji: '☀️', iconImage: null }));
  });

  it('return the file url if the icon is embedded', () => {
    expect(
      getMetadata({
        ...examples.page,
        icon: {
          type: 'file',
          file: {
            url: 'url',
            expiry_time: '2020-01-01T00:00:00Z',
          },
        },
      }),
    ).toEqual(expect.objectContaining({ iconEmoji: null, iconImage: 'url' }));
  });

  it('return the file url if the icon is external', () => {
    expect(
      getMetadata({
        ...examples.page,
        icon: {
          type: 'external',
          external: {
            url: 'url',
          },
        },
      }),
    ).toEqual(expect.objectContaining({ iconEmoji: null, iconImage: 'url' }));
  });
});
