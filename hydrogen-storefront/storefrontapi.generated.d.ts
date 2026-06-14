/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

export type MoneyFragment = Pick<
  StorefrontAPI.MoneyV2,
  'currencyCode' | 'amount'
>;

export type CartLineFragment = Pick<
  StorefrontAPI.CartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
  parentRelationship?: StorefrontAPI.Maybe<{
    parent: Pick<StorefrontAPI.CartLine, 'id'>;
  }>;
};

export type CartLineComponentFragment = Pick<
  StorefrontAPI.ComponentizableCartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
  lineComponents: Array<
    Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
      attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
      cost: {
        totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
        amountPerQuantity: Pick<
          StorefrontAPI.MoneyV2,
          'currencyCode' | 'amount'
        >;
        compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
        >;
      };
      merchandise: Pick<
        StorefrontAPI.ProductVariant,
        'id' | 'availableForSale' | 'requiresShipping' | 'title'
      > & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        product: Pick<
          StorefrontAPI.Product,
          'handle' | 'title' | 'id' | 'vendor'
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
      };
      parentRelationship?: StorefrontAPI.Maybe<{
        parent: Pick<StorefrontAPI.CartLine, 'id'>;
      }>;
    }
  >;
};

export type CartApiQueryFragment = Pick<
  StorefrontAPI.Cart,
  'updatedAt' | 'id' | 'checkoutUrl' | 'totalQuantity' | 'note'
> & {
  appliedGiftCards: Array<
    Pick<StorefrontAPI.AppliedGiftCard, 'id' | 'lastCharacters'> & {
      amountUsed: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    }
  >;
  buyerIdentity: Pick<
    StorefrontAPI.CartBuyerIdentity,
    'countryCode' | 'email' | 'phone'
  > & {
    customer?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.Customer,
        'id' | 'email' | 'firstName' | 'lastName' | 'displayName'
      >
    >;
  };
  lines: {
    nodes: Array<
      | (Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            amountPerQuantity: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'requiresShipping' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'title' | 'id' | 'vendor'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
          parentRelationship?: StorefrontAPI.Maybe<{
            parent: Pick<StorefrontAPI.CartLine, 'id'>;
          }>;
        })
      | (Pick<StorefrontAPI.ComponentizableCartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            amountPerQuantity: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'requiresShipping' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'title' | 'id' | 'vendor'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
          lineComponents: Array<
            Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
              attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
              cost: {
                totalAmount: Pick<
                  StorefrontAPI.MoneyV2,
                  'currencyCode' | 'amount'
                >;
                amountPerQuantity: Pick<
                  StorefrontAPI.MoneyV2,
                  'currencyCode' | 'amount'
                >;
                compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
                >;
              };
              merchandise: Pick<
                StorefrontAPI.ProductVariant,
                'id' | 'availableForSale' | 'requiresShipping' | 'title'
              > & {
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                product: Pick<
                  StorefrontAPI.Product,
                  'handle' | 'title' | 'id' | 'vendor'
                >;
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
              };
              parentRelationship?: StorefrontAPI.Maybe<{
                parent: Pick<StorefrontAPI.CartLine, 'id'>;
              }>;
            }
          >;
        })
    >;
  };
  cost: {
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalDutyAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    totalTaxAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  discountCodes: Array<
    Pick<StorefrontAPI.CartDiscountCode, 'code' | 'applicable'>
  >;
};

export type GetCategoryIconCollectionsQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type GetCategoryIconCollectionsQuery = {
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'> & {
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
        isMainCollection?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'value'>
        >;
      }
    >;
  };
};

export type GetCollectionProductsQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  first: StorefrontAPI.Scalars['Int']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type GetCollectionProductsQuery = {
  collection?: StorefrontAPI.Maybe<{
    products: {
      nodes: Array<
        Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'> & {
          featuredImage?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText'>
          >;
          priceRange: {
            minVariantPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
          };
        }
      >;
    };
  }>;
};

export type MailingAddressFragment = Pick<
  StorefrontAPI.MailingAddress,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'company'
  | 'address1'
  | 'address2'
  | 'city'
  | 'province'
  | 'provinceCode'
  | 'zip'
  | 'country'
  | 'countryCodeV2'
  | 'phone'
  | 'formatted'
>;

export type CustomerLoginMutationVariables = StorefrontAPI.Exact<{
  input: StorefrontAPI.CustomerAccessTokenCreateInput;
}>;

export type CustomerLoginMutation = {
  customerAccessTokenCreate?: StorefrontAPI.Maybe<{
    customerAccessToken?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.CustomerAccessToken, 'accessToken' | 'expiresAt'>
    >;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'field' | 'message' | 'code'>
    >;
  }>;
};

export type CustomerRegisterMutationVariables = StorefrontAPI.Exact<{
  input: StorefrontAPI.CustomerCreateInput;
}>;

export type CustomerRegisterMutation = {
  customerCreate?: StorefrontAPI.Maybe<{
    customer?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Customer, 'id' | 'firstName'>
    >;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'field' | 'message' | 'code'>
    >;
  }>;
};

export type CustomerRecoverMutationVariables = StorefrontAPI.Exact<{
  email: StorefrontAPI.Scalars['String']['input'];
}>;

export type CustomerRecoverMutation = {
  customerRecover?: StorefrontAPI.Maybe<{
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'field' | 'message' | 'code'>
    >;
  }>;
};

export type CustomerDetailsQueryVariables = StorefrontAPI.Exact<{
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
}>;

export type CustomerDetailsQuery = {
  customer?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Customer,
      'id' | 'firstName' | 'lastName' | 'email' | 'phone'
    > & {
      defaultAddress?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.MailingAddress,
          | 'id'
          | 'firstName'
          | 'lastName'
          | 'company'
          | 'address1'
          | 'address2'
          | 'city'
          | 'province'
          | 'provinceCode'
          | 'zip'
          | 'country'
          | 'countryCodeV2'
          | 'phone'
          | 'formatted'
        >
      >;
      addresses: {
        nodes: Array<
          Pick<
            StorefrontAPI.MailingAddress,
            | 'id'
            | 'firstName'
            | 'lastName'
            | 'company'
            | 'address1'
            | 'address2'
            | 'city'
            | 'province'
            | 'provinceCode'
            | 'zip'
            | 'country'
            | 'countryCodeV2'
            | 'phone'
            | 'formatted'
          >
        >;
      };
    }
  >;
};

export type CustomerOrdersQueryVariables = StorefrontAPI.Exact<{
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type CustomerOrdersQuery = {
  customer?: StorefrontAPI.Maybe<{
    orders: {
      nodes: Array<
        Pick<
          StorefrontAPI.Order,
          | 'id'
          | 'name'
          | 'orderNumber'
          | 'processedAt'
          | 'financialStatus'
          | 'fulfillmentStatus'
        > & {
          currentTotalPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        }
      >;
      pageInfo: Pick<
        StorefrontAPI.PageInfo,
        'hasPreviousPage' | 'hasNextPage' | 'startCursor' | 'endCursor'
      >;
    };
  }>;
};

export type CustomerOrderQueryVariables = StorefrontAPI.Exact<{
  id: StorefrontAPI.Scalars['ID']['input'];
}>;

export type CustomerOrderQuery = {
  order?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Order,
      | 'id'
      | 'name'
      | 'orderNumber'
      | 'processedAt'
      | 'financialStatus'
      | 'fulfillmentStatus'
      | 'statusUrl'
    > & {
      currentTotalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      subtotalPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      totalTax?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      shippingAddress?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.MailingAddress,
          | 'id'
          | 'firstName'
          | 'lastName'
          | 'company'
          | 'address1'
          | 'address2'
          | 'city'
          | 'province'
          | 'provinceCode'
          | 'zip'
          | 'country'
          | 'countryCodeV2'
          | 'phone'
          | 'formatted'
        >
      >;
      successfulFulfillments?: StorefrontAPI.Maybe<
        Array<{
          trackingInfo: Array<
            Pick<StorefrontAPI.FulfillmentTrackingInfo, 'number' | 'url'>
          >;
        }>
      >;
      lineItems: {
        nodes: Array<
          Pick<StorefrontAPI.OrderLineItem, 'title' | 'quantity'> & {
            discountedTotalPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            originalTotalPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            variant?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
                product: Pick<StorefrontAPI.Product, 'handle'>;
              }
            >;
          }
        >;
      };
    }
  >;
};

export type CustomerAddressCreateMutationVariables = StorefrontAPI.Exact<{
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
  address: StorefrontAPI.MailingAddressInput;
}>;

export type CustomerAddressCreateMutation = {
  customerAddressCreate?: StorefrontAPI.Maybe<{
    customerAddress?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.MailingAddress,
        | 'id'
        | 'firstName'
        | 'lastName'
        | 'company'
        | 'address1'
        | 'address2'
        | 'city'
        | 'province'
        | 'provinceCode'
        | 'zip'
        | 'country'
        | 'countryCodeV2'
        | 'phone'
        | 'formatted'
      >
    >;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'field' | 'message' | 'code'>
    >;
  }>;
};

export type CustomerAddressUpdateMutationVariables = StorefrontAPI.Exact<{
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
  id: StorefrontAPI.Scalars['ID']['input'];
  address: StorefrontAPI.MailingAddressInput;
}>;

export type CustomerAddressUpdateMutation = {
  customerAddressUpdate?: StorefrontAPI.Maybe<{
    customerAddress?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.MailingAddress,
        | 'id'
        | 'firstName'
        | 'lastName'
        | 'company'
        | 'address1'
        | 'address2'
        | 'city'
        | 'province'
        | 'provinceCode'
        | 'zip'
        | 'country'
        | 'countryCodeV2'
        | 'phone'
        | 'formatted'
      >
    >;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'field' | 'message' | 'code'>
    >;
  }>;
};

export type CustomerAddressDeleteMutationVariables = StorefrontAPI.Exact<{
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
  id: StorefrontAPI.Scalars['ID']['input'];
}>;

export type CustomerAddressDeleteMutation = {
  customerAddressDelete?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.CustomerAddressDeletePayload,
      'deletedCustomerAddressId'
    > & {
      customerUserErrors: Array<
        Pick<StorefrontAPI.CustomerUserError, 'field' | 'message' | 'code'>
      >;
    }
  >;
};

export type CustomerDefaultAddressUpdateMutationVariables =
  StorefrontAPI.Exact<{
    customerAccessToken: StorefrontAPI.Scalars['String']['input'];
    addressId: StorefrontAPI.Scalars['ID']['input'];
  }>;

export type CustomerDefaultAddressUpdateMutation = {
  customerDefaultAddressUpdate?: StorefrontAPI.Maybe<{
    customer?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Customer, 'id'> & {
        defaultAddress?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MailingAddress, 'id'>
        >;
      }
    >;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'field' | 'message' | 'code'>
    >;
  }>;
};

export type GetHeroBannerContentQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type GetHeroBannerContentQuery = {
  metaobjects: {
    nodes: Array<{
      fields: Array<
        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
          reference?: StorefrontAPI.Maybe<{
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
          }>;
        }
      >;
    }>;
  };
};

export type GetHeroCarouselSlidesQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type GetHeroCarouselSlidesQuery = {
  metaobjects: {
    nodes: Array<{
      fields: Array<
        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
          reference?: StorefrontAPI.Maybe<{
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
          }>;
        }
      >;
    }>;
  };
};

export type GetHomeContentQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type GetHomeContentQuery = {
  metaobjects: {
    nodes: Array<
      Pick<StorefrontAPI.Metaobject, 'id'> & {
        title?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        description?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        actionLink?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        image?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<{
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText'>
            >;
          }>;
        }>;
        collections?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Collection, 'title' | 'handle'> & {
                products: {
                  nodes: Array<
                    Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'> & {
                      featuredImage?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.Image, 'url' | 'altText'>
                      >;
                      priceRange: {
                        minVariantPrice: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                      };
                    }
                  >;
                };
              }
            >;
          }>;
        }>;
      }
    >;
  };
};

export type MenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type LeafMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ChildMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    >
  >;
};

export type ParentMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    > & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        >
      >;
    }
  >;
};

export type MenuFragment = Pick<StorefrontAPI.Menu, 'id'> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    > & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
};

export type ShopFragment = Pick<
  StorefrontAPI.Shop,
  'id' | 'name' | 'description'
> & {
  primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
  brand?: StorefrontAPI.Maybe<{
    logo?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
    }>;
  }>;
};

export type HeaderQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  headerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HeaderQuery = {
  shop: Pick<StorefrontAPI.Shop, 'id' | 'name' | 'description'> & {
    primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
    brand?: StorefrontAPI.Maybe<{
      logo?: StorefrontAPI.Maybe<{
        image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
      }>;
    }>;
  };
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
};

export type FooterQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  footerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type FooterQuery = {
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
};

export type GetNavigationCollectionsQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type GetNavigationCollectionsQuery = {
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'> & {
        isRoot?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        subCollections?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'> & {
                subCollections?: StorefrontAPI.Maybe<{
                  references?: StorefrontAPI.Maybe<{
                    nodes: Array<
                      Pick<
                        StorefrontAPI.Collection,
                        'id' | 'title' | 'handle'
                      > & {
                        subCollections?: StorefrontAPI.Maybe<{
                          references?: StorefrontAPI.Maybe<{
                            nodes: Array<
                              Pick<
                                StorefrontAPI.Collection,
                                'id' | 'title' | 'handle'
                              >
                            >;
                          }>;
                        }>;
                      }
                    >;
                  }>;
                }>;
              }
            >;
          }>;
        }>;
      }
    >;
  };
};

export type PageQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type PageQuery = {
  page?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Page,
      'id' | 'title' | 'handle' | 'body' | 'bodySummary'
    > & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'description' | 'title'>
      >;
    }
  >;
};

export type GetProductRecommendationsQueryVariables = StorefrontAPI.Exact<{
  productId: StorefrontAPI.Scalars['ID']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type GetProductRecommendationsQuery = {
  productRecommendations?: StorefrontAPI.Maybe<
    Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
      }
    >
  >;
};

export type GetProductQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  selectedOptions:
    | Array<StorefrontAPI.SelectedOptionInput>
    | StorefrontAPI.SelectedOptionInput;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type GetProductQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      | 'id'
      | 'title'
      | 'handle'
      | 'description'
      | 'descriptionHtml'
      | 'vendor'
      | 'productType'
      | 'tags'
    > & {
      seo: Pick<StorefrontAPI.Seo, 'title' | 'description'>;
      personalizationField?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'value'>
      >;
      collections: {
        nodes: Array<
          Pick<StorefrontAPI.Collection, 'title' | 'handle'> & {
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText'>
            >;
          }
        >;
      };
      images: {
        nodes: Array<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
      };
      options: Array<
        Pick<StorefrontAPI.ProductOption, 'id' | 'name'> & {
          optionValues: Array<Pick<StorefrontAPI.ProductOptionValue, 'name'>>;
        }
      >;
      selectedVariant?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'> & {
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
        }
      >;
      variants: {
        nodes: Array<
          Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'> & {
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
          }
        >;
      };
      priceRange: {
        minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      };
      compareAtPriceRange: {
        minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      };
    }
  >;
};

export type ProductVariantFieldsFragment = Pick<
  StorefrontAPI.ProductVariant,
  'id' | 'availableForSale'
> & {
  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  compareAtPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
};

export type CollectionPageQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  sortKey?: StorefrontAPI.InputMaybe<StorefrontAPI.ProductCollectionSortKeys>;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']['input']>;
  filters?: StorefrontAPI.InputMaybe<
    Array<StorefrontAPI.ProductFilter> | StorefrontAPI.ProductFilter
  >;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type CollectionPageQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Collection, 'id' | 'title' | 'description'> & {
      image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url' | 'altText'>>;
      products: {
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            'id' | 'title' | 'handle' | 'availableForSale' | 'tags'
          > & {
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            compareAtPriceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            featuredImage?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
            variants: {
              nodes: Array<
                Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'>
              >;
            };
          }
        >;
        filters: Array<
          Pick<StorefrontAPI.Filter, 'id' | 'label' | 'type'> & {
            values: Array<
              Pick<
                StorefrontAPI.FilterValue,
                'id' | 'label' | 'count' | 'input'
              >
            >;
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'startCursor' | 'endCursor'
        >;
      };
    }
  >;
};

export type CollectionsIndexQueryVariables = StorefrontAPI.Exact<{
  first: StorefrontAPI.Scalars['Int']['input'];
  after?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']['input']>;
}>;

export type CollectionsIndexQuery = {
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'> & {
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
      }
    >;
    pageInfo: Pick<StorefrontAPI.PageInfo, 'hasNextPage' | 'endCursor'>;
  };
};

export type SearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first: StorefrontAPI.Scalars['Int']['input'];
  term: StorefrontAPI.Scalars['String']['input'];
  sortKey?: StorefrontAPI.InputMaybe<StorefrontAPI.SearchSortKeys>;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']['input']>;
  after?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']['input']>;
}>;

export type SearchQuery = {
  search: Pick<StorefrontAPI.SearchResultItemConnection, 'totalCount'> & {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'title' | 'handle' | 'availableForSale' | 'tags'
      > & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        compareAtPriceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        variants: {
          nodes: Array<
            Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'>
          >;
        };
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'endCursor' | 'startCursor'
    >;
  };
};

export type PredictiveSearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  limit: StorefrontAPI.Scalars['Int']['input'];
  limitScope: StorefrontAPI.PredictiveSearchLimitScope;
  term: StorefrontAPI.Scalars['String']['input'];
  types?: StorefrontAPI.InputMaybe<
    | Array<StorefrontAPI.PredictiveSearchType>
    | StorefrontAPI.PredictiveSearchType
  >;
}>;

export type PredictiveSearchQuery = {
  predictiveSearch?: StorefrontAPI.Maybe<{
    articles: Array<
      {__typename: 'Article'} & Pick<
        StorefrontAPI.Article,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          blog: Pick<StorefrontAPI.Blog, 'handle'>;
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
    >;
    collections: Array<
      {__typename: 'Collection'} & Pick<
        StorefrontAPI.Collection,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
    >;
    pages: Array<
      {__typename: 'Page'} & Pick<
        StorefrontAPI.Page,
        'id' | 'title' | 'handle' | 'trackingParameters'
      >
    >;
    products: Array<
      {__typename: 'Product'} & Pick<
        StorefrontAPI.Product,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ProductVariant, 'id'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
            }
          >;
        }
    >;
    queries: Array<
      {__typename: 'SearchQuerySuggestion'} & Pick<
        StorefrontAPI.SearchQuerySuggestion,
        'text' | 'styledText' | 'trackingParameters'
      >
    >;
  }>;
};

export type PredictiveArticleFragment = {__typename: 'Article'} & Pick<
  StorefrontAPI.Article,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    blog: Pick<StorefrontAPI.Blog, 'handle'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
    >;
  };

export type PredictiveCollectionFragment = {__typename: 'Collection'} & Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
    >;
  };

export type PredictivePageFragment = {__typename: 'Page'} & Pick<
  StorefrontAPI.Page,
  'id' | 'title' | 'handle' | 'trackingParameters'
>;

export type PredictiveProductFragment = {__typename: 'Product'} & Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ProductVariant, 'id'> & {
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
      }
    >;
  };

export type PredictiveQueryFragment = {
  __typename: 'SearchQuerySuggestion';
} & Pick<
  StorefrontAPI.SearchQuerySuggestion,
  'text' | 'styledText' | 'trackingParameters'
>;

interface GeneratedQueryTypes {
  '#graphql\n  query GetCategoryIconCollections {\n    collections(first: 50) {\n      nodes {\n        id\n        title\n        handle\n        image {\n          url\n          altText\n          width\n          height\n        }\n        isMainCollection: metafield(namespace: "custom", key: "is_main_collection") {\n          value\n        }\n      }\n    }\n  }\n': {
    return: GetCategoryIconCollectionsQuery;
    variables: GetCategoryIconCollectionsQueryVariables;
  };
  '#graphql\n  query GetCollectionProducts(\n    $handle: String!\n    $first: Int!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      products(first: $first) {\n          nodes {\n            id\n            title\n            handle\n            featuredImage {\n              url\n              altText\n            }\n            priceRange {\n              minVariantPrice {\n                amount\n                currencyCode\n              }\n            }\n          }\n      }\n    }\n  }\n': {
    return: GetCollectionProductsQuery;
    variables: GetCollectionProductsQueryVariables;
  };
  '#graphql\n  query CustomerDetails($customerAccessToken: String!) {\n    customer(customerAccessToken: $customerAccessToken) {\n      id\n      firstName\n      lastName\n      email\n      phone\n      defaultAddress {\n        ...MailingAddress\n      }\n      addresses(first: 10) {\n        nodes {\n          ...MailingAddress\n        }\n      }\n    }\n  }\n  #graphql\n  fragment MailingAddress on MailingAddress {\n    id\n    firstName\n    lastName\n    company\n    address1\n    address2\n    city\n    province\n    provinceCode\n    zip\n    country\n    countryCodeV2\n    phone\n    formatted\n  }\n\n': {
    return: CustomerDetailsQuery;
    variables: CustomerDetailsQueryVariables;
  };
  '#graphql\n  query CustomerOrders(\n    $customerAccessToken: String!\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) {\n    customer(customerAccessToken: $customerAccessToken) {\n      orders(\n        first: $first\n        last: $last\n        before: $startCursor\n        after: $endCursor\n        sortKey: PROCESSED_AT\n        reverse: true\n      ) {\n        nodes {\n          id\n          name\n          orderNumber\n          processedAt\n          financialStatus\n          fulfillmentStatus\n          currentTotalPrice {\n            amount\n            currencyCode\n          }\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          startCursor\n          endCursor\n        }\n      }\n    }\n  }\n': {
    return: CustomerOrdersQuery;
    variables: CustomerOrdersQueryVariables;
  };
  '#graphql\n  query CustomerOrder($id: ID!) {\n    order: node(id: $id) {\n      ... on Order {\n        id\n        name\n        orderNumber\n        processedAt\n        financialStatus\n        fulfillmentStatus\n        statusUrl\n        currentTotalPrice {\n          amount\n          currencyCode\n        }\n        subtotalPrice {\n          amount\n          currencyCode\n        }\n        totalTax {\n          amount\n          currencyCode\n        }\n        shippingAddress {\n          ...MailingAddress\n        }\n        successfulFulfillments(first: 10) {\n          trackingInfo {\n            number\n            url\n          }\n        }\n        lineItems(first: 100) {\n          nodes {\n            title\n            quantity\n            discountedTotalPrice {\n              amount\n              currencyCode\n            }\n            originalTotalPrice {\n              amount\n              currencyCode\n            }\n            variant {\n              id\n              title\n              image {\n                url\n                altText\n                width\n                height\n              }\n              product {\n                handle\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n  #graphql\n  fragment MailingAddress on MailingAddress {\n    id\n    firstName\n    lastName\n    company\n    address1\n    address2\n    city\n    province\n    provinceCode\n    zip\n    country\n    countryCodeV2\n    phone\n    formatted\n  }\n\n': {
    return: CustomerOrderQuery;
    variables: CustomerOrderQueryVariables;
  };
  '#graphql\n  query GetHeroBannerContent {\n    metaobjects(type: "main_content", first: 2) {\n      nodes {\n        fields {\n          key\n          value\n          reference {\n            ... on MediaImage {\n              image {\n                url\n                altText\n                width\n                height\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: GetHeroBannerContentQuery;
    variables: GetHeroBannerContentQueryVariables;
  };
  '#graphql\n  query GetHeroCarouselSlides {\n    metaobjects(type: "hero_banner", first: 5) {\n      nodes {\n        fields {\n          key\n          value\n          reference {\n            ... on MediaImage {\n              image {\n                url\n                altText\n                width\n                height\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: GetHeroCarouselSlidesQuery;
    variables: GetHeroCarouselSlidesQueryVariables;
  };
  '#graphql\n  query GetHomeContent(\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    metaobjects(type: "home_content", first: 10) {\n      nodes {\n        id\n        title: field(key: "title") { value }\n        description: field(key: "description") { value }\n        actionLink: field(key: "action_link") { value }\n        image: field(key: "image") {\n          reference {\n            ... on MediaImage {\n              image {\n                url\n                altText\n              }\n            }\n          }\n        }\n        collections: field(key: "collections") {\n          references(first: 10) {\n            nodes {\n              ... on Collection {\n                title\n                handle\n                products(first: 4) {\n                  nodes {\n                    id\n                    title\n                    handle\n                    featuredImage {\n                      url\n                      altText\n                    }\n                    priceRange {\n                      minVariantPrice {\n                        amount\n                        currencyCode\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: GetHomeContentQuery;
    variables: GetHomeContentQueryVariables;
  };
  '#graphql\n  fragment Shop on Shop {\n    id\n    name\n    description\n    primaryDomain {\n      url\n    }\n    brand {\n      logo {\n        image {\n          url\n        }\n      }\n    }\n  }\n  query Header(\n    $country: CountryCode\n    $headerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      ...Shop\n    }\n    menu(handle: $headerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  # Level 3 — leaf items (e.g. "Summer", "Anniversary")\n  fragment LeafMenuItem on MenuItem {\n    ...MenuItem\n  }\n  # Level 2 — group columns (e.g. "By Occasion", "By Recipient")\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...LeafMenuItem\n    }\n  }\n  # Level 1 — top nav items (e.g. "Gifts", "Apparel")\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: HeaderQuery;
    variables: HeaderQueryVariables;
  };
  '#graphql\n  query Footer(\n    $country: CountryCode\n    $footerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    menu(handle: $footerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  # Level 3 — leaf items (e.g. "Summer", "Anniversary")\n  fragment LeafMenuItem on MenuItem {\n    ...MenuItem\n  }\n  # Level 2 — group columns (e.g. "By Occasion", "By Recipient")\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...LeafMenuItem\n    }\n  }\n  # Level 1 — top nav items (e.g. "Gifts", "Apparel")\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: FooterQuery;
    variables: FooterQueryVariables;
  };
  '#graphql\n  query GetNavigationCollections {\n    collections(first: 250) {\n      nodes {\n        id\n        title\n        handle\n        isRoot: metafield(namespace: "custom", key: "is_root") {\n          value\n        }\n        subCollections: metafield(namespace: "custom", key: "sub_collections") {\n          references(first: 50) {\n            nodes {\n              ... on Collection {\n                id\n                title\n                handle\n                subCollections: metafield(namespace: "custom", key: "sub_collections") {\n                  references(first: 50) {\n                    nodes {\n                      ... on Collection {\n                        id\n                        title\n                        handle\n                        subCollections: metafield(namespace: "custom", key: "sub_collections") {\n                          references(first: 50) {\n                            nodes {\n                              ... on Collection {\n                                id\n                                title\n                                handle\n                              }\n                            }\n                          }\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: GetNavigationCollectionsQuery;
    variables: GetNavigationCollectionsQueryVariables;
  };
  '#graphql\n  query Page(\n    $language: LanguageCode\n    $country: CountryCode\n    $handle: String!\n  ) @inContext(language: $language, country: $country) {\n    page(handle: $handle) {\n      id\n      title\n      handle\n      body\n      bodySummary\n      seo {\n        description\n        title\n      }\n    }\n  }\n': {
    return: PageQuery;
    variables: PageQueryVariables;
  };
  '#graphql\n  query GetProductRecommendations(\n    $productId: ID!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    productRecommendations(productId: $productId, intent: RELATED) {\n      id\n      title\n      handle\n      featuredImage {\n        url\n        altText\n      }\n      priceRange {\n        minVariantPrice {\n          amount\n          currencyCode\n        }\n      }\n    }\n  }\n': {
    return: GetProductRecommendationsQuery;
    variables: GetProductRecommendationsQueryVariables;
  };
  '#graphql\n  query GetProduct(\n    $handle: String!\n    $selectedOptions: [SelectedOptionInput!]!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      id\n      title\n      handle\n      description\n      descriptionHtml\n      vendor\n      productType\n      tags\n      seo {\n        title\n        description\n      }\n      personalizationField: metafield(namespace: "custom", key: "personalization") {\n        value\n      }\n      collections(first: 6) {\n        nodes {\n          title\n          handle\n          image {\n            url\n            altText\n          }\n        }\n      }\n      images(first: 20) {\n        nodes {\n          id\n          url\n          altText\n          width\n          height\n        }\n      }\n      options {\n        id\n        name\n        optionValues {\n          name\n        }\n      }\n      selectedVariant: variantBySelectedOptions(\n        selectedOptions: $selectedOptions\n        ignoreUnknownOptions: true\n        caseInsensitiveMatch: true\n      ) {\n        ...ProductVariantFields\n      }\n      variants(first: 250) {\n        nodes {\n          ...ProductVariantFields\n        }\n      }\n      priceRange {\n        minVariantPrice {\n          amount\n          currencyCode\n        }\n      }\n      compareAtPriceRange {\n        minVariantPrice {\n          amount\n          currencyCode\n        }\n      }\n    }\n  }\n  fragment ProductVariantFields on ProductVariant {\n    id\n    availableForSale\n    price {\n      amount\n      currencyCode\n    }\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    selectedOptions {\n      name\n      value\n    }\n    image {\n      id\n      url\n      altText\n      width\n      height\n    }\n  }\n': {
    return: GetProductQuery;
    variables: GetProductQueryVariables;
  };
  '#graphql\n  query CollectionPage(\n    $handle: String!\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n    $sortKey: ProductCollectionSortKeys\n    $reverse: Boolean\n    $filters: [ProductFilter!]\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      title\n      description\n      image {\n        url\n        altText\n      }\n      products(\n        first: $first\n        last: $last\n        before: $startCursor\n        after: $endCursor\n        sortKey: $sortKey\n        reverse: $reverse\n        filters: $filters\n      ) {\n        nodes {\n          id\n          title\n          handle\n          availableForSale\n          priceRange {\n            minVariantPrice { amount currencyCode }\n          }\n          compareAtPriceRange {\n            minVariantPrice { amount currencyCode }\n          }\n          featuredImage {\n            url\n            altText\n            width\n            height\n          }\n          variants(first: 1) {\n            nodes { id availableForSale }\n          }\n          tags\n        }\n        filters {\n          id\n          label\n          type\n          values {\n            id\n            label\n            count\n            input\n          }\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          startCursor\n          endCursor\n        }\n      }\n    }\n  }\n': {
    return: CollectionPageQuery;
    variables: CollectionPageQueryVariables;
  };
  '#graphql\n  query CollectionsIndex($first: Int!, $after: String) {\n    collections(first: $first, after: $after, sortKey: TITLE) {\n      nodes {\n        id\n        title\n        handle\n        image {\n          url\n          altText\n          width\n          height\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n': {
    return: CollectionsIndexQuery;
    variables: CollectionsIndexQueryVariables;
  };
  '#graphql\n  query Search(\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int!\n    $term: String!\n    $sortKey: SearchSortKeys\n    $reverse: Boolean\n    $after: String\n  ) @inContext(country: $country, language: $language) {\n    search(\n      query: $term\n      first: $first\n      sortKey: $sortKey\n      reverse: $reverse\n      after: $after\n      types: [PRODUCT]\n    ) {\n      totalCount\n      nodes {\n        ... on Product {\n          id\n          title\n          handle\n          availableForSale\n          tags\n          featuredImage {\n            url\n            altText\n            width\n            height\n          }\n          priceRange {\n            minVariantPrice {\n              amount\n              currencyCode\n            }\n          }\n          compareAtPriceRange {\n            minVariantPrice {\n              amount\n              currencyCode\n            }\n          }\n          variants(first: 1) {\n            nodes {\n              id\n              availableForSale\n            }\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        endCursor\n        startCursor\n      }\n    }\n  }\n': {
    return: SearchQuery;
    variables: SearchQueryVariables;
  };
  '#graphql\n  query PredictiveSearch(\n    $country: CountryCode\n    $language: LanguageCode\n    $limit: Int!\n    $limitScope: PredictiveSearchLimitScope!\n    $term: String!\n    $types: [PredictiveSearchType!]\n  ) @inContext(country: $country, language: $language) {\n    predictiveSearch(\n      limit: $limit,\n      limitScope: $limitScope,\n      query: $term,\n      types: $types,\n    ) {\n      articles {\n        ...PredictiveArticle\n      }\n      collections {\n        ...PredictiveCollection\n      }\n      pages {\n        ...PredictivePage\n      }\n      products {\n        ...PredictiveProduct\n      }\n      queries {\n        ...PredictiveQuery\n      }\n    }\n  }\n  #graphql\n  fragment PredictiveArticle on Article {\n    __typename\n    id\n    title\n    handle\n    blog {\n      handle\n    }\n    image {\n      url\n      altText\n      width\n      height\n    }\n    trackingParameters\n  }\n\n  #graphql\n  fragment PredictiveCollection on Collection {\n    __typename\n    id\n    title\n    handle\n    image {\n      url\n      altText\n      width\n      height\n    }\n    trackingParameters\n  }\n\n  #graphql\n  fragment PredictivePage on Page {\n    __typename\n    id\n    title\n    handle\n    trackingParameters\n  }\n\n  #graphql\n  fragment PredictiveProduct on Product {\n    __typename\n    id\n    title\n    handle\n    trackingParameters\n    selectedOrFirstAvailableVariant(\n      selectedOptions: []\n      ignoreUnknownOptions: true\n      caseInsensitiveMatch: true\n    ) {\n      id\n      image {\n        url\n        altText\n        width\n        height\n      }\n      price {\n        amount\n        currencyCode\n      }\n      compareAtPrice {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n  #graphql\n  fragment PredictiveQuery on SearchQuerySuggestion {\n    __typename\n    text\n    styledText\n    trackingParameters\n  }\n\n': {
    return: PredictiveSearchQuery;
    variables: PredictiveSearchQueryVariables;
  };
}

interface GeneratedMutationTypes {
  '#graphql\n  mutation CustomerLogin($input: CustomerAccessTokenCreateInput!) {\n    customerAccessTokenCreate(input: $input) {\n      customerAccessToken {\n        accessToken\n        expiresAt\n      }\n      customerUserErrors {\n        field\n        message\n        code\n      }\n    }\n  }\n': {
    return: CustomerLoginMutation;
    variables: CustomerLoginMutationVariables;
  };
  '#graphql\n  mutation CustomerRegister($input: CustomerCreateInput!) {\n    customerCreate(input: $input) {\n      customer {\n        id\n        firstName\n      }\n      customerUserErrors {\n        field\n        message\n        code\n      }\n    }\n  }\n': {
    return: CustomerRegisterMutation;
    variables: CustomerRegisterMutationVariables;
  };
  '#graphql\n  mutation CustomerRecover($email: String!) {\n    customerRecover(email: $email) {\n      customerUserErrors {\n        field\n        message\n        code\n      }\n    }\n  }\n': {
    return: CustomerRecoverMutation;
    variables: CustomerRecoverMutationVariables;
  };
  '#graphql\n  mutation CustomerAddressCreate(\n    $customerAccessToken: String!\n    $address: MailingAddressInput!\n  ) {\n    customerAddressCreate(\n      customerAccessToken: $customerAccessToken\n      address: $address\n    ) {\n      customerAddress {\n        ...MailingAddress\n      }\n      customerUserErrors {\n        field\n        message\n        code\n      }\n    }\n  }\n  #graphql\n  fragment MailingAddress on MailingAddress {\n    id\n    firstName\n    lastName\n    company\n    address1\n    address2\n    city\n    province\n    provinceCode\n    zip\n    country\n    countryCodeV2\n    phone\n    formatted\n  }\n\n': {
    return: CustomerAddressCreateMutation;
    variables: CustomerAddressCreateMutationVariables;
  };
  '#graphql\n  mutation CustomerAddressUpdate(\n    $customerAccessToken: String!\n    $id: ID!\n    $address: MailingAddressInput!\n  ) {\n    customerAddressUpdate(\n      customerAccessToken: $customerAccessToken\n      id: $id\n      address: $address\n    ) {\n      customerAddress {\n        ...MailingAddress\n      }\n      customerUserErrors {\n        field\n        message\n        code\n      }\n    }\n  }\n  #graphql\n  fragment MailingAddress on MailingAddress {\n    id\n    firstName\n    lastName\n    company\n    address1\n    address2\n    city\n    province\n    provinceCode\n    zip\n    country\n    countryCodeV2\n    phone\n    formatted\n  }\n\n': {
    return: CustomerAddressUpdateMutation;
    variables: CustomerAddressUpdateMutationVariables;
  };
  '#graphql\n  mutation CustomerAddressDelete($customerAccessToken: String!, $id: ID!) {\n    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {\n      deletedCustomerAddressId\n      customerUserErrors {\n        field\n        message\n        code\n      }\n    }\n  }\n': {
    return: CustomerAddressDeleteMutation;
    variables: CustomerAddressDeleteMutationVariables;
  };
  '#graphql\n  mutation CustomerDefaultAddressUpdate(\n    $customerAccessToken: String!\n    $addressId: ID!\n  ) {\n    customerDefaultAddressUpdate(\n      customerAccessToken: $customerAccessToken\n      addressId: $addressId\n    ) {\n      customer {\n        id\n        defaultAddress {\n          id\n        }\n      }\n      customerUserErrors {\n        field\n        message\n        code\n      }\n    }\n  }\n': {
    return: CustomerDefaultAddressUpdateMutation;
    variables: CustomerDefaultAddressUpdateMutationVariables;
  };
}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
