/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   Helpers for handling gatsby's nodes
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2021 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import { name } from '#.';

import type { File, FullDatabase, FullPage, Icon } from '#types';
import type { NodeInput, NodePluginArgs } from 'gatsby';

interface ContentNode<Type extends string> extends NodeInput {
  ref: string;
  createdTime: string;
  lastEditedTime: string;
  archived: boolean;
  title: string;
  icon?: Icon,
  cover?: File,
  internal: {
    type: Type;
  } & NodeInput['internal'];
}

interface Link {
  object: string;
  id: string;
}

type FullEntity = FullDatabase | FullPage;
type NormalisedEntity<E extends FullEntity = FullEntity> = E extends any
  ? Omit<E, 'parent'> & {
      parent: Link | null;
      children: Link[];
    }
  : never;

/** manage nodes based on data returned from Notion API */
export class NodeManager {
  private createNode: NodePluginArgs['actions']['createNode'];
  private deleteNode: NodePluginArgs['actions']['deleteNode'];
  private touchNode: NodePluginArgs['actions']['touchNode'];
  private createNodeId: NodePluginArgs['createNodeId'];
  private createContentDigest: NodePluginArgs['createContentDigest'];
  private cache: NodePluginArgs['cache'];
  private getNode: NodePluginArgs['getNode'];
  private reporter: NodePluginArgs['reporter'];

  /**
   * create a node manager using arguments from the sourceNodes API
   * @param args arguments passed from the sourceNodes API
   */
  constructor(args: NodePluginArgs) {
    /* eslint-disable @typescript-eslint/unbound-method */
    const {
      actions: { createNode, deleteNode, touchNode },
      cache,
      createContentDigest,
      createNodeId,
      getNode,
      reporter,
    } = args;
    /* eslint-enable */

    this.cache = cache;
    this.createNode = createNode;
    this.deleteNode = deleteNode;
    this.touchNode = touchNode;
    this.createNodeId = createNodeId;
    this.createContentDigest = createContentDigest;
    this.getNode = getNode;
    this.reporter = reporter;
  }

  /**
   * update nodes available on gatsby
   * @param entities all entities collected from notion, including database and page
   */
  public async update(entities: FullEntity[]): Promise<void> {
    // get entries with relationship build-in
    const old = new Map<string, NodeInput>(
      (await this.cache.get('nodeGraph')) ?? [],
    );
    const current = this.computeNodeGraph(entities);
    const { added, updated, removed, unchanged } = computeChanges(old, current);

    // for the usage of createNode
    // see https://www.gatsbyjs.com/docs/reference/config-files/actions/#createNode
    await this.addNodes(added);
    await this.updateNodes(updated);
    this.removeNodes(removed);
    this.touchNodes(unchanged);

    await this.cache.set('nodeGraph', [...current.entries()]);
  }

  /**
   * add new nodes
   * @param added new nodes to be added
   */
  private async addNodes(added: NodeInput[]): Promise<void> {
    for (const node of added) {
      // DEBT: disable a false alarm from eslint as currently Gatsby is exporting an incorrect type
      //       this should be removed when https://github.com/gatsbyjs/gatsby/pull/32522 is merged
      /* eslint-disable @typescript-eslint/await-thenable */
      // create the node
      await this.createNode(node);
      /* eslint-enable */
    }

    // don't be noisy if there's nothing new happen
    if (added.length > 0) {
      this.reporter.info(`[${name}] added ${added.length} nodes`);
    }
  }

  /**
   * update existing nodes
   * @param updated updated nodes
   */
  private async updateNodes(updated: NodeInput[]): Promise<void> {
    for (const node of updated) {
      // DEBT: disable a false alarm from eslint as currently Gatsby is exporting an incorrect type
      //       this should be removed when https://github.com/gatsbyjs/gatsby/pull/32522 is merged
      /* eslint-disable @typescript-eslint/await-thenable */
      // update the node
      await this.createNode(node);
      /* eslint-enable */
    }

    // don't be noisy if there's nothing new happen
    if (updated.length > 0) {
      this.reporter.info(`[${name}] updated ${updated.length} nodes`);
    }
  }

  /**
   * remove old nodes
   * @param removed nodes to be removed
   */
  private removeNodes(removed: NodeInput[]): void {
    for (const node of removed) {
      this.deleteNode(node);
    }

    // don't be noisy if there's nothing new happen
    if (removed.length > 0) {
      this.reporter.info(`[${name}] removed ${removed.length} nodes`);
    }
  }

  /**
   * keep unchanged notion nodes alive
   * @param untouched list of current notion entities
   */
  private touchNodes(untouched: NodeInput[]): void {
    for (const node of untouched) {
      // DEBT: disable a false alarm from eslint as currently Gatsby is exporting an incorrect type
      //       this should be removed when https://github.com/gatsbyjs/gatsby/pull/32522 is merged
      /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */
      if (this.getNode(node.id)) {
        // just make a light-touched operation if the node is still alive
        this.touchNode({
          id: node.id,
          internal: {
            type: node.internal.type,
            contentDigest: node.internal.contentDigest,
          },
        });
      } else {
        // recreate it again if somehow it's missing
        this.createNode(node);
      }
    }

    this.reporter.info(`[${name}] keeping ${untouched.length} nodes`);
  }

  /**
   * convert entities into gatsby node with full parent-child relationship
   * @param entities all sort of entities including database and page
   * @returns a map of gatsby nodes with parent and children linked
   */
  private computeNodeGraph(entities: FullEntity[]): Map<string, NodeInput> {
    // first compute the graph with entities before converting to nodes
    const entityMap = computeEntityMap(entities);

    return new Map<string, NodeInput>(
      [...entityMap.entries()].map(([id, entity]) => [
        id,
        this.nodifyEntity(entity),
      ]),
    );
  }

  /**
   * create a database node
   * @param database a full database object
   * @returns a database node
   */
  private createDatabaseNode(
    database: NormalisedEntity<FullDatabase>,
  ): ContentNode<'NotionDatabase'> {
    return this.createBaseNode(database, { type: 'NotionDatabase' });
  }

  /**
   * create a page node
   * @param page a full page object
   * @returns a page node
   */
  private createPageNode(
    page: NormalisedEntity<FullPage>,
  ): ContentNode<'NotionPage'> {
    return this.createBaseNode(page, {
      type: 'NotionPage',
      content: page.markdown,
      mediaType: 'text/markdown',
    });
  }

  /**
   * create a node based on common field from an entity
   * @param entity a database or page
   * @param internal extra fields to be merged with in the internal field
   * @returns a node with common data
   */
  private createBaseNode<T extends string>(
    entity: NormalisedEntity,
    internal: Omit<NodeInput['internal'], 'contentDigest'> & { type: T },
  ): ContentNode<T> {
    const basis = {
      id: this.createNodeId(`${entity.object}:${entity.id}`),
      ref: entity.id,
      createdTime: entity.created_time,
      lastEditedTime: entity.last_edited_time,
      properties: entity.properties,
      archived: entity.archived,
      title: entity.title,
      icon: entity.icon,
      cover: entity.cover,
      parent: entity.parent
        ? this.createNodeId(`${entity.parent.object}:${entity.parent.id}`)
        : null,
      children: entity.children.map(({ object, id }) =>
        this.createNodeId(`${object}:${id}`),
      ),
    };

    const excludedKeys = ['parent', 'children', 'internal'];
    const contentDigest = this.createContentDigest(omit(basis, excludedKeys));

    return {
      ...basis,
      internal: {
        contentDigest,
        ...internal,
      },
    };
  }

  /**
   * convert an entity to a NodeInput
   * @param entity the entity to be converted
   * @returns converted entity ready to be consumed by gatsby
   */
  private nodifyEntity(entity: NormalisedEntity): NodeInput {
    switch (entity.object) {
      case 'database':
        return this.createDatabaseNode(entity);
      case 'page':
        return this.createPageNode(entity);
      /* istanbul ignore next */
      default:
        throw new TypeError(`unable to process ${JSON.stringify(entity)}`);
    }
  }
}

/**
 * compute changes between two node graphs
 * @param old the old graph
 * @param current the latest graph
 * @returns a map of nodes in different states
 */
export function computeChanges(
  old: Map<string, NodeInput>,
  current: Map<string, NodeInput>,
): Record<'added' | 'updated' | 'removed' | 'unchanged', NodeInput[]> {
  const added = [...current.entries()].filter(([id]) => !old.has(id));
  const removed = [...old.entries()].filter(([id]) => !current.has(id));

  const bothExists = [...current.entries()].filter(([id]) => old.has(id));
  const updated = bothExists.filter(
    ([id, node]) =>
      old.get(id)!.internal.contentDigest !== node.internal.contentDigest,
  );
  const unchanged = bothExists.filter(
    ([id, node]) =>
      old.get(id)!.internal.contentDigest === node.internal.contentDigest,
  );

  return {
    added: added.map(([, node]) => node),
    updated: updated.map(([, node]) => node),
    removed: removed.map(([, node]) => node),
    unchanged: unchanged.map(([, node]) => node),
  };
}

/**
 * attach parent-child relationship to gatsby node
 * @param entities all sort of entities including database and page
 * @returns a map of entities with parent and children linked
 */
export function computeEntityMap(
  entities: FullEntity[],
): Map<string, NormalisedEntity> {
  // create a new working set
  const map = new Map<string, NormalisedEntity>();
  for (const entity of entities) {
    map.set(`${entity.object}:${entity.id}`, {
      ...entity,
      parent: normaliseParent(entity.parent),
      children: [],
    });
  }

  for (const { id, parent, object } of entities) {
    const child = { object, id };
    switch (parent.type) {
      case 'database_id':
        map.get(`database:${parent.database_id}`)?.children.push(child);
        break;
      case 'page_id':
        map.get(`page:${parent.page_id}`)?.children.push(child);
        break;
      case 'workspace':
        // do nothing
        break;
      /* istanbul ignore next */
      default:
        throw new TypeError(`unknown parent type from ${object}:${id}`);
    }
  }

  return map;
}

/**
 * transform the parent field to an unified format
 * @param parent the parent field returned from Notion API
 * @returns information about the parent in an unified format
 */
export function normaliseParent(parent: FullEntity['parent']): Link | null {
  switch (parent.type) {
    case 'database_id':
      return { object: 'database', id: parent.database_id };
    case 'page_id':
      return { object: 'page', id: parent.page_id };
    case 'workspace':
      return null;
    /* istanbul ignore next */
    default:
      throw new TypeError(`unknown parent`);
  }
}

/**
 * return an object with the specified keys omitted
 * @param record the record to be converted
 * @param keys a list of keys to be omitted
 * @returns an object with the specified keys omitted
 */
function omit(
  record: Record<string, unknown>,
  keys: string[],
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(record).filter(([key]) => !keys.includes(key)),
  );
}
