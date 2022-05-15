/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Tests on notion block to markdown conversion
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import {
  bold,
  italic,
  strikethrough,
  code,
  text,
  texts,
  parse,
  markdown,
} from '#markdown';
import {
  full,
  header1,
  header2,
  header3,
  paragraphEmpty,
  paragraphSingleline,
  paragraphMultiline,
  paragraphIndented,
  paragraphIndentedEmpty,
  childPage,
  toggle,
  unsupported,
  unsupportedIndented,
} from './example';

import type { Annotation, RichText } from '#types';

function example(
  annotation: Partial<Annotation> = {},
  href: string | null = null,
): RichText {
  return {
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'default',
      ...annotation,
    },
    plain_text: 'text',
    href,
    type: 'text',
    text: {
      content: 'text',
      link: href ? { url: href } : null,
    },
  };
}

const unmarked = example();

describe('fn:bold', () => {
  const annotated: RichText = example({ bold: true });

  it('mark a text as bold', () => {
    const processed = bold(annotated);
    expect(processed.plain_text).toEqual('**text**');
    expect(processed.annotations.bold).toEqual(false);
  });

  it('leave the original block untouched', () => {
    expect(annotated.plain_text).toEqual('text');
    expect(annotated.annotations.bold).toEqual(true);
  });

  it('pass any unannotated', () => {
    const processed = bold(unmarked);
    expect(processed.plain_text).toEqual('text');
    expect(processed.annotations.bold).toEqual(false);
  });
});

describe('fn:italic', () => {
  const annotated: RichText = example({ italic: true });

  it('mark a text as italic', () => {
    const processed = italic(annotated);
    expect(processed.plain_text).toEqual('_text_');
    expect(processed.annotations.italic).toEqual(false);
  });

  it('leave the original block untouched', () => {
    expect(annotated.plain_text).toEqual('text');
    expect(annotated.annotations.italic).toEqual(true);
  });

  it('pass any unannotated', () => {
    const processed = italic(unmarked);
    expect(processed.plain_text).toEqual('text');
    expect(processed.annotations.italic).toEqual(false);
  });
});

describe('fn:strikethrough', () => {
  const annotated: RichText = example({ strikethrough: true });

  it('mark a text as strike-through', () => {
    const processed = strikethrough(annotated);
    expect(processed.plain_text).toEqual('~~text~~');
    expect(processed.annotations.strikethrough).toEqual(false);
  });

  it('leave the original block untouched', () => {
    expect(annotated.plain_text).toEqual('text');
    expect(annotated.annotations.strikethrough).toEqual(true);
  });

  it('pass any unannotated', () => {
    const processed = strikethrough(unmarked);
    expect(processed.plain_text).toEqual('text');
    expect(processed.annotations.strikethrough).toEqual(false);
  });
});

describe('fn:code', () => {
  const annotated: RichText = example({ code: true });

  it('mark a text as inline code', () => {
    const processed = code(annotated);
    expect(processed.plain_text).toEqual('`text`');
    expect(processed.annotations.code).toEqual(false);
  });

  it('leave the original block untouched', () => {
    expect(annotated.plain_text).toEqual('text');
    expect(annotated.annotations.code).toEqual(true);
  });

  it('pass any unannotated', () => {
    const processed = code(unmarked);
    expect(processed.plain_text).toEqual('text');
    expect(processed.annotations.code).toEqual(false);
  });
});

describe('fn:text', () => {
  const annotated: RichText = example(
    {
      bold: true,
      italic: true,
      strikethrough: true,
      code: true,
    },
    'https://link',
  );

  it('convert annotated text to markdown format', () => {
    const processed = text(annotated);
    expect(processed).toEqual('[~~_**`text`**_~~](https://link)');
  });

  it('leave the original block untouched', () => {
    expect(annotated.plain_text).toEqual('text');
    expect(annotated.annotations).toMatchObject({
      bold: true,
      italic: true,
      strikethrough: true,
      code: true,
    });
    expect(annotated.href).toEqual('https://link');
  });

  it('convert inline maths equation to markdown format', () => {
    const math: RichText = {
      type: 'equation',
      equation: { expression: 'x^2' },
      annotations: {
        bold: false,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
        color: 'default',
      },
      plain_text: 'x^2',
      href: null,
    };
    const processed = text(math);
    expect(processed).toEqual('$x^2$');
    expect(math.plain_text).toEqual('x^2');
    expect(math.equation.expression).toEqual('x^2');
  });
});

describe('fn:texts', () => {
  it('join all rich text with indention', () => {
    expect(texts([unmarked], '  ')).toEqual('  text');
  });
});

describe('fn:parse', () => {
  it('return null for unsupported block', () => {
    expect(parse(unsupported)).toEqual(null);
  });

  it('turn a header 1 block to the right markdown format', () => {
    expect(parse(header1)).toEqual(`# Heading 1\n`);
  });
  it('turn a header 2 block to the right markdown format', () => {
    expect(parse(header2)).toEqual(`## Heading 2\n`);
  });

  it('turn a header 3 block to the right markdown format', () => {
    expect(parse(header3)).toEqual(`### Heading 3\n`);
  });

  it('turn an empty paragraph block as a new line', () => {
    expect(parse(paragraphEmpty)).toEqual('\n');
  });

  it('turn a paragraph block to the right markdown format', () => {
    expect(parse(paragraphSingleline)).toEqual(`Paragraph\n`);
  });

  it('turn a multiline paragraph block to the right markdown format', () => {
    expect(parse(paragraphMultiline)).toEqual(`Multiline Paragraph
Line 1
Line 2\n`);
  });

  it('remove indention from a paragraph block', () => {
    expect(parse(paragraphIndented)).toEqual(`Intended Paragraph

Level 1

Level 2\n`);
  });

  it('turn empty paragraph blocks into just empty lines', () => {
    expect(parse(paragraphIndentedEmpty)).toEqual(`\n\n\n`);
  });

  it('ignore unsupported children', () => {
    expect(parse(unsupportedIndented)).toEqual(`\n`);
  });

  it('return the children only for toggled block', () => {
    expect(parse(toggle)).toEqual(`Toggle\n\nToggled Content\n`);
  });

  it('return null for child page', () => {
    expect(parse(childPage)).toEqual('Child Page\n');
  });
});

describe('fn:markdown', () => {
  it('convert blocks of content to markdown format', () =>
    expect(markdown(full)).toEqual(
      `
# Heading 1

## Heading 2

### Heading 3

# Paragraph

Paragraph 1

Paragraph 2

Multiline Paragraph
Line 1
Line 2

Intended Paragraph

Level 1

Level 2

# List

- [x] task1
  - [ ] subtask 1
    - [ ] multiline
subtask 2
- [x] task2
* point 1
  * subpoint 1
    * multiline
subpoint2
* point 2
1. list 1
  1. sublist 1
    1. multiline
sublist2
1. list 2
# Special

Child Page

Toggle

Toggled Content

@Alvis Tang [gatsby-source-notion](https://www.notion.so/8468103a77ae4b1a8fcda89951c9c007) [Link](https://link)

# _**Annotated**_ ~~_**Heading**_~~ with $x^2$ and color

# Unsupported






`.trimLeft(),
    ));
});
