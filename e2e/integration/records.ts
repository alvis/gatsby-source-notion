/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Tests on the ability read data from notion
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import { after } from 'cypress/types/lodash';

describe('capture databases and pages from notion', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000');
  });

  afterEach(() => {
    cy.screenshot();
  });

  it('print database and page titles', () => {
    cy.get('#databases li').should('have.length.gt', 0);
    cy.get('#pages li').should('have.length.gt', 0);
  });
});
