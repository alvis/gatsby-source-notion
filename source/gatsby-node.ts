/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   A Gatsby source plugin for Notion
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import { version as gatsbyVersion } from 'gatsby/package.json';

import { name } from '#.';
import { Notion } from '#client';
import { getDatabases, getPages } from '#plugin';
import { NodeManager } from '#node';
import { normaliseConfig } from '#plugin';

import type { GatsbyNode } from 'gatsby';

/* eslint-disable jsdoc/require-param, jsdoc/require-returns  */

/** Define a schema for the options using Joi to validate the options users pass to the plugin. */
export const pluginOptionsSchema: NonNullable<
  GatsbyNode['pluginOptionsSchema']
> = ({ Joi: joi }) => {
  return joi.object({
    token: joi.string().optional(),
    version: joi.string().optional(),
    databases: joi.array().items(joi.string()).optional(),
    pages: joi.array().items(joi.string()).optional(),
  });
};

// see https://www.gatsbyjs.com/docs/conceptual/overview-of-the-gatsby-build-process

export const onPreBootstrap: NonNullable<GatsbyNode['onPreBootstrap']> = async (
  args,
) => {
  const { reporter } = args;

  const MINIMUM_SUPPORTED_VERSION = 3;
  if (Number(gatsbyVersion.split('.')[0]) !== MINIMUM_SUPPORTED_VERSION) {
    reporter.panic(`[${name}] unsupported gatsby version detected`);
  }
};

export const sourceNodes: NonNullable<GatsbyNode['sourceNodes']> = async (
  args,
  partialConfig,
) => {
  const pluginConfig = normaliseConfig(partialConfig);
  const client = new Notion(pluginConfig);

  // getting entries from notion
  const databases = await getDatabases(client, pluginConfig);
  const pages = await getPages(client, pluginConfig);
  for (const database of databases) {
    pages.push(...database.pages);
  }

  // update nodes
  const manager = new NodeManager(args);
  manager.update([...databases, ...pages]);
};

/* eslint-enable */
