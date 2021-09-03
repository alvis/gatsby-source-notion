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

import { DEFAULT_TTL, Notion } from '#client';
import { NodeManager } from '#node';

import type { NodePluginArgs, PluginOptions } from 'gatsby';

import type { NotionOptions, NotionTTL } from '#client';
import type { FullDatabase, FullPage } from '#types';

/** options for the source plugin */
export interface PluginConfig extends PluginOptions, NotionOptions {
  /** id of databases to be sourced, default to be all shared databases */
  databases?: string[];
  /** id of pages to be sourced, default to be all shared pages */
  pages?: string[];
  /** the number of api calls per seconds allowed for preview, 0 to disable preview default 2.5 */
  previewCallRate?: number;
  /** TTL settings for each API call types, default to cache database metadata and blocks */
  previewTTL?: Partial<NotionTTL>;
}

interface FullPluginConfig extends PluginConfig {
  databases: string[];
  pages: string[];
  previewCallRate: number;
  previewTTL: NotionTTL;
}

const ONE_SECOND = 1000;

const DEFAULT_PREVIEW_API_RATE = 2.5;

/**
 * compute the update interval for the preview mode
 * @param pluginConfig the normalised plugin config
 * @returns the number of milliseconds needed between each sync
 */
export function computePreviewUpdateInterval(
  pluginConfig: FullPluginConfig,
): number | null {
  const { previewCallRate, databases, pages, previewTTL } = pluginConfig;

  // it's minimum because if a page get edited, it will consume more
  const minAPICallsNeededPerSync =
    databases.length *
      // get page title and properties etc.
      ((previewTTL.databaseEntries !== 0 ? 1 : 0) +
        // it will take 1 more if we want to keep database title and properties etc. up-to-date as well
        (previewTTL.databaseMeta !== 0 ? 1 : 0)) +
    pages.length *
      // get page title and properties etc.
      (previewTTL.pageMeta !== 0 ? 1 : 0);

  const interval = (ONE_SECOND * minAPICallsNeededPerSync) / previewCallRate;

  return interval > 0 ? interval : null;
}

/**
 * fill in the missing config with defaults
 * @param config pluginConfig passed from the plugin options
 * @returns a complete config
 */
export function normaliseConfig(
  config: Partial<PluginConfig>,
): FullPluginConfig {
  const { previewCallRate = DEFAULT_PREVIEW_API_RATE } = config;

  const databases = [
    ...(config.databases ?? []),
    ...(process.env['GATSBY_NOTION_DATABASES']?.split(/, */) ?? []),
  ].filter(
    // no empty id
    (id) => !!id,
  );

  const pages = [
    ...(config.pages ?? []),
    ...(process.env['GATSBY_NOTION_PAGES']?.split(/, */) ?? []),
  ].filter(
    // no empty id
    (id) => !!id,
  );

  const previewTTL = { ...DEFAULT_TTL, ...config.previewTTL };

  return {
    ...config,
    databases,
    pages,
    previewCallRate,
    previewTTL,
    plugins: [],
  };
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
