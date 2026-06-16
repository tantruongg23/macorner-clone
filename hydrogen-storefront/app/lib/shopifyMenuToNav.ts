/**
 * Converts a Shopify 3-level navigation menu (fetched via the extended MENU_FRAGMENT)
 * into the NavItem[] format consumed by HarperaHeader and MobileNavDrawer.
 *
 * Structure expected from Shopify:
 *   menu.items[]            → Level 1  (Graduation, Gifts, Home & Living …)
 *     .items[]              → Level 2  (By Occasion, By Recipient …)
 *       .items[]            → Level 3  (Summer, Anniversary, Wedding …)
 *
 * Falls back to HARPERA_NAV when the Shopify menu is empty, null, or not yet
 * configured — so the site always has a working navigation.
 *
 * After changing MENU_FRAGMENT run:
 *   npm run codegen
 * to regenerate storefrontapi.generated.d.ts and tighten the types.
 */

import type {NavGroup, NavItem, NavLeaf} from './staticNav';
import {HARPERA_NAV} from './staticNav';

/* ─── Local types that mirror the 3-level Shopify MenuItem shape ────────── */

type ShopifyLeaf = {
  id: string;
  title: string;
  url: string;
};

type ShopifyGroup = {
  id: string;
  title: string;
  url: string;
  items?: ShopifyLeaf[] | null;
};

type ShopifyTopItem = {
  id: string;
  title: string;
  url: string;
  items?: ShopifyGroup[] | null;
};

type ShopifyMenu = {
  items?: ShopifyTopItem[] | null;
} | null | undefined;

/* ─── URL helpers ───────────────────────────────────────────────────────── */

/**
 * Converts an absolute Shopify storefront URL to a relative path.
 * e.g. "https://store.myshopify.com/collections/summer" → "/collections/summer"
 */
function toRelativePath(url: string | null | undefined): string {
  if (!url) return '/';
  try {
    return new URL(url).pathname;
  } catch {
    return url.startsWith('/') ? url : `/${url}`;
  }
}

/* ─── Main transformer ──────────────────────────────────────────────────── */

/**
 * @param menu  The `menu` field from HeaderQuery (pass `header.menu`).
 *              Typed as `unknown` so it compiles before running codegen.
 * @param fallback  NavItem[] to use when Shopify returns nothing (default: HARPERA_NAV).
 */
export function shopifyMenuToNav(
  menu: unknown,
  fallback: NavItem[] = HARPERA_NAV,
): NavItem[] {
  const m = menu as ShopifyMenu;

  if (!m?.items?.length) return fallback;

  const result: NavItem[] = m.items.map((topItem): NavItem => {
    let groups: NavGroup[] | undefined;

    if (topItem.items?.length) {
      groups = topItem.items.map((group): NavGroup => {
        const leaves: NavLeaf[] = (group.items ?? []).map(
          (leaf): NavLeaf => ({
            id: leaf.id,
            title: leaf.title,
            url: toRelativePath(leaf.url),
          }),
        );

        return {
          id: group.id,
          title: group.title,
          // Group's own URL. When it has no child items, MegaDropdownGroup
          // turns the title itself into this link (2-level menu support).
          // When it has children, this becomes the "See All" link.
          seeAllUrl: toRelativePath(group.url),
          items: leaves,
        };
      });
    }

    return {
      id: topItem.id,
      title: topItem.title,
      url: toRelativePath(topItem.url),
      groups: groups?.length ? groups : undefined,
    };
  });

  // If Shopify returned items but they're all empty shells, still fall back
  return result.length ? result : fallback;
}
