export const COLLECTIONS_NAVIGATION_QUERY = `#graphql
  query GetNavigationCollections {
    collections(first: 250) {
      nodes {
        id
        title
        handle
        isRoot: metafield(namespace: "custom", key: "is_root") {
          value
        }
        subCollections: metafield(namespace: "custom", key: "sub_collections") {
          references(first: 50) {
            nodes {
              ... on Collection {
                id
                title
                handle
                subCollections: metafield(namespace: "custom", key: "sub_collections") {
                  references(first: 50) {
                    nodes {
                      ... on Collection {
                        id
                        title
                        handle
                        subCollections: metafield(namespace: "custom", key: "sub_collections") {
                          references(first: 50) {
                            nodes {
                              ... on Collection {
                                id
                                title
                                handle
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
` as const;
