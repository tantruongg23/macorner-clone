/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as CustomerAccountAPI from '@shopify/hydrogen/customer-account-api-types';

export type CustomerAddressFragment = Pick<
  CustomerAccountAPI.CustomerAddress,
  | 'id'
  | 'formatted'
  | 'firstName'
  | 'lastName'
  | 'company'
  | 'address1'
  | 'address2'
  | 'territoryCode'
  | 'zoneCode'
  | 'city'
  | 'zip'
  | 'phoneNumber'
>;

export type CustomerFragment = Pick<
  CustomerAccountAPI.Customer,
  'id' | 'firstName' | 'lastName'
> & {
  emailAddress?: CustomerAccountAPI.Maybe<
    Pick<CustomerAccountAPI.CustomerEmailAddress, 'emailAddress'>
  >;
  defaultAddress?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.CustomerAddress,
      | 'id'
      | 'formatted'
      | 'firstName'
      | 'lastName'
      | 'company'
      | 'address1'
      | 'address2'
      | 'territoryCode'
      | 'zoneCode'
      | 'city'
      | 'zip'
      | 'phoneNumber'
    >
  >;
  addresses: {
    nodes: Array<
      Pick<
        CustomerAccountAPI.CustomerAddress,
        | 'id'
        | 'formatted'
        | 'firstName'
        | 'lastName'
        | 'company'
        | 'address1'
        | 'address2'
        | 'territoryCode'
        | 'zoneCode'
        | 'city'
        | 'zip'
        | 'phoneNumber'
      >
    >;
  };
};

export type CustomerDetailsQueryVariables = CustomerAccountAPI.Exact<{
  [key: string]: never;
}>;

export type CustomerDetailsQuery = {
  customer: Pick<
    CustomerAccountAPI.Customer,
    'id' | 'firstName' | 'lastName'
  > & {
    emailAddress?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.CustomerEmailAddress, 'emailAddress'>
    >;
    defaultAddress?: CustomerAccountAPI.Maybe<
      Pick<
        CustomerAccountAPI.CustomerAddress,
        | 'id'
        | 'formatted'
        | 'firstName'
        | 'lastName'
        | 'company'
        | 'address1'
        | 'address2'
        | 'territoryCode'
        | 'zoneCode'
        | 'city'
        | 'zip'
        | 'phoneNumber'
      >
    >;
    addresses: {
      nodes: Array<
        Pick<
          CustomerAccountAPI.CustomerAddress,
          | 'id'
          | 'formatted'
          | 'firstName'
          | 'lastName'
          | 'company'
          | 'address1'
          | 'address2'
          | 'territoryCode'
          | 'zoneCode'
          | 'city'
          | 'zip'
          | 'phoneNumber'
        >
      >;
    };
  };
};

export type OrderItemFragment = Pick<
  CustomerAccountAPI.Order,
  'financialStatus' | 'id' | 'number' | 'processedAt'
> & {
  totalPrice: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
  fulfillments: {nodes: Array<Pick<CustomerAccountAPI.Fulfillment, 'status'>>};
};

export type CustomerOrdersQueryVariables = CustomerAccountAPI.Exact<{
  first?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['Int']['input']
  >;
  last?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['Int']['input']
  >;
  startCursor?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['String']['input']
  >;
  endCursor?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['String']['input']
  >;
}>;

export type CustomerOrdersQuery = {
  customer: {
    orders: {
      nodes: Array<
        Pick<
          CustomerAccountAPI.Order,
          'financialStatus' | 'id' | 'number' | 'processedAt'
        > & {
          totalPrice: Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          fulfillments: {
            nodes: Array<Pick<CustomerAccountAPI.Fulfillment, 'status'>>;
          };
        }
      >;
      pageInfo: Pick<
        CustomerAccountAPI.PageInfo,
        'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
      >;
    };
  };
};

export type CustomerOrderDetailQueryVariables = CustomerAccountAPI.Exact<{
  orderId: CustomerAccountAPI.Scalars['ID']['input'];
}>;

export type CustomerOrderDetailQuery = {
  order?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.Order,
      'id' | 'name' | 'processedAt' | 'financialStatus'
    > & {
      fulfillments: {
        nodes: Array<
          Pick<CustomerAccountAPI.Fulfillment, 'status'> & {
            trackingInformation: Array<
              Pick<
                CustomerAccountAPI.TrackingInformation,
                'company' | 'number' | 'url'
              >
            >;
          }
        >;
      };
      lineItems: {
        nodes: Array<
          Pick<
            CustomerAccountAPI.LineItem,
            | 'id'
            | 'title'
            | 'quantity'
            | 'variantTitle'
            | 'variantId'
            | 'productId'
          > & {
            image?: CustomerAccountAPI.Maybe<
              Pick<
                CustomerAccountAPI.Image,
                'url' | 'altText' | 'width' | 'height'
              >
            >;
            price?: CustomerAccountAPI.Maybe<
              Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            totalPriceWithDiscounts?: CustomerAccountAPI.Maybe<
              Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
          }
        >;
      };
      totalPrice: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
      subtotal?: CustomerAccountAPI.Maybe<
        Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      totalTax?: CustomerAccountAPI.Maybe<
        Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      shippingAddress?: CustomerAccountAPI.Maybe<
        Pick<
          CustomerAccountAPI.CustomerAddress,
          | 'firstName'
          | 'lastName'
          | 'address1'
          | 'address2'
          | 'city'
          | 'zoneCode'
          | 'territoryCode'
          | 'zip'
          | 'phoneNumber'
        >
      >;
    }
  >;
};

export type CreateAddressMutationVariables = CustomerAccountAPI.Exact<{
  address: CustomerAccountAPI.CustomerAddressInput;
}>;

export type CreateAddressMutation = {
  customerAddressCreate?: CustomerAccountAPI.Maybe<{
    customerAddress?: CustomerAccountAPI.Maybe<
      Pick<
        CustomerAccountAPI.CustomerAddress,
        | 'id'
        | 'formatted'
        | 'firstName'
        | 'lastName'
        | 'company'
        | 'address1'
        | 'address2'
        | 'territoryCode'
        | 'zoneCode'
        | 'city'
        | 'zip'
        | 'phoneNumber'
      >
    >;
    userErrors: Array<
      Pick<
        CustomerAccountAPI.UserErrorsCustomerAddressUserErrors,
        'field' | 'message'
      >
    >;
  }>;
};

export type UpdateAddressMutationVariables = CustomerAccountAPI.Exact<{
  addressId: CustomerAccountAPI.Scalars['ID']['input'];
  address: CustomerAccountAPI.CustomerAddressInput;
  defaultAddress?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['Boolean']['input']
  >;
}>;

export type UpdateAddressMutation = {
  customerAddressUpdate?: CustomerAccountAPI.Maybe<{
    customerAddress?: CustomerAccountAPI.Maybe<
      Pick<
        CustomerAccountAPI.CustomerAddress,
        | 'id'
        | 'formatted'
        | 'firstName'
        | 'lastName'
        | 'company'
        | 'address1'
        | 'address2'
        | 'territoryCode'
        | 'zoneCode'
        | 'city'
        | 'zip'
        | 'phoneNumber'
      >
    >;
    userErrors: Array<
      Pick<
        CustomerAccountAPI.UserErrorsCustomerAddressUserErrors,
        'field' | 'message'
      >
    >;
  }>;
};

export type DeleteAddressMutationVariables = CustomerAccountAPI.Exact<{
  addressId: CustomerAccountAPI.Scalars['ID']['input'];
}>;

export type DeleteAddressMutation = {
  customerAddressDelete?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.CustomerAddressDeletePayload,
      'deletedAddressId'
    > & {
      userErrors: Array<
        Pick<
          CustomerAccountAPI.UserErrorsCustomerAddressUserErrors,
          'field' | 'message'
        >
      >;
    }
  >;
};

export type SetDefaultAddressMutationVariables = CustomerAccountAPI.Exact<{
  addressId: CustomerAccountAPI.Scalars['ID']['input'];
}>;

export type SetDefaultAddressMutation = {
  customerAddressUpdate?: CustomerAccountAPI.Maybe<{
    customerAddress?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.CustomerAddress, 'id'>
    >;
    userErrors: Array<
      Pick<
        CustomerAccountAPI.UserErrorsCustomerAddressUserErrors,
        'field' | 'message'
      >
    >;
  }>;
};

interface GeneratedQueryTypes {
  '#graphql\n  query CustomerDetails {\n    customer {\n      ...Customer\n    }\n  }\n  #graphql\n  fragment Customer on Customer {\n    id\n    firstName\n    lastName\n    emailAddress {\n      emailAddress\n    }\n    defaultAddress {\n      ...CustomerAddress\n    }\n    addresses(first: 6) {\n      nodes {\n        ...CustomerAddress\n      }\n    }\n  }\n  #graphql\n  fragment CustomerAddress on CustomerAddress {\n    id\n    formatted\n    firstName\n    lastName\n    company\n    address1\n    address2\n    territoryCode\n    zoneCode\n    city\n    zip\n    phoneNumber\n  }\n\n\n': {
    return: CustomerDetailsQuery;
    variables: CustomerDetailsQueryVariables;
  };
  '#graphql\n  query CustomerOrders($first: Int, $last: Int, $startCursor: String, $endCursor: String) {\n    customer {\n      orders(first: $first, last: $last, before: $startCursor, after: $endCursor, sortKey: PROCESSED_AT, reverse: true) {\n        nodes {\n          ...OrderItem\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n      }\n    }\n  }\n  #graphql\n  fragment OrderItem on Order {\n    totalPrice {\n      amount\n      currencyCode\n    }\n    financialStatus\n    fulfillments(first: 1) {\n      nodes {\n        status\n      }\n    }\n    id\n    number\n    processedAt\n  }\n\n': {
    return: CustomerOrdersQuery;
    variables: CustomerOrdersQueryVariables;
  };
  '#graphql\n  query CustomerOrderDetail($orderId: ID!) {\n    order(id: $orderId) {\n      id\n      name\n      processedAt\n      financialStatus\n      fulfillments(first: 1) {\n        nodes {\n          status\n          trackingInformation {\n            company\n            number\n            url\n          }\n        }\n      }\n      lineItems(first: 100) {\n        nodes {\n          id\n          title\n          quantity\n          variantTitle\n          variantId\n          productId\n          image {\n            url\n            altText\n            width\n            height\n          }\n          price {\n            amount\n            currencyCode\n          }\n          totalPriceWithDiscounts {\n            amount\n            currencyCode\n          }\n        }\n      }\n      totalPrice {\n        amount\n        currencyCode\n      }\n      subtotal {\n        amount\n        currencyCode\n      }\n      totalTax {\n        amount\n        currencyCode\n      }\n      shippingAddress {\n        firstName\n        lastName\n        address1\n        address2\n        city\n        zoneCode\n        territoryCode\n        zip\n        phoneNumber\n      }\n    }\n  }\n': {
    return: CustomerOrderDetailQuery;
    variables: CustomerOrderDetailQueryVariables;
  };
}

interface GeneratedMutationTypes {
  '#graphql\n  mutation CreateAddress($address: CustomerAddressInput!) {\n    customerAddressCreate(address: $address) {\n      customerAddress {\n        id\n        ...CustomerAddress\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n  #graphql\n  fragment CustomerAddress on CustomerAddress {\n    id\n    formatted\n    firstName\n    lastName\n    company\n    address1\n    address2\n    territoryCode\n    zoneCode\n    city\n    zip\n    phoneNumber\n  }\n\n': {
    return: CreateAddressMutation;
    variables: CreateAddressMutationVariables;
  };
  '#graphql\n  mutation UpdateAddress($addressId: ID!, $address: CustomerAddressInput!, $defaultAddress: Boolean) {\n    customerAddressUpdate(addressId: $addressId, address: $address, defaultAddress: $defaultAddress) {\n      customerAddress {\n        id\n        ...CustomerAddress\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n  #graphql\n  fragment CustomerAddress on CustomerAddress {\n    id\n    formatted\n    firstName\n    lastName\n    company\n    address1\n    address2\n    territoryCode\n    zoneCode\n    city\n    zip\n    phoneNumber\n  }\n\n': {
    return: UpdateAddressMutation;
    variables: UpdateAddressMutationVariables;
  };
  '#graphql\n  mutation DeleteAddress($addressId: ID!) {\n    customerAddressDelete(addressId: $addressId) {\n      deletedAddressId\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n': {
    return: DeleteAddressMutation;
    variables: DeleteAddressMutationVariables;
  };
  '#graphql\n  mutation SetDefaultAddress($addressId: ID!) {\n    customerAddressUpdate(addressId: $addressId, defaultAddress: true) {\n      customerAddress {\n        id\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n': {
    return: SetDefaultAddressMutation;
    variables: SetDefaultAddressMutationVariables;
  };
}

declare module '@shopify/hydrogen' {
  interface CustomerAccountQueries extends GeneratedQueryTypes {}
  interface CustomerAccountMutations extends GeneratedMutationTypes {}
}
