/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Procedure for the source plugin
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import { Notion } from '#client';

import type { PluginOptions } from 'gatsby';

import type { NotionOptions } from '#client';
import type { FullDatabase, FullPage } from '#types';

/** options for the source plugin */
export interface PluginConfig extends PluginOptions, NotionOptions {
  /** id of databases to be sourced, default to be all shared databases */
  databases?: string[];
  /** id of pages to be sourced, default to be all shared pages */
  pages?: string[];
}

/**
 * gat relevant databases from Notion
 * @param client a Notion client
 * @param pluginConfig pluginConfig passed from the plugin options
 * @returns a list of databases
 */
export async function getDatabases(
  client: Notion,
  pluginConfig: PluginConfig,
): Promise<FullDatabase[]> {
  const databases: FullDatabase[] = [];

  const databaseIDs = [
    ...(pluginConfig.databases ?? []),
    ...(process.env['GATSBY_NOTION_DATABASES']?.split(/, +/) ?? []),
  ];

  for (const databaseID of databaseIDs) {
    const database = await client.getDatabase(databaseID);
    databases.push(database);
  }

  return databases;
}

/**
 * gat relevant pages from Notion
 * @param client a Notion client
 * @param pluginConfig pluginConfig passed from the plugin options
 * @returns a list of pages
 */
export async function getPages(
  client: Notion,
  pluginConfig: PluginConfig,
): Promise<FullPage[]> {
  const pages: FullPage[] = [];

  const pageIDs = [
    ...(pluginConfig.pages ?? []),
    ...(process.env['GATSBY_NOTION_PAGES']?.split(/, +/) ?? []),
  ];

  for (const pageID of pageIDs) {
    pages.push(await client.getPage(pageID));
  }

  return pages;
}
