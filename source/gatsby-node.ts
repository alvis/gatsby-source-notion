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
import { computePreviewUpdateInterval, normaliseConfig, sync } from '#plugin';

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
    previewCallRate: joi.number().optional(),
    previewTTL: joi
      .object({
        databaseMeta: joi.number().optional(),
        databaseEntries: joi.number().optional(),
        pageMeta: joi.number().optional(),
        pageContent: joi.number().optional(),
      })
      .optional(),
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

export const onCreateDevServer: NonNullable<GatsbyNode['onCreateDevServer']> =
  async (args, partialConfig) => {
    const pluginConfig = normaliseConfig(partialConfig);
    const { previewCallRate } = pluginConfig;

    const previewUpdateInterval = computePreviewUpdateInterval(pluginConfig);
    if (previewCallRate && previewUpdateInterval) {
      const scheduleUpdate = (): NodeJS.Timeout =>
        setTimeout(async () => {
          // sync entities from notion
          await sync(args, pluginConfig);

          // schedule the next update
          scheduleUpdate();
        }, previewUpdateInterval);

      scheduleUpdate();
    }
  };

export const sourceNodes: NonNullable<GatsbyNode['sourceNodes']> = async (
  args,
  partialConfig,
) => {
  // sync entities from notion
  await sync(args, normaliseConfig(partialConfig));
};

/* eslint-enable */
