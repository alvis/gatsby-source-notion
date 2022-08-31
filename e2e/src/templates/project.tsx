/**
 *                            MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 * @summary   Collection of layouts
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import { graphql } from 'gatsby';

import type { PageProps } from 'gatsby';

export const query = graphql`
  query Project($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
      }
      html
    }
  }
`;

const Project: React.FC<PageProps<Queries.ProjectQuery>> = ({ data }) => {
  // since this page is referred from the createPages API, it's safe to assume the mdx node is there
  const mdx = data.markdownRemark!;

  const title = mdx.frontmatter?.title;
  const html = mdx.html || '';

  return (
    <section className="py-12 px-4">
      <div className="mx-auto w-full max-w-2xl font-sans main">
        <h1 className="mt-2 mb-6 font-sans text-5xl font-semibold leading-tight text-center font-heading">
          {title}
        </h1>
        <div
          className="prose-sm"
          dangerouslySetInnerHTML={{ __html: html }}></div>
      </div>
    </section>
  );
};

export default Project;
