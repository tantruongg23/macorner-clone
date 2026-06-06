export const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode
    $country: CountryCode
    $handle: String!
  ) @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      title
      handle
      body
      bodySummary
      seo {
        description
        title
      }
    }
  }
` as const;
