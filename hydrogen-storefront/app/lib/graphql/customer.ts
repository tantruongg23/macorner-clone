// Storefront API customer account queries/mutations (classic email + password
// customer accounts — matches macorner.co's live /account/login & /account/register UI).

const MAILING_ADDRESS_FRAGMENT = `#graphql
  fragment MailingAddress on MailingAddress {
    id
    firstName
    lastName
    company
    address1
    address2
    city
    province
    provinceCode
    zip
    country
    countryCodeV2
    phone
    formatted
  }
` as const;

export const CUSTOMER_LOGIN_MUTATION = `#graphql
  mutation CustomerLogin($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
` as const;

export const CUSTOMER_REGISTER_MUTATION = `#graphql
  mutation CustomerRegister($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        firstName
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
` as const;

export const CUSTOMER_RECOVER_MUTATION = `#graphql
  mutation CustomerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        field
        message
        code
      }
    }
  }
` as const;

export const CUSTOMER_QUERY = `#graphql
  query CustomerDetails($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      defaultAddress {
        ...MailingAddress
      }
      addresses(first: 10) {
        nodes {
          ...MailingAddress
        }
      }
    }
  }
  ${MAILING_ADDRESS_FRAGMENT}
` as const;

export const CUSTOMER_ORDERS_QUERY = `#graphql
  query CustomerOrders(
    $customerAccessToken: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
        sortKey: PROCESSED_AT
        reverse: true
      ) {
        nodes {
          id
          name
          orderNumber
          processedAt
          financialStatus
          fulfillmentStatus
          currentTotalPrice {
            amount
            currencyCode
          }
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
      }
    }
  }
` as const;

export const CUSTOMER_ORDER_QUERY = `#graphql
  query CustomerOrder($id: ID!) {
    order: node(id: $id) {
      ... on Order {
        id
        name
        orderNumber
        processedAt
        financialStatus
        fulfillmentStatus
        statusUrl
        currentTotalPrice {
          amount
          currencyCode
        }
        subtotalPrice {
          amount
          currencyCode
        }
        totalTax {
          amount
          currencyCode
        }
        shippingAddress {
          ...MailingAddress
        }
        successfulFulfillments(first: 10) {
          trackingInfo {
            number
            url
          }
        }
        lineItems(first: 100) {
          nodes {
            title
            quantity
            discountedTotalPrice {
              amount
              currencyCode
            }
            originalTotalPrice {
              amount
              currencyCode
            }
            variant {
              id
              title
              image {
                url
                altText
                width
                height
              }
              product {
                handle
              }
            }
          }
        }
      }
    }
  }
  ${MAILING_ADDRESS_FRAGMENT}
` as const;

export const CUSTOMER_ADDRESS_CREATE_MUTATION = `#graphql
  mutation CustomerAddressCreate(
    $customerAccessToken: String!
    $address: MailingAddressInput!
  ) {
    customerAddressCreate(
      customerAccessToken: $customerAccessToken
      address: $address
    ) {
      customerAddress {
        ...MailingAddress
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
  ${MAILING_ADDRESS_FRAGMENT}
` as const;

export const CUSTOMER_ADDRESS_UPDATE_MUTATION = `#graphql
  mutation CustomerAddressUpdate(
    $customerAccessToken: String!
    $id: ID!
    $address: MailingAddressInput!
  ) {
    customerAddressUpdate(
      customerAccessToken: $customerAccessToken
      id: $id
      address: $address
    ) {
      customerAddress {
        ...MailingAddress
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
  ${MAILING_ADDRESS_FRAGMENT}
` as const;

export const CUSTOMER_ADDRESS_DELETE_MUTATION = `#graphql
  mutation CustomerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      deletedCustomerAddressId
      customerUserErrors {
        field
        message
        code
      }
    }
  }
` as const;

export const CUSTOMER_DEFAULT_ADDRESS_UPDATE_MUTATION = `#graphql
  mutation CustomerDefaultAddressUpdate(
    $customerAccessToken: String!
    $addressId: ID!
  ) {
    customerDefaultAddressUpdate(
      customerAccessToken: $customerAccessToken
      addressId: $addressId
    ) {
      customer {
        id
        defaultAddress {
          id
        }
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
` as const;
