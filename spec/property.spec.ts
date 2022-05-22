/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Tests on property handling
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import {
  getPropertyContent,
  getPropertyContentFromFile,
  getPropertyContentFromFormula,
  getPropertyContentFromRichText,
  getPropertyContentFromRollup,
  getPropertyContentFromUser,
  isPropertyAccessible,
  isPropertySupported,
  isPageAccessible,
  normalizeProperties,
} from '#property';

import * as examples from './examples';

describe('fn:getPropertyContentFromFile', () => {
  it('return an external file URL', () => {
    expect(
      getPropertyContentFromFile({
        type: 'external',
        external: {
          url: 'url',
        },
      }),
    ).toEqual('url');
  });

  it('return an embedded file URL', () => {
    expect(
      getPropertyContentFromFile({
        type: 'file',
        file: {
          url: 'url',
        },
      }),
    ).toEqual('url');
  });

  it('throw an error for unknown file type', () => {
    expect(() =>
      getPropertyContentFromFile({
        file: {
          url: 'url',
        },
      }),
    ).toThrow();
  });
});

describe('fn:getPropertyContentFromFormula', () => {
  it('return a string value', () => {
    expect(
      getPropertyContentFromFormula({ type: 'string', string: 'content' }),
    ).toEqual('content');
  });

  it('return a number value', () => {
    expect(
      getPropertyContentFromFormula({ type: 'number', number: 1 }),
    ).toEqual(1);
  });

  it('return a boolean value', () => {
    expect(
      getPropertyContentFromFormula({ type: 'boolean', boolean: true }),
    ).toEqual(true);
  });

  it('return a date value', () => {
    expect(
      getPropertyContentFromFormula({
        type: 'date',
        date: {
          start: '2020-01-01',
          end: '2020-12-32',
          time_zone: 'Europe/London',
        },
      }),
    ).toEqual({
      start: '2020-01-01',
      end: '2020-12-32',
      time_zone: 'Europe/London',
    });
  });

  it('throw an error for unknown formula type', () => {
    expect(() =>
      getPropertyContentFromFormula({
        // @ts-expect-error
        type: 'unknown',
      }),
    ).toThrow();
  });
});

describe('fn:getPropertyContentFromRichText', () => {
  it('return plain text', () => {
    expect(
      getPropertyContentFromRichText(examples.richTextProperty['rich_text']),
    ).toEqual(examples.richTextContent);
  });
});

describe('fn:getPropertyContentFromRollup', () => {
  it('return a number value', () => {
    expect(
      getPropertyContentFromRollup(examples.rollupNumberProperty['rollup']),
    ).toEqual(examples.rollupNumberContent);
  });

  it('return a date value', () => {
    expect(
      getPropertyContentFromRollup(examples.rollupDateProperty['rollup']),
    ).toEqual(examples.rollupDateContent);
  });

  it('return an array value', () => {
    expect(
      getPropertyContentFromRollup(examples.rollupArrayProperty['rollup']),
    ).toEqual(examples.rollupArrayContent);
  });
});

describe('fn:getPropertyContentFromUser', () => {
  it('return metadata about a user', () => {
    expect(getPropertyContentFromUser(examples.personUser)).toEqual(
      examples.personUserContent,
    );
  });

  it('return metadata about a user without email', () => {
    expect(getPropertyContentFromUser(examples.personUserWithoutEmail)).toEqual(
      examples.personUserWithoutEmailContent,
    );
  });

  it('return metadata about a user behind a bot', () => {
    expect(getPropertyContentFromUser(examples.botByUser)).toEqual(
      examples.personUserContent,
    );
  });

  it('return null for a workspace bot', () => {
    expect(getPropertyContentFromUser(examples.botWithoutUser)).toEqual(null);
  });

  it('return null for an inaccessible user object', () => {
    expect(getPropertyContentFromUser(null)).toEqual(null);
  });
});

describe('fn:getPropertyContent', () => {
  it('return the content of a title property', () => {
    expect(getPropertyContent(examples.titleProperty)).toEqual(
      examples.titleContent,
    );
  });

  it('return the content of a rich text property', () => {
    expect(getPropertyContent(examples.richTextProperty)).toEqual(
      examples.richTextContent,
    );
  });

  it('return the content of a number property', () => {
    expect(getPropertyContent(examples.numberProperty)).toEqual(
      examples.numberContent,
    );
  });

  it('return the content of a selection property', () => {
    expect(getPropertyContent(examples.selectionProperty)).toEqual(
      examples.selectionContent,
    );

    expect(
      getPropertyContent({
        type: 'select',
        select: null,
      }),
    ).toEqual(null);
  });

  it('return the content of a multiple selection property', () => {
    expect(getPropertyContent(examples.multipleSelectionProperty)).toEqual(
      examples.multipleSelectionContent,
    );
  });

  it('return the content of a date property', () => {
    expect(getPropertyContent(examples.dateProperty)).toEqual(
      examples.dateContent,
    );
  });

  it('return the content of a people property', () => {
    expect(getPropertyContent(examples.peopleProperty)).toEqual(
      examples.peopleContent,
    );
  });

  it('return the content of a files property', () => {
    expect(getPropertyContent(examples.filesProperty)).toEqual(
      examples.filesContent,
    );
  });

  it('return the content of a checkbox property', () => {
    expect(getPropertyContent(examples.checkboxProperty)).toEqual(
      examples.checkboxContent,
    );
  });

  it('return the content of a url property', () => {
    expect(getPropertyContent(examples.urlProperty)).toEqual(
      examples.urlContent,
    );
  });

  it('return the content of a email property', () => {
    expect(getPropertyContent(examples.emailProperty)).toEqual(
      examples.emailContent,
    );
  });

  it('return the content of a string formula property', () => {
    expect(getPropertyContent(examples.formulaStringProperty)).toEqual(
      examples.formulaStringContent,
    );
  });

  it('return the content of a number formula property', () => {
    expect(getPropertyContent(examples.formulaNumberProperty)).toEqual(
      examples.formulaNumberContent,
    );
  });

  it('return the content of a boolean formula property', () => {
    expect(getPropertyContent(examples.formulaBooleanProperty)).toEqual(
      examples.formulaBooleanContent,
    );
  });

  it('return the content of a date formula property', () => {
    expect(getPropertyContent(examples.formulaDateProperty)).toEqual(
      examples.formulaDateContent,
    );
  });

  it('return the content of a phone number property', () => {
    expect(getPropertyContent(examples.phoneNumberProperty)).toEqual(
      examples.phoneNumberContent,
    );
  });

  it('return the content of a number rollup property', () => {
    expect(getPropertyContent(examples.rollupNumberProperty)).toEqual(
      examples.rollupNumberContent,
    );
  });

  it('return the content of a date rollup property', () => {
    expect(getPropertyContent(examples.rollupDateProperty)).toEqual(
      examples.rollupDateContent,
    );
  });

  it('return the content of an array rollup property', () => {
    expect(getPropertyContent(examples.rollupArrayProperty)).toEqual(
      examples.rollupArrayContent,
    );
  });

  it('return the content of a created by property', () => {
    expect(getPropertyContent(examples.createdByProperty)).toEqual(
      examples.createdByContent,
    );
  });

  it('return the content of a created time property', () => {
    expect(getPropertyContent(examples.createdTimeProperty)).toEqual(
      examples.createdTimeContent,
    );
  });

  it('return the content of a last edited by property', () => {
    expect(getPropertyContent(examples.lastEditedByProperty)).toEqual(
      examples.lastEditedByContent,
    );
  });

  it('return the content of a lasted edited time property', () => {
    expect(getPropertyContent(examples.lastEditedTimeProperty)).toEqual(
      examples.lastEditedTimeContent,
    );
  });

  it('ignore unsupported properties', () => {
    // @ts-expect-error Notion has unsupported property type in the past and also maybe in future
    expect(getPropertyContent(examples.unsupportedProperty)).toEqual(null);
  });
});

describe('fn:isPropertyAccessible', () => {
  it('should return true for accessible properties', () => {
    expect(isPropertyAccessible(examples.titleProperty)).toEqual(true);
  });

  it('should return false for non-accessible properties', () => {
    expect(isPropertyAccessible({ id: 'property_id', object: 'user' })).toEqual(
      false,
    );
  });
});

describe('fn:isPropertySupported', () => {
  it('should return true for supported properties', () => {
    expect(isPropertySupported(examples.titleProperty)).toEqual(true);
  });

  it('should return false for unsupported properties', () => {
    expect(
      isPropertySupported({ type: 'unsupported', id: 'property_id' }),
    ).toEqual(false);
  });
});

describe('fn:isPageAccessible', () => {
  // it('should return true for accessible pages', () => {
  //   expect(isPageAccessible(examples.page)).toEqual(true);
  // });

  it('should return false for inaccessible databases', () => {
    expect(isPageAccessible(examples.inaccessibleDatabase)).toEqual(false);
  });

  it('should return false for inaccessible pages', () => {
    expect(isPageAccessible(examples.inaccessiblePage)).toEqual(false);
  });
});

describe('fn:normalizeProperties', () => {
  it('return a property object with its normalized value', () => {
    expect(
      normalizeProperties({
        text: examples.richTextProperty,
      }),
    ).toEqual({
      text: examples.richTextContent,
    });
  });
});
