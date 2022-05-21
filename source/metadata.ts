/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Collection of helpers for extracting metadata
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import { getPropertyContentFromFile } from '#property';

import type { Metadata, NotionAPIDatabase, NotionAPIPage } from '#types';

/**
 * get common properties from a page or database, except for the title
 * @param entity the page or database object returned from Notion API
 * @returns common properties
 */
export function getMetadata<E extends NotionAPIPage | NotionAPIDatabase>(
  entity: E,
): Metadata {
  const { last_edited_time: lastEditedTime, url } = entity;
  const { created_time: createdTime } = entity;

  const variable = { url, lastEditedTime };
  const invariant = { createdTime };
  const visual = getCommonVisualMetadata(entity);

  return { ...variable, ...invariant, ...visual };
}

/**
 * get common visual properties such as cover and icon from a page or database
 * @param entity the page or database object returned from Notion API
 * @returns common properties
 */
export function getCommonVisualMetadata<
  E extends NotionAPIPage | NotionAPIDatabase,
>(
  entity: E,
): {
  coverImage: string | null;
  iconEmoji: string | null;
  iconImage: string | null;
} {
  const { cover, icon } = entity;

  return {
    coverImage: cover ? getPropertyContentFromFile(cover) : null,
    iconEmoji: icon?.type === 'emoji' ? icon.emoji : null,
    iconImage:
      icon?.type === 'external' || icon?.type === 'file'
        ? getPropertyContentFromFile(icon)
        : null,
  };
}
