export const SHOP_BY_SECTIONS_QUERY = `#graphql
  query ShopBySections {
    shopByRecipient: metaobject(handle: {handle: "shop-by-recipient", type: "shop_by_section"}) {
      title: field(key: "title") { value }
      subtitle: field(key: "subtitle") { value }
      background_color: field(key: "background_color") { value }
      image_style: field(key: "image_style") { value }
      card_style: field(key: "card_style") { value }
      columns: field(key: "columns") { value }
      collections: field(key: "collections") {
        references(first: 20) {
          nodes {
            ... on Collection {
              title
              handle
              image { url altText }
            }
          }
        }
      }
    }
    shopByProduct: metaobject(handle: {handle: "shop-by-product", type: "shop_by_section"}) {
      title: field(key: "title") { value }
      subtitle: field(key: "subtitle") { value }
      background_color: field(key: "background_color") { value }
      image_style: field(key: "image_style") { value }
      card_style: field(key: "card_style") { value }
      columns: field(key: "columns") { value }
      collections: field(key: "collections") {
        references(first: 20) {
          nodes {
            ... on Collection {
              title
              handle
              image { url altText }
            }
          }
        }
      }
    }
  }
` as const;
