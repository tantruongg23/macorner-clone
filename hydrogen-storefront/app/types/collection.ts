export type SortByValue =
  | 'manual'
  | 'most-relevant'
  | 'best-selling'
  | 'title-ascending'
  | 'title-descending'
  | 'price-ascending'
  | 'price-descending'
  | 'created-ascending'
  | 'created-descending';

export type SortOption = {label: string; key: string; reverse: boolean};

export const SORT_OPTIONS: Record<SortByValue, SortOption> = {
  manual:              {label: 'Featured',            key: 'COLLECTION_DEFAULT', reverse: false},
  'most-relevant':     {label: 'Most relevant',        key: 'RELEVANCE',          reverse: false},
  'best-selling':      {label: 'Best selling',         key: 'BEST_SELLING',       reverse: false},
  'title-ascending':   {label: 'Alphabetically, A-Z',  key: 'TITLE',              reverse: false},
  'title-descending':  {label: 'Alphabetically, Z-A',  key: 'TITLE',              reverse: true},
  'price-ascending':   {label: 'Price, low to high',   key: 'PRICE',              reverse: false},
  'price-descending':  {label: 'Price, high to low',   key: 'PRICE',              reverse: true},
  'created-ascending': {label: 'Date, old to new',     key: 'CREATED',            reverse: false},
  'created-descending':{label: 'Date, new to old',     key: 'CREATED',            reverse: true},
};

export type ProductNode = {
  id: string;
  title: string;
  handle: string;
  availableForSale: boolean;
  priceRange: {minVariantPrice: {amount: string; currencyCode: string}};
  compareAtPriceRange: {minVariantPrice: {amount: string; currencyCode: string}};
  featuredImage: {
    url: string;
    altText: string | null;
    width: number | null;
    height: number | null;
  } | null;
  variants: {nodes: {id: string; availableForSale: boolean}[]};
  tags: string[];
};

export type PageInfo = {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string;
  endCursor: string;
};
