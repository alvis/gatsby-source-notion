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
import { createHash } from 'crypto';

import {
  computeChanges,
  computeEntityMap,
  normalizeParent,
  NodeManager,
} from '#node';

import type { Database, Page } from '#types';
import { NodeInput } from 'gatsby';

function generateDatabase({
  databaseID = 'database',
  title = 'Database Title',
  parent = { type: 'workspace', workspace: true },
  createdTime = '2020-01-01T00:00:00Z',
  lastEditedTime = '2020-01-01T00:00:00Z',
  pages = [],
}: {
  databaseID?: string;
  title?: string;
  parent?: Database['parent'];
  createdBy?: { id: 'user'; object: 'user' };
  createdTime?: string;
  lastEditedBy?: { id: 'user'; object: 'user' };
  lastEditedTime?: string;
  pages?: Page[];
} = {}): Database {
  return {
    object: 'database',
    id: databaseID,
    parent,
    title,
    metadata: {
      url: `https://www.notion.so/${title.replace(' ', '-')}-${databaseID}`,
      createdTime,
      lastEditedTime,
      coverImage: null,
      iconEmoji: null,
      iconImage: null,
    },
    pages,
  };
}

function generatePage({
  pageID = 'page',
  title = 'Page Title',
  parent = { type: 'workspace', workspace: true },
  createdTime = '2020-01-01T00:00:00Z',
  lastEditedTime = '2020-01-01T00:00:00Z',
}: {
  pageID?: string;
  title?: string;
  parent?: Page['parent'];
  createdTime?: string;
  lastEditedTime?: string;
} = {}): Page {
  return {
    object: 'page',
    id: pageID,
    parent,
    properties: {},
    title,
    metadata: {
      url: `https://www.notion.so/${title.replace(' ', '-')}-${pageID}`,
      createdTime,
      lastEditedTime,
      coverImage: null,
      iconEmoji: null,
      iconImage: null,
    },
    markdown: '',
    blocks: [],
  };
}

describe('fn:computeChanges', () => {
  it('compute changes correctly', () => {
    const old = new Map<string, NodeInput>(
      Object.entries({
        id0: {
          id: 'id0',
          internal: { type: 'type', contentDigest: '0' },
        },
        id1: {
          id: 'id1',
          internal: { type: 'type', contentDigest: '1' },
        },
        id2: {
          id: 'id2',
          internal: { type: 'type', contentDigest: '2' },
        },
      }),
    );

    const current = new Map<string, NodeInput>(
      Object.entries({
        id1: {
          id: 'id1',
          internal: { type: 'type', contentDigest: 'updated' },
        },
        id2: {
          id: 'id2',
          internal: { type: 'type', contentDigest: '2' },
        },
        new: {
          id: 'new',
          internal: { type: 'type', contentDigest: 'new' },
        },
      }),
    );

    const { added, updated, removed, unchanged } = computeChanges(old, current);

    expect(added.length).toEqual(1); // new
    expect(updated.length).toEqual(1); // id1
    expect(removed.length).toEqual(1); // id0
    expect(unchanged.length).toEqual(1); // id2
  });
});

describe('fn:computeEntityMap', () => {
  it('pass with a workspace parent', () => {
    const workspaceDatabase = generateDatabase({
      databaseID: 'database_under_a_workspace',
    });

    const map = computeEntityMap([workspaceDatabase]);
    const normalized = map.get('database:database_under_a_workspace');
    expect(normalized!.id).toEqual('database_under_a_workspace');
    expect(normalized!.parent).toEqual(null);
    expect(normalized!.children).toEqual([]);
  });

  it('pass even the page parent is missing', () => {
    const pageDatabase = generateDatabase({
      databaseID: 'database_under_a_page',
      parent: { type: 'page_id', page_id: 'parent-page' },
    });

    const map = computeEntityMap([pageDatabase]);
    const normalized = map.get('database:database_under_a_page');
    expect(normalized!.id).toEqual('database_under_a_page');
    expect(normalized!.parent).toEqual({ object: 'page', id: 'parent-page' });
    expect(normalized!.children).toEqual([]);
  });

  it('pass with a dangled page without its parent database given in the config', () => {
    const dangledPage = generatePage({
      pageID: 'dangled_page',
      parent: { type: 'database_id', database_id: 'missing' },
    });

    const map = computeEntityMap([dangledPage]);
    const normalized = map.get('page:dangled_page');
    expect(normalized!.id).toEqual('dangled_page');
    expect(normalized!.parent).toEqual({ object: 'database', id: 'missing' });
    expect(normalized!.children).toEqual([]);
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

    const normalizedDB = map.get('database:database_with_pages');
    expect(normalizedDB!.id).toEqual('database_with_pages');
    expect(normalizedDB!.parent).toEqual(null);
    expect(normalizedDB!.children).toEqual([{ object: 'page', id: 'page_0' }]);

    const normalizedDBPage = map.get('page:page_0');
    expect(normalizedDBPage!.id).toEqual('page_0');
    expect(normalizedDBPage!.parent).toEqual({
      id: 'database_with_pages',
      object: 'database',
    });
    expect(normalizedDBPage!.children).toEqual([]);

    const normalizedPage = map.get('page:page_with_pages');
    expect(normalizedPage!.id).toEqual('page_with_pages');
    expect(normalizedPage!.parent).toEqual(null);
    expect(normalizedPage!.children).toEqual([
      { id: 'subpage', object: 'page' },
    ]);

    const normalizedSubpage = map.get('page:subpage');
    expect(normalizedSubpage!.id).toEqual('subpage');
    expect(normalizedSubpage!.parent).toEqual({
      id: 'page_with_pages',
      object: 'page',
    });
    expect(normalizedSubpage!.children).toEqual([]);
  });
});

describe('fn:normalizeParent', () => {
  it('transform a database parent', () => {
    expect(normalizeParent({ type: 'database_id', database_id: 'id' })).toEqual(
      {
        object: 'database',
        id: 'id',
      },
    );
  });

  it('transform a page parent', () => {
    expect(normalizeParent({ type: 'page_id', page_id: 'id' })).toEqual({
      object: 'page',
      id: 'id',
    });
  });

  it('transform a workspace parent', () => {
    expect(normalizeParent({ type: 'workspace', workspace: true })).toEqual(
      null,
    );
  });

  it('warn if an unsupported parented is given', () => {
    // @ts-expect-error
    expect(() => normalizeParent()).toThrow();
  });
});

describe('cl:NodeManager', () => {
  describe('fn:update', () => {
    const createDummyNode = async (
      args?: Partial<
        Record<'createNode' | 'deleteNode' | 'touchNode' | 'getNode', jest.Mock>
      >,
    ) => {
      const { createNode, deleteNode, touchNode, getNode } = {
        createNode: jest.fn(),
        deleteNode: jest.fn(),
        touchNode: jest.fn(),
        getNode: jest.fn((id: string) => ({
          id,
        })),
        ...args,
      };

      const createContentDigest = jest.fn((content: any) =>
        createHash('sha256').update(JSON.stringify(content)).digest('hex'),
      );
      const createNodeId = jest.fn((id) => id);

      const manager = new NodeManager({
        actions: { createNode, deleteNode, touchNode },
        cache: caching({ store: 'memory', ttl: 0 }),
        createContentDigest,
        createNodeId,
        getNode,
        reporter: { info: jest.fn() },
      } as any);
      const database = generateDatabase({
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
      await manager.update([database, ...database.pages]);

      expect(createNode).toBeCalledTimes(3); // 3 new nodes: database_with_pages, page_0, page_1
      expect(touchNode).toBeCalledTimes(0); // everything is new
      expect(deleteNode).toBeCalledTimes(0);

      // reset
      createNode.mockClear();
      touchNode.mockClear();
      deleteNode.mockClear();

      return { manager, createNode, deleteNode, touchNode };
    };

    it('send the correct number of requests after a page is updated ', async () => {
      const { manager, createNode, deleteNode, touchNode } =
        await createDummyNode();

      const database = generateDatabase({
        databaseID: 'database_with_pages',
        pages: [
          generatePage({
            pageID: 'page_0',
            parent: { type: 'database_id', database_id: 'database_with_pages' },
          }),
          generatePage({
            pageID: 'page_1',
            parent: { type: 'database_id', database_id: 'database_with_pages' },
            lastEditedTime: '2020-12-31T23:59:59Z',
          }),
        ],
      });
      await manager.update([database, ...database.pages]);
      expect(createNode).toBeCalledTimes(1); // 1 updated node: page_1 (lastEditedTime changed)
      expect(touchNode).toBeCalledTimes(2); // keeping database_with_pages and page_0
      expect(deleteNode).toBeCalledTimes(0);
    });

    it('send the correct number of requests after a page is deleted', async () => {
      const { manager, createNode, deleteNode, touchNode } =
        await createDummyNode();

      const database = generateDatabase({
        databaseID: 'database_with_pages',
        lastEditedTime: '2020-12-31T23:59:59Z',
        pages: [
          generatePage({
            pageID: 'page_0',
            parent: { type: 'database_id', database_id: 'database_with_pages' },
          }),
        ],
      });
      await manager.update([database, ...database.pages]);
      expect(createNode).toBeCalledTimes(1); // 1 updated node: database_with_pages (lastEditedTime changed)
      expect(touchNode).toBeCalledTimes(1); // keeping page_0
      expect(deleteNode).toBeCalledTimes(1); // removed page_1
    });

    it('send the correct number of requests after a new page is added', async () => {
      const { manager, createNode, deleteNode, touchNode } =
        await createDummyNode();

      const database = generateDatabase({
        databaseID: 'database_with_pages',
        lastEditedTime: '2020-12-31T23:59:59Z',
        pages: [
          generatePage({
            pageID: 'page_0',
            parent: { type: 'database_id', database_id: 'database_with_pages' },
          }),
          generatePage({
            pageID: 'page_1',
            parent: { type: 'database_id', database_id: 'database_with_pages' },
          }),
          generatePage({
            pageID: 'page_2',
            parent: { type: 'database_id', database_id: 'database_with_pages' },
          }),
        ],
      });
      await manager.update([database, ...database.pages]);
      expect(createNode).toBeCalledTimes(2); // 1 updated node: database_with_pages (lastEditedTime changed) + 1 new node: page_2
      expect(touchNode).toBeCalledTimes(2); // keeping everything else
      expect(deleteNode).toBeCalledTimes(0);
    });

    it('send the correct number of requests after a database is updated', async () => {
      const { manager, createNode, deleteNode, touchNode } =
        await createDummyNode();

      // forth call with database updated
      const databaseUpdated = generateDatabase({
        databaseID: 'database_with_pages',
        title: 'New Title',
        lastEditedTime: '2020-12-31T23:59:59Z',
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
      await manager.update([databaseUpdated, ...databaseUpdated.pages]);
      expect(createNode).toBeCalledTimes(1); // 1 updated node: database_with_pages (title changed)
      expect(touchNode).toBeCalledTimes(2); // keeping page_0, page_1
      expect(deleteNode).toBeCalledTimes(0);
    });

    it('recreate nodes from cache for any missing nodes due to updates on the parents', async () => {
      const { manager, createNode, deleteNode, touchNode } =
        await createDummyNode({
          // mock that all existing nodes got garbage collected
          getNode: jest.fn(() => undefined),
        });

      // forth call with database updated
      const databaseUpdated = generateDatabase({
        databaseID: 'database_with_pages',
        lastEditedTime: '2020-12-31T23:59:59Z',
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
      await manager.update([databaseUpdated, ...databaseUpdated.pages]);
      expect(createNode).toBeCalledTimes(3); // 1 updated node: database_with_pages + 2 recreated nodes: page_0, page_1
      expect(touchNode).toBeCalledTimes(0); // no touch because all nodes are missing
      expect(deleteNode).toBeCalledTimes(0);
    });
  });
});
