export const HOME_CONTENT_QUERY = `#graphql
  query GetHomeContent(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobjects(type: "home_content", first: 10) {
      nodes {
        id
        title: field(key: "title") { value }
        description: field(key: "description") { value }
        actionLabel: field(key: "action_label") { value }
        actionUrl: field(key: "action_url") { value }
        actionResource: field(key: "action_resource") {
          value
          reference {
            __typename
            ... on Product {
              handle
            }
            ... on Collection {
              handle
            }
            ... on Metaobject {
              type
              fields {
                key
                value
                type
                reference {
                  __typename
                  ... on Product {
                    handle
                  }
                  ... on Collection {
                    handle
                  }
                }
              }
            }
          }
        }
        image: field(key: "image") {
          reference {
            ... on MediaImage {
              image {
                url
                altText
              }
            }
          }
        }
        collections: field(key: "collections") {
          references(first: 10) {
            nodes {
              ... on Collection {
                title
                handle
                products(first: 4) {
                  nodes {
                    id
                    title
                    handle
                    featuredImage {
                      url
                      altText
                    }
                    priceRange {
                      minVariantPrice {
                        amount
                        currencyCode
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
