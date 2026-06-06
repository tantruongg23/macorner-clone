export const PRODUCT_RECOMMENDATIONS_QUERY = `#graphql
  query GetProductRecommendations(
    $productId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId, intent: RELATED) {
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
` as const;

export const PRODUCT_QUERY = `#graphql
  query GetProduct(
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      vendor
      productType
      tags
      seo {
        title
        description
      }
      personalizationField: metafield(namespace: "custom", key: "personalization") {
        value
      }
      collections(first: 6) {
        nodes {
          title
          handle
          image {
            url
            altText
          }
        }
      }
      images(first: 20) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }
      options {
        id
        name
        optionValues {
          name
        }
      }
      selectedVariant: variantBySelectedOptions(
        selectedOptions: $selectedOptions
        ignoreUnknownOptions: true
        caseInsensitiveMatch: true
      ) {
        ...ProductVariantFields
      }
      variants(first: 250) {
        nodes {
          ...ProductVariantFields
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
  fragment ProductVariantFields on ProductVariant {
    id
    availableForSale
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    selectedOptions {
      name
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
  }
` as const;
