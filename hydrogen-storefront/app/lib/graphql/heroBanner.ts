export const HERO_BANNER_QUERY = `#graphql
  query GetHeroBannerContent {
    metaobjects(type: "main_content", first: 2) {
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

export const HERO_CAROUSEL_QUERY = `#graphql
  query GetHeroCarouselSlides {
    metaobjects(type: "hero_banner", first: 5) {
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
