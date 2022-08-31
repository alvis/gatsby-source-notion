/**
 *                            MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 * @summary   Create pages via Gatsby Node API
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2022 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import { resolve } from 'node:path';

import type { Actions, CreatePagesArgs, GatsbyNode } from 'gatsby';

export const createPages: GatsbyNode['createPages'] = async ({
  actions: { createPage },
  graphql,
}) => {
  createProjectPages(await queryProjects(graphql), createPage);
};

/**
 * create project pages
 * @param projects projects metadata
 * @param createPage the createPage function
 */
function createProjectPages(
  projects: Queries.ProjectsQuery | undefined,
  createPage: Actions['createPage'],
): void {
  projects?.notionDatabase?.childrenNotionPage?.forEach((page) => {
    const mdx = page?.childMarkdownRemark;
    const path = page?.properties?.path;

    if (mdx && path) {
      createPage({
        path,
        // NOTE: must resolve to the absolute path of the component
        component: resolve(__dirname, 'src', 'templates', 'project.tsx'),
        context: { id: mdx.id },
      });
    }
  });
}

/**
 * get projects metadata
 * @param graphql the graphql query function
 * @returns projects metadata
 */
async function queryProjects(
  graphql: CreatePagesArgs['graphql'],
): Promise<Queries.ProjectsQuery | undefined> {
  const { data } = await graphql<Queries.ProjectsQuery>(`
    query Projects {
      notionDatabase(title: { eq: "Projects" }) {
        childrenNotionPage {
          childMarkdownRemark {
            id
          }
          properties {
            path
          }
        }
      }
    }
  `);

  return data;
}
