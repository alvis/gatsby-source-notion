/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Examples of content
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import type { Block, NotionAPIRichText } from '#types';

const commonMetadata: Pick<
  Block,
  | 'object'
  | 'id'
  | 'archived'
  | 'created_by'
  | 'created_time'
  | 'last_edited_by'
  | 'last_edited_time'
> = {
  object: 'block',
  id: 'uuid',
  archived: false,
  created_by: { object: 'user', id: 'uuid' },
  created_time: '2020-01-01T00:00:00Z',
  last_edited_by: { object: 'user', id: 'uuid' },
  last_edited_time: '2020-01-01T00:00:00Z',
};

export const richtext: NotionAPIRichText[] = [
  {
    annotations: {
      bold: true,
      code: false,
      color: 'default',
      italic: true,
      strikethrough: false,
      underline: false,
    },
    href: null,
    plain_text: 'Annotated',
    text: {
      content: 'Annotated',
      link: null,
    },
    type: 'text',
  },
  {
    annotations: {
      bold: false,
      code: false,
      color: 'default',
      italic: false,
      strikethrough: false,
      underline: false,
    },
    href: null,
    plain_text: ' ',
    text: {
      content: ' ',
      link: null,
    },
    type: 'text',
  },
  {
    annotations: {
      bold: true,
      code: false,
      color: 'default',
      italic: true,
      strikethrough: true,
      underline: true,
    },
    href: null,
    plain_text: 'Heading',
    text: {
      content: 'Heading',
      link: null,
    },
    type: 'text',
  },
  {
    annotations: {
      bold: false,
      code: false,
      color: 'default',
      italic: false,
      strikethrough: false,
      underline: false,
    },
    href: null,
    plain_text: ' with ',
    text: {
      content: ' with ',
      link: null,
    },
    type: 'text',
  },
  {
    annotations: {
      bold: false,
      code: false,
      color: 'default',
      italic: false,
      strikethrough: false,
      underline: false,
    },
    equation: {
      expression: 'x^2',
    },
    href: null,
    plain_text: 'x^2',
    type: 'equation',
  },
  {
    annotations: {
      bold: false,
      code: false,
      color: 'default',
      italic: false,
      strikethrough: false,
      underline: false,
    },
    href: null,
    plain_text: ' and ',
    text: {
      content: ' and ',
      link: null,
    },
    type: 'text',
  },
  {
    annotations: {
      bold: false,
      code: false,
      color: 'yellow_background',
      italic: false,
      strikethrough: false,
      underline: false,
    },
    href: null,
    plain_text: 'color',
    text: {
      content: 'color',
      link: null,
    },
    type: 'text',
  },
];

export const childPage: Block = {
  ...commonMetadata,
  has_children: false,
  type: 'child_page',
  child_page: {
    title: 'Child Page',
  },
};

export const unsupported: Block = {
  ...commonMetadata,
  has_children: false,
  type: 'unsupported',
  unsupported: {},
};

export const unsupportedIndented: Block = {
  ...commonMetadata,
  type: 'paragraph',
  has_children: true,
  paragraph: { color: 'default', rich_text: [] },
  children: [unsupported, unsupported, unsupported],
};

export const header1: Block = {
  ...commonMetadata,
  type: 'heading_1',
  has_children: false,
  heading_1: {
    color: 'default',
    rich_text: [
      {
        annotations: {
          bold: false,
          code: false,
          color: 'default',
          italic: false,
          strikethrough: false,
          underline: false,
        },
        href: null,
        plain_text: 'Heading 1',
        text: {
          content: 'Heading 1',
          link: null,
        },
        type: 'text',
      },
    ],
  },
};

export const header2: Block = {
  ...commonMetadata,
  type: 'heading_2',
  has_children: false,
  heading_2: {
    color: 'default',
    rich_text: [
      {
        annotations: {
          bold: false,
          code: false,
          color: 'default',
          italic: false,
          strikethrough: false,
          underline: false,
        },
        href: null,
        plain_text: 'Heading 2',
        text: {
          content: 'Heading 2',
          link: null,
        },
        type: 'text',
      },
    ],
  },
};

export const header3: Block = {
  ...commonMetadata,
  type: 'heading_3',
  has_children: false,
  heading_3: {
    color: 'default',
    rich_text: [
      {
        annotations: {
          bold: false,
          code: false,
          color: 'default',
          italic: false,
          strikethrough: false,
          underline: false,
        },
        href: null,
        plain_text: 'Heading 3',
        text: {
          content: 'Heading 3',
          link: null,
        },
        type: 'text',
      },
    ],
  },
};

export const paragraphSingleline: Block = {
  ...commonMetadata,
  has_children: false,
  type: 'paragraph',
  paragraph: {
    color: 'default',
    rich_text: [
      {
        type: 'text',
        text: { content: 'Paragraph', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Paragraph',
        href: null,
      },
    ],
  },
};

export const paragraphMultiline: Block = {
  ...commonMetadata,
  has_children: false,
  type: 'paragraph',
  paragraph: {
    color: 'default',
    rich_text: [
      {
        type: 'text',
        text: {
          content: 'Multiline Paragraph\nLine 1\nLine 2',
          link: null,
        },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Multiline Paragraph\nLine 1\nLine 2',
        href: null,
      },
    ],
  },
};

export const paragraphIndented: Block = {
  ...commonMetadata,
  has_children: true,
  type: 'paragraph',
  paragraph: {
    color: 'default',
    rich_text: [
      {
        type: 'text',
        text: { content: 'Intended Paragraph', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Intended Paragraph',
        href: null,
      },
    ],
  },
  children: [
    {
      ...commonMetadata,
      has_children: true,
      type: 'paragraph',
      paragraph: {
        color: 'default',
        rich_text: [
          {
            type: 'text',
            text: {
              content: 'Level 1',
              link: null,
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Level 1',
            href: null,
          },
        ],
      },
      children: [
        {
          ...commonMetadata,
          has_children: false,
          type: 'paragraph',
          paragraph: {
            color: 'default',
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Level 2',
                  link: null,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: 'Level 2',
                href: null,
              },
            ],
          },
        },
      ],
    },
  ],
};

export const paragraphEmpty: Block = {
  ...commonMetadata,
  has_children: false,
  type: 'paragraph',
  paragraph: {
    color: 'default',
    rich_text: [],
  },
};

export const paragraphIndentedEmpty: Block = {
  ...commonMetadata,
  has_children: true,
  type: 'paragraph',
  paragraph: {
    color: 'default',
    rich_text: [
      {
        type: 'text',
        text: { content: '', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: '',
        href: null,
      },
    ],
  },
  children: [
    unsupported,
    {
      ...commonMetadata,
      has_children: false,
      type: 'paragraph',
      paragraph: {
        color: 'default',
        rich_text: [
          {
            type: 'text',
            text: { content: '', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: '',
            href: null,
          },
        ],
      },
    },
  ],
};

export const toggle: Block = {
  ...commonMetadata,
  has_children: true,
  type: 'toggle',
  toggle: {
    color: 'default',
    rich_text: [
      {
        type: 'text',
        text: { content: 'Toggle', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'Toggle',
        href: null,
      },
    ],
  },
  children: [
    {
      ...commonMetadata,
      has_children: false,
      type: 'paragraph',
      paragraph: {
        color: 'default',
        rich_text: [
          {
            type: 'text',
            text: {
              content: 'Toggled Content',
              link: null,
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Toggled Content',
            href: null,
          },
        ],
      },
    },
  ],
};

export const full: Block[] = [
  header1,
  header2,
  header3,
  {
    ...commonMetadata,
    has_children: false,
    type: 'heading_1',
    heading_1: {
      color: 'default',
      rich_text: [
        {
          type: 'text',
          text: { content: 'Paragraph', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'Paragraph',
          href: null,
        },
      ],
    },
  },
  {
    ...commonMetadata,
    has_children: false,
    type: 'paragraph',
    paragraph: {
      color: 'default',
      rich_text: [
        {
          type: 'text',
          text: { content: 'Paragraph 1', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'Paragraph 1',
          href: null,
        },
      ],
    },
  },
  {
    ...commonMetadata,
    has_children: false,
    type: 'paragraph',
    paragraph: {
      color: 'default',
      rich_text: [
        {
          type: 'text',
          text: { content: 'Paragraph 2', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'Paragraph 2',
          href: null,
        },
      ],
    },
  },
  paragraphMultiline,
  paragraphIndented,
  {
    ...commonMetadata,
    has_children: false,
    type: 'heading_1',
    heading_1: {
      color: 'default',
      rich_text: [
        {
          type: 'text',
          text: { content: 'List', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'List',
          href: null,
        },
      ],
    },
  },
  {
    ...commonMetadata,
    has_children: true,
    type: 'to_do',
    to_do: {
      color: 'default',
      rich_text: [
        {
          type: 'text',
          text: { content: 'task1', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'task1',
          href: null,
        },
      ],
      checked: true,
    },
    children: [
      {
        ...commonMetadata,
        has_children: true,
        type: 'to_do',
        to_do: {
          color: 'default',
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'subtask 1',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'subtask 1',
              href: null,
            },
          ],
          checked: false,
        },
        children: [
          {
            ...commonMetadata,
            has_children: false,
            type: 'to_do',
            to_do: {
              color: 'default',
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: 'multiline\nsubtask 2',
                    link: null,
                  },
                  annotations: {
                    bold: false,
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: 'default',
                  },
                  plain_text: 'multiline\nsubtask 2',
                  href: null,
                },
              ],
              checked: false,
            },
          },
        ],
      },
    ],
  },
  {
    ...commonMetadata,
    has_children: false,
    type: 'to_do',
    to_do: {
      color: 'default',
      rich_text: [
        {
          type: 'text',
          text: { content: 'task2', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'task2',
          href: null,
        },
      ],
      checked: true,
    },
  },
  {
    ...commonMetadata,
    has_children: true,
    type: 'bulleted_list_item',
    bulleted_list_item: {
      color: 'default',
      rich_text: [
        {
          type: 'text',
          text: { content: 'point 1', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'point 1',
          href: null,
        },
      ],
    },
    children: [
      {
        ...commonMetadata,
        has_children: true,
        type: 'bulleted_list_item',
        bulleted_list_item: {
          color: 'default',
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'subpoint 1',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'subpoint 1',
              href: null,
            },
          ],
        },
        children: [
          {
            ...commonMetadata,
            has_children: false,
            type: 'bulleted_list_item',
            bulleted_list_item: {
              color: 'default',
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: 'multiline\nsubpoint2',
                    link: null,
                  },
                  annotations: {
                    bold: false,
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: 'default',
                  },
                  plain_text: 'multiline\nsubpoint2',
                  href: null,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    ...commonMetadata,
    has_children: false,
    type: 'bulleted_list_item',
    bulleted_list_item: {
      color: 'default',
      rich_text: [
        {
          type: 'text',
          text: { content: 'point 2', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'point 2',
          href: null,
        },
      ],
    },
  },
  {
    ...commonMetadata,
    has_children: true,
    type: 'numbered_list_item',
    numbered_list_item: {
      color: 'default',
      rich_text: [
        {
          type: 'text',
          text: { content: 'list 1', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'list 1',
          href: null,
        },
      ],
    },
    children: [
      {
        ...commonMetadata,
        has_children: true,
        type: 'numbered_list_item',
        numbered_list_item: {
          color: 'default',
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'sublist 1',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'sublist 1',
              href: null,
            },
          ],
        },
        children: [
          {
            ...commonMetadata,
            has_children: false,
            type: 'numbered_list_item',
            numbered_list_item: {
              color: 'default',
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: 'multiline\nsublist2',
                    link: null,
                  },
                  annotations: {
                    bold: false,
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: 'default',
                  },
                  plain_text: 'multiline\nsublist2',
                  href: null,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    ...commonMetadata,
    has_children: false,
    type: 'numbered_list_item',
    numbered_list_item: {
      color: 'default',
      rich_text: [
        {
          type: 'text',
          text: { content: 'list 2', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'list 2',
          href: null,
        },
      ],
    },
  },
  {
    ...commonMetadata,
    has_children: false,
    type: 'heading_1',
    heading_1: {
      color: 'default',
      rich_text: [
        {
          type: 'text',
          text: { content: 'Special', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'Special',
          href: null,
        },
      ],
    },
  },
  childPage,
  toggle,
  {
    ...commonMetadata,
    has_children: false,
    type: 'paragraph',
    paragraph: {
      color: 'default',
      rich_text: [
        {
          type: 'mention',
          mention: {
            type: 'user',
            user: {
              object: 'user',
              id: 'uuid',
              name: 'Alvis Tang',
              avatar_url:
                'https://lh3.googleusercontent.com/a-/AAuE7mBz34aOECu6l2g9IUYx7j4k1ApFfrfovFCC77Qa=s100',
              type: 'person',
              person: { email: 'alvis@hilbert.space' },
            },
          },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: '@Alvis Tang',
          href: null,
        },
        {
          type: 'text',
          text: { content: ' ', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: ' ',
          href: null,
        },
        {
          type: 'mention',
          mention: {
            type: 'page',
            page: { id: '8468103a-77ae-4b1a-8fcd-a89951c9c007' },
          },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'gatsby-source-notion',
          href: 'https://www.notion.so/8468103a77ae4b1a8fcda89951c9c007',
        },
        {
          type: 'text',
          text: { content: ' ', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: ' ',
          href: null,
        },
        {
          type: 'text',
          text: { content: 'Link', link: { url: 'https://link' } },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'Link',
          href: 'https://link',
        },
      ],
    },
  },
  {
    ...commonMetadata,
    has_children: false,
    type: 'heading_1',
    heading_1: {
      color: 'default',
      rich_text: [
        {
          type: 'text',
          text: { content: 'Annotated', link: null },
          annotations: {
            bold: true,
            italic: true,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'Annotated',
          href: null,
        },
        {
          type: 'text',
          text: { content: ' ', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: ' ',
          href: null,
        },
        {
          type: 'text',
          text: { content: 'Heading', link: null },
          annotations: {
            bold: true,
            italic: true,
            strikethrough: true,
            underline: true,
            code: false,
            color: 'default',
          },
          plain_text: 'Heading',
          href: null,
        },
        {
          type: 'text',
          text: { content: ' with ', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: ' with ',
          href: null,
        },
        {
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
        },
        {
          type: 'text',
          text: { content: ' and ', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: ' and ',
          href: null,
        },
        {
          type: 'text',
          text: { content: 'color', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'yellow_background',
          },
          plain_text: 'color',
          href: null,
        },
      ],
    },
  },
  {
    ...commonMetadata,
    has_children: false,
    type: 'heading_1',
    heading_1: {
      color: 'default',
      rich_text: [
        {
          type: 'text',
          text: { content: 'Unsupported', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'Unsupported',
          href: null,
        },
      ],
    },
  },
  unsupported,
  unsupported,
  unsupported,
  unsupported,
  unsupportedIndented,
  {
    ...commonMetadata,
    has_children: true,
    type: 'paragraph',
    paragraph: { rich_text: [], color: 'default' },
    children: [
      unsupported,
      {
        ...commonMetadata,
        has_children: false,
        type: 'paragraph',
        paragraph: {
          color: 'default',
          rich_text: [],
        },
      },
      unsupported,
    ],
  },
  unsupported,
];
