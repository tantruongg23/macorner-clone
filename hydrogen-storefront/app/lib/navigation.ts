import type { Storefront } from '@shopify/hydrogen';
import { COLLECTIONS_NAVIGATION_QUERY } from './graphql/navigation';

export interface MenuItemNode {
  id: string;
  title: string;
  url: string;
  items?: MenuItemNode[];
}

export interface NavigationCollectionNode {
  id: string;
  title: string;
  handle: string;
  isRoot?: {
    value: string;
  } | null;
  subCollections?: {
    references: {
      nodes: NavigationCollectionNode[];
    };
  } | null;
}

interface GetNavigationCollectionsResult {
  collections: {
    nodes: NavigationCollectionNode[];
  };
}

export class NavigationService {
  private storefront: Storefront;

  constructor(storefront: Storefront) {
    this.storefront = storefront;
  }

  /**
   * Fetches collections from Shopify Storefront API and builds a structured navigation tree.
   */
  async getNavigationTree(): Promise<MenuItemNode[] | null> {
    try {
      // Query storefront API with cache-long policy (highly performant edge caching)
      const data = await this.storefront.query<GetNavigationCollectionsResult>(
        COLLECTIONS_NAVIGATION_QUERY,
        {
          cache: this.storefront.CacheLong(),
        }
      );

      if (!data || !data.collections || !data.collections.nodes) {
        console.warn('NavigationService: No collections returned from Storefront API.');
        return null;
      }

      const allCollections = data.collections.nodes;
      console.log('NavigationService Loaded Collections:', JSON.stringify(allCollections, null, 2));
      return this.buildTree(allCollections);
    } catch (error) {
      console.error('NavigationService Error fetching collections navigation:', error);
      return null;
    }
  }

  /**
   * Transforms nested Shopify Collections into a recursive menu structure.
   * Query already provides nested subCollections, so we just filter for root collections and map.
   */
  private buildTree(collections: NavigationCollectionNode[]): MenuItemNode[] {
    // Filter for root collections only
    const rootCollections = collections.filter(
      (col) => col.isRoot?.value === 'true'
    );

    if (rootCollections.length === 0) {
      console.warn('NavigationService: No root collections found with isRoot=true metafield.');
      return [];
    }

    // Recursively convert collection to menu node
    const collectionToMenuNode = (col: NavigationCollectionNode, depth: number = 1): MenuItemNode => {
      const childNodes: MenuItemNode[] = [];

      // Limit depth to 3 tiers to match CSS dropdown requirements
      if (depth < 3 && col.subCollections?.references?.nodes) {
        col.subCollections.references.nodes.forEach((subCol) => {
          childNodes.push(collectionToMenuNode(subCol, depth + 1));
        });
      }

      return {
        id: col.id,
        title: col.title,
        url: `/collections/${col.handle}`,
        items: childNodes,
      };
    };

    // Build and return the tree
    return rootCollections.map((col) => collectionToMenuNode(col));
  }
}
