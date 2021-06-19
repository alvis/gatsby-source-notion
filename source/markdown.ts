/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Collection of block to markdown convertors
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import type { FullBlock, RichText } from '#types';

/* eslint-disable @typescript-eslint/naming-convention */

/**
 * annotate a text as bold
 * @param block a RichText block to be annotated
 * @returns an annotated RichText block
 */
export function bold(block: RichText): RichText {
  return block.annotations.bold
    ? {
        ...block,
        annotations: { ...block.annotations, bold: false },
        plain_text: `**${block.plain_text}**`,
      }
    : block;
}

/**
 * annotate a text as italic
 * @param block a RichText block to be annotated
 * @returns an annotated RichText block
 */
export function italic(block: RichText): RichText {
  return block.annotations.italic
    ? {
        ...block,
        annotations: { ...block.annotations, italic: false },
        plain_text: `_${block.plain_text}_`,
      }
    : block;
}

/**
 * annotate a text as strike-through
 * @param block a RichText block to be annotated
 * @returns an annotated RichText block
 */
export function strikethrough(block: RichText): RichText {
  return block.annotations.strikethrough
    ? {
        ...block,
        annotations: { ...block.annotations, strikethrough: false },
        plain_text: `~~${block.plain_text}~~`,
      }
    : block;
}

/**
 * annotate a text as an inline code
 * @param block a RichText block to be annotated
 * @returns an annotated RichText block
 */
export function code(block: RichText): RichText {
  return block.annotations.code
    ? {
        ...block,
        annotations: { ...block.annotations, code: false },
        plain_text: `\`${block.plain_text}\``,
      }
    : block;
}

/**
 * annotate a text as an inline code
 * @param block a RichText block to be annotated
 * @returns an annotated RichText block
 */
export function math(block: RichText): RichText {
  return block.type === 'equation'
    ? {
        ...block,
        type: 'text',
        plain_text: `$${block.equation.expression}$`,
        text: { content: `$${block.equation.expression}$`, link: null },
      }
    : block;
}

/* eslint-enable */

/**
 * convert a RichText block to markdown format
 * @param block a RichText block to be parsed
 * @returns text in markdown format
 */
export function text(block: RichText): string {
  const plain = strikethrough(italic(bold(code(math(block))))).plain_text;

  return block.href ? `[${plain}](${block.href})` : plain;
}

/**
 * convert RichText blocks to markdown format
 * @param blocks RichText blocks to be parsed
 * @param indent space to be prefixed to the content per line
 * @returns text in markdown format
 */
export function texts(blocks: RichText[], indent = ''): string {
  return `${indent}${blocks.map(text).join('')}`;
}

/**
 * add children content to the parent text if present
 * @param parent first part of the content
 * @param block the content block which may contain children
 * @param indent space to be prefixed to the content per line
 * @returns content with children content if present
 */
function appendChildren(
  parent: string,
  block: FullBlock,
  indent: string,
): string {
  const supportedChildren = block.has_children
    ? block.children.filter((child) => child.type !== 'unsupported')
    : [];

  if (supportedChildren.length) {
    const content = markdown(supportedChildren, indent);

    // no extra line for list-like items
    const glue = [
      'bulleted_list_item',
      'numbered_list_item',
      'to_do',
      undefined,
    ].includes(supportedChildren[0].type)
      ? ''
      : '\n';

    // the ending \n will be attached to the parent block
    // so removing it from the children content to prevent extra lines
    return parent + '\n' + glue + content.trimRight();
  } else {
    return parent;
  }
}

/**
 * convert a Block to markdown format
 * @param block a Block to be parsed
 * @param indent space to be prefixed to the content per line
 * @returns text in markdown format
 */
export function parse(block: FullBlock, indent = ''): string | null {
  const append = (text: string): string =>
    appendChildren(text, block, `${indent}  `);

  switch (block.type) {
    case 'heading_1':
      return `# ${texts(block.heading_1.text)}\n`;
    case 'heading_2':
      return `## ${texts(block.heading_2.text)}\n`;
    case 'heading_3':
      return `### ${texts(block.heading_3.text)}\n`;
    case 'paragraph':
      return `${append(texts(block.paragraph.text))}\n`;
    case 'bulleted_list_item':
      return indent + append(`* ${texts(block.bulleted_list_item.text)}`);
    case 'numbered_list_item':
      return indent + append(`1. ${texts(block.numbered_list_item.text)}`);
    case 'to_do': {
      const checked = block.to_do.checked ? 'x' : ' ';

      return indent + append(`- [${checked}] ${texts(block.to_do.text)}`);
    }
    case 'toggle':
      return `${append(texts(block.toggle.text))}\n`;
    case 'child_page':
      return `${append(block.child_page.title)}\n`;
    case 'unsupported':
    default:
      return null;
  }
}

/**
 * convert Blocks to markdown format
 * @param blocks Blocks to be parsed
 * @param indent space to be prefixed to the content per line
 * @returns text in markdown format
 */
export function markdown(blocks: FullBlock[], indent = ''): string {
  return blocks
    .map((block) => parse(block, indent))
    .filter((text): text is string => text !== null)
    .join('\n');
}
