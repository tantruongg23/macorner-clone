export const HERO_BANNER_QUERY = `#graphql
  query GetHeroBannerContent {
    metaobjects(type: "main_content", first: 1) {
      nodes {
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
` as const;
