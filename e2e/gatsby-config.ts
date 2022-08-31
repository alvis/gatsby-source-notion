/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Specify the configuration for Gatsby.
 *
 *            See https://www.gatsbyjs.org/docs/gatsby-config
 *            for detailed usage
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

/* istanbul ignore file */

import type { GatsbyConfig } from 'gatsby';

export const graphqlTypegen: GatsbyConfig['graphqlTypegen'] = true;

export const jsxRuntime: GatsbyConfig['jsxRuntime'] = 'automatic';

export const plugins: GatsbyConfig['plugins'] = [
  'gatsby-plugin-sharp',
  {
    resolve: 'gatsby-source-notion',
    options: {
      previewCallRate: 0.5,
    },
  },
  {
    resolve: 'gatsby-transformer-remark',
    options: {
      plugins: ['gatsby-remark-images'],
    },
  },
];
