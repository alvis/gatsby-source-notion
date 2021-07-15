/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Tests on the node manager
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import { caching } from 'cache-manager';

import { computeEntityMap, normaliseParent, NodeManager } from '#node';

import type { FullDatabase, FullPage } from '#types';

function generateDatabase({
  databaseID = 'database',
  title = 'Database Title',
  parent = { type: 'workspace' },
  pages = [],
}: {
  databaseID?: string;
  title?: string;
  parent?: FullDatabase['parent'];
  pages?: FullPage[];
} = {}): FullDatabase {
  return {
    object: 'database',
    id: databaseID,
    created_time: '2020-01-01T00:00:00Z',
    last_edited_time: '2020-01-01T00:00:00Z',
    parent,
    title,
    properties: {
      Name: {
        id: 'title',
        type: 'title',
        title: {},
      },
    },
    pages,
  };
}

function generatePage({
  pageID = 'page',
  title = 'Page Title',
  parent = { type: 'workspace' },
  lastEditedTime = '2020-01-01T00:00:00Z',
}: {
  pageID?: string;
  title?: string;
  parent?: FullPage['parent'];
  lastEditedTime?: string;
} = {}): FullPage {
  return {
    object: 'page',
    id: pageID,
    created_time: '2020-01-01T00:00:00Z',
    last_edited_time: lastEditedTime,
    parent,
    archived: false,
    url: `https://www.notion.so/${title.replace(' ', '-')}-${pageID}`,
    properties: {},
    title,
    markdown: '',
    blocks: [],
  };
}

describe('fn:computeEntityMap', () => {
  it('pass with a workspace parent', () => {
    const workspaceDatabase = generateDatabase({
      databaseID: 'database_under_a_workspace',
    });

    const map = computeEntityMap([workspaceDatabase]);
    const normalised = map.get('database:database_under_a_workspace');
    expect(normalised!.id).toEqual('database_under_a_workspace');
    expect(normalised!.parent).toEqual(null);
    expect(normalised!.children).toEqual([]);
  });

  it('pass even the page parent is missing', () => {
    const pageDatabase = generateDatabase({
      databaseID: 'database_under_a_page',
      parent: { type: 'page_id', page_id: 'parent-page' },
    });

    const map = computeEntityMap([pageDatabase]);
    const normalised = map.get('database:database_under_a_page');
    expect(normalised!.id).toEqual('database_under_a_page');
    expect(normalised!.parent).toEqual({ object: 'page', id: 'parent-page' });
    expect(normalised!.children).toEqual([]);
  });

  it('pass with a dangled page without its parent database given in the config', () => {
    const dangledPage = generatePage({
      pageID: 'dangled_page',
      parent: { type: 'database_id', database_id: 'missing' },
    });

    const map = computeEntityMap([dangledPage]);
    const normalised = map.get('page:dangled_page');
    expect(normalised!.id).toEqual('dangled_page');
    expect(normalised!.parent).toEqual({ object: 'database', id: 'missing' });
    expect(normalised!.children).toEqual([]);
  });

  it('build up a map with parent-children relation included', () => {
    const database = generateDatabase({
      databaseID: 'database_with_pages',
      pages: [
        generatePage({
          pageID: 'page_0',
          parent: { type: 'database_id', database_id: 'database_with_pages' },
        }),
      ],
    });
    const page = generatePage({ pageID: 'page_with_pages' });
    const subpage = generatePage({
      pageID: 'subpage',
      parent: { type: 'page_id', page_id: 'page_with_pages' },
    });

    const map = computeEntityMap([database, ...database.pages, page, subpage]);
    expect(map.size).toEqual(4);

    const normalisedDB = map.get('database:database_with_pages');
    expect(normalisedDB!.id).toEqual('database_with_pages');
    expect(normalisedDB!.parent).toEqual(null);
    expect(normalisedDB!.children).toEqual([{ object: 'page', id: 'page_0' }]);

    const normalisedDBPage = map.get('page:page_0');
    expect(normalisedDBPage!.id).toEqual('page_0');
    expect(normalisedDBPage!.parent).toEqual({
      id: 'database_with_pages',
      object: 'database',
    });
    expect(normalisedDBPage!.children).toEqual([]);

    const normalisedPage = map.get('page:page_with_pages');
    expect(normalisedPage!.id).toEqual('page_with_pages');
    expect(normalisedPage!.parent).toEqual(null);
    expect(normalisedPage!.children).toEqual([
      { id: 'subpage', object: 'page' },
    ]);

    const normalisedSubpage = map.get('page:subpage');
    expect(normalisedSubpage!.id).toEqual('subpage');
    expect(normalisedSubpage!.parent).toEqual({
      id: 'page_with_pages',
      object: 'page',
    });
    expect(normalisedSubpage!.children).toEqual([]);
  });
});

describe('fn:normaliseParent', () => {
  it('transform a database parent', () => {
    expect(normaliseParent({ type: 'database_id', database_id: 'id' })).toEqual(
      {
        object: 'database',
        id: 'id',
      },
    );
  });

  it('transform a page parent', () => {
    expect(normaliseParent({ type: 'page_id', page_id: 'id' })).toEqual({
      object: 'page',
      id: 'id',
    });
  });

  it('transform a workspace parent', () => {
    expect(normaliseParent({ type: 'workspace' })).toEqual(null);
  });

  it('warn if an unsupported parented is given', () => {
    // @ts-expect-error
    expect(() => normaliseParent()).toThrow();
  });
});

describe('cl:NodeManager', () => {
  describe('fn:update', () => {
    it('always keep gatsby synced', async () => {
      const createNode = jest.fn();
      const deleteNode = jest.fn();
      const createContentDigest = jest.fn(() => 'digest');
      const createNodeId = jest.fn((id) => id);

      const manager = new NodeManager({
        actions: { createNode, deleteNode },
        cache: caching({ store: 'memory', ttl: 0 }),
        createContentDigest,
        createNodeId,
        reporter: { info: jest.fn() },
      } as any);
      const originalDatabase = generateDatabase({
        databaseID: 'database_with_pages',
        pages: [
          generatePage({
            pageID: 'page_0',
            parent: { type: 'database_id', database_id: 'database_with_pages' },
          }),
          generatePage({
            pageID: 'page_1',
            parent: { type: 'database_id', database_id: 'database_with_pages' },
          }),
        ],
      });

      // first call
      await manager.update([originalDatabase, ...originalDatabase.pages]);

      expect(createNode).toBeCalledTimes(3);
      expect(deleteNode).toBeCalledTimes(0);

      // reset
      createNode.mockClear();
      deleteNode.mockClear();

      // second call with data updated
      const updatedDatabase = generateDatabase({
        databaseID: 'database_with_pages',
        pages: [
          generatePage({
            pageID: 'page_0',
            title: 'New Title',
            parent: { type: 'database_id', database_id: 'database_with_pages' },
            lastEditedTime: '2020-12-31T23:59:59Z',
          }),
        ],
      });
      await manager.update([updatedDatabase, ...updatedDatabase.pages]);
      expect(createNode).toBeCalledTimes(2);
      expect(deleteNode).toBeCalledTimes(1);
    });
  });
});
