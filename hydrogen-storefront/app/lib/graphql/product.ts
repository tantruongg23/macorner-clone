export const RELATED_PRODUCTS_QUERY = `#graphql
  query GetRelatedProducts(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: 5) {
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
      personalizationField: metafield(namespace: "custom", key: "personalization") {
        value
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
