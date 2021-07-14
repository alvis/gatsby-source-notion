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
import { NodeManager } from '#node';

import type { NodePluginArgs, PluginOptions } from 'gatsby';

import type { NotionOptions } from '#client';
import type { FullDatabase, FullPage } from '#types';

/** options for the source plugin */
export interface PluginConfig extends PluginOptions, NotionOptions {
  /** id of databases to be sourced, default to be all shared databases */
  databases?: string[];
  /** id of pages to be sourced, default to be all shared pages */
  pages?: string[];
}

interface FullPluginConfig extends PluginConfig {
  databases: string[];
  pages: string[];
}

/**
 * fill in the missing config with defaults
 * @param config pluginConfig passed from the plugin options
 * @returns a complete config
 */
export function normaliseConfig(
  config: Partial<PluginConfig>,
): FullPluginConfig {
  const databases = [
    ...(config.databases ?? []),
    ...(process.env['GATSBY_NOTION_DATABASES']?.split(/, +/) ?? []),
  ].filter(
    // no empty id
    (id) => !!id,
  );

  const pages = [
    ...(config.pages ?? []),
    ...(process.env['GATSBY_NOTION_PAGES']?.split(/, +/) ?? []),
  ].filter(
    // no empty id
    (id) => !!id,
  );

  return { ...config, databases, pages, plugins: [] };
}

/**
 * gat relevant databases from Notion
 * @param client a Notion client
 * @param pluginConfig pluginConfig passed from the plugin options
 * @returns a list of databases
 */
export async function getDatabases(
  client: Notion,
  pluginConfig: FullPluginConfig,
): Promise<FullDatabase[]> {
  const databases: FullDatabase[] = [];

  for (const databaseID of pluginConfig.databases) {
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
  pluginConfig: FullPluginConfig,
): Promise<FullPage[]> {
  const pages: FullPage[] = [];

  for (const pageID of pluginConfig.pages) {
    pages.push(await client.getPage(pageID));
  }

  return pages;
}

/**
 * synchronise data between Notion and Gatsby
 * @param args argument passed from Gatsby's Node API
 * @param pluginConfig pluginConfig passed from the plugin options
 */
export async function sync(
  args: NodePluginArgs,
  pluginConfig: FullPluginConfig,
): Promise<void> {
  const client = new Notion(pluginConfig);
  const manager = new NodeManager(args);

  const databases = await getDatabases(client, pluginConfig);
  const pages = await getPages(client, pluginConfig);
  for (const database of databases) {
    pages.push(...database.pages);
  }

  // update nodes
  await manager.update([...databases, ...pages]);
}
