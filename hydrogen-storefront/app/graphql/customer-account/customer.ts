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

export const CUSTOMER_ORDER_DETAIL_QUERY = `#graphql
  query CustomerOrderDetail($orderId: ID!) {
    order(id: $orderId) {
      id
      name
      processedAt
      financialStatus
      fulfillments(first: 1) {
        nodes {
          status
          trackingInformation {
            company
            number
            url
          }
        }
      }
      lineItems(first: 100) {
        nodes {
          id
          title
          quantity
          variantTitle
          image {
            url
            altText
            width
            height
          }
          price {
            amount
            currencyCode
          }
          discountedTotalPrice {
            amount
            currencyCode
          }
          variant {
            id
            product {
              handle
            }
          }
        }
      }
      totalPrice {
        amount
        currencyCode
      }
      subtotal {
        amount
        currencyCode
      }
      totalTax {
        amount
        currencyCode
      }
      shippingAddress {
        firstName
        lastName
        address1
        address2
        city
        zoneCode
        territoryCode
        zip
        phoneNumber
      }
    }
  }
` as const;

export const CREATE_ADDRESS_MUTATION = `#graphql
  mutation CreateAddress($address: CustomerAddressInput!) {
    customerAddressCreate(address: $address) {
      customerAddress {
        id
        ...CustomerAddress
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CUSTOMER_ADDRESS_FRAGMENT}
` as const;

export const UPDATE_ADDRESS_MUTATION = `#graphql
  mutation UpdateAddress($addressId: ID!, $address: CustomerAddressInput!, $defaultAddress: Boolean) {
    customerAddressUpdate(addressId: $addressId, address: $address, defaultAddress: $defaultAddress) {
      customerAddress {
        id
        ...CustomerAddress
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CUSTOMER_ADDRESS_FRAGMENT}
` as const;

export const DELETE_ADDRESS_MUTATION = `#graphql
  mutation DeleteAddress($addressId: ID!) {
    customerAddressDelete(addressId: $addressId) {
      deletedAddressId
      userErrors {
        field
        message
      }
    }
  }
` as const;

export const SET_DEFAULT_ADDRESS_MUTATION = `#graphql
  mutation SetDefaultAddress($addressId: ID!) {
    customerDefaultAddressUpdate(addressId: $addressId) {
      customer {
        id
        defaultAddress {
          id
        }
      }
      userErrors {
        field
        message
      }
    }
  }
` as const;
