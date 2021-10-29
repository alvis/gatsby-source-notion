/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Test page
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import { graphql } from 'gatsby';
import React from 'react';

import type { PageProps } from 'gatsby';
import type { FC } from 'react';

import type { IndexPageQuery } from '~graphql';

// page query
export const query = graphql`
  query IndexPage {
    allNotionDatabase {
      nodes {
        ref
        title
      }
    }
    allNotionPage {
      nodes {
        ref
        title
      }
    }
  }
`;

/**
 * the test page
 * @inheritdoc
 * @returns a component holding the test page
 */
const Test: FC<PageProps<IndexPageQuery>> = ({ data }) => (
  <>
    <section id="databases">
      <h1>Databases</h1>
      <ul>
        {data.allNotionDatabase.nodes.map(({ ref, title }) => (
          <li key={ref}>{title}</li>
        ))}
      </ul>
    </section>
    <section id="pages">
      <h1>Pages</h1>
      <ul>
        {data.allNotionPage.nodes.map(({ ref, title }) => (
            <li key={ref}>{title}</li>
        ))}
      </ul>
    </section>
  </>
);

/**
 * the test page
 * @inheritdoc
 * @returns a component holding the test page
 */
// const Test: FC<PageProps> = ({ data }) => <div>hi!</div>;

export default Test;
 
