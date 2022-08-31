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

import type { Block, NotionAPIBlock, NotionAPIRichText } from '#types';

/* eslint-disable @typescript-eslint/naming-convention */

/**
 * annotate a text as bold
 * @param block a RichText block to be annotated
 * @returns an annotated RichText block
 */
export function bold(block: NotionAPIRichText): NotionAPIRichText {
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
export function italic(block: NotionAPIRichText): NotionAPIRichText {
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
export function strikethrough(block: NotionAPIRichText): NotionAPIRichText {
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
export function code(block: NotionAPIRichText): NotionAPIRichText {
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
export function math(block: NotionAPIRichText): NotionAPIRichText {
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
 * get the url of a file property
 * @param image a file property returned from Notion API
 * @returns its url
 */
export function image(
  image: Extract<NotionAPIBlock, { type: 'image' }>['image'],
): string {
  const caption = texts(image.caption);
  const url = image.type === 'external' ? image.external.url : image.file.url;

  return `![${caption}](${url})`;
}

/**
 * convert a RichText block to markdown format
 * @param block a RichText block to be parsed
 * @returns text in markdown format
 */
export function text(block: NotionAPIRichText): string {
  const plain = strikethrough(italic(bold(code(math(block))))).plain_text;

  return block.href ? `[${plain}](${block.href})` : plain;
}

/**
 * convert RichText blocks to markdown format
 * @param blocks RichText blocks to be parsed
 * @param indent space to be prefixed to the content per line
 * @returns text in markdown format
 */
export function texts(blocks: NotionAPIRichText[], indent = ''): string {
  return `${indent}${blocks.map(text).join('')}`;
}

/**
 * add children content to the parent text if present
 * @param parent first part of the content
 * @param block the content block which may contain children
 * @param indent space to be prefixed to the content per line
 * @returns content with children content if present
 */
function appendChildren(parent: string, block: Block, indent: string): string {
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
// eslint-disable-next-line max-lines-per-function
export function parse(block: Block, indent = ''): string | null {
  const append = (text: string): string =>
    appendChildren(text, block, `${indent}  `);

  switch (block.type) {
    case 'heading_1':
      return `# ${texts(block.heading_1.rich_text)}\n`;
    case 'heading_2':
      return `## ${texts(block.heading_2.rich_text)}\n`;
    case 'heading_3':
      return `### ${texts(block.heading_3.rich_text)}\n`;
    case 'paragraph':
      return `${append(texts(block.paragraph.rich_text))}\n`;
    case 'bulleted_list_item':
      return indent + append(`* ${texts(block.bulleted_list_item.rich_text)}`);
    case 'numbered_list_item':
      return indent + append(`1. ${texts(block.numbered_list_item.rich_text)}`);
    case 'to_do': {
      const checked = block.to_do.checked ? 'x' : ' ';

      return indent + append(`- [${checked}] ${texts(block.to_do.rich_text)}`);
    }
    case 'toggle':
      return `${append(texts(block.toggle.rich_text))}\n`;
    case 'child_page':
      return `${append(block.child_page.title)}\n`;
    case 'image':
      return `${append(image(block.image))}\n`;
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
export function markdown(blocks: Block[], indent = ''): string {
  return blocks
    .map((block) => parse(block, indent))
    .filter((text): text is string => text !== null)
    .join('\n');
}
