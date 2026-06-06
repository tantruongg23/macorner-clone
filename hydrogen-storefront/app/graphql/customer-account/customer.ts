// Customer Account API queries (validated against the Customer Account API
// schema — these MUST live under app/graphql/customer-account/ per .graphqlrc.ts).

const CUSTOMER_ADDRESS_FRAGMENT = `#graphql
  fragment CustomerAddress on CustomerAddress {
    id
    formatted
    firstName
    lastName
    company
    address1
    address2
    territoryCode
    zoneCode
    city
    zip
    phoneNumber
  }
` as const;

const CUSTOMER_FRAGMENT = `#graphql
  fragment Customer on Customer {
    id
    firstName
    lastName
    emailAddress {
      emailAddress
    }
    defaultAddress {
      ...CustomerAddress
    }
    addresses(first: 6) {
      nodes {
        ...CustomerAddress
      }
    }
  }
  ${CUSTOMER_ADDRESS_FRAGMENT}
` as const;

export const CUSTOMER_DETAILS_QUERY = `#graphql
  query CustomerDetails {
    customer {
      ...Customer
    }
  }
  ${CUSTOMER_FRAGMENT}
` as const;

const ORDER_ITEM_FRAGMENT = `#graphql
  fragment OrderItem on Order {
    totalPrice {
      amount
      currencyCode
    }
    financialStatus
    fulfillments(first: 1) {
      nodes {
        status
      }
    }
    id
    number
    processedAt
  }
` as const;

export const CUSTOMER_ORDERS_QUERY = `#graphql
  query CustomerOrders($first: Int, $last: Int, $startCursor: String, $endCursor: String) {
    customer {
      orders(first: $first, last: $last, before: $startCursor, after: $endCursor, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          ...OrderItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
  ${ORDER_ITEM_FRAGMENT}
` as const;
