export const CATEGORY_ICONS_QUERY = `#graphql
  query GetCategoryIconCollections {
    collections(first: 50) {
      nodes {
        id
        title
        handle
        image {
          url
          altText
          width
          height
        }
        isMainCollection: metafield(namespace: "custom", key: "is_main_collection") {
          value
        }
      }
    }
  }
` as const;
