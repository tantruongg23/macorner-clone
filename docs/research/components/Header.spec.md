# Header Specification (macorner.co)

> Re-extracted **2026-05-23** from live `https://macorner.co/` via Playwright MCP at viewport `1440 × 900`.
> Source of truth for `app/components/macorner/Header.tsx`. Every value below is from `getComputedStyle()` — do not estimate.

## Overview
- **Target file:** `hydrogen-storefront/app/components/macorner/Header.tsx`
- **Screenshot:** `docs/design-references/macorner-header-desktop-1440.png`
- **Interaction model:** mostly static; hover color transitions on links; hover focus state on search input; localization dropdown (out of scope for this pass — display only).
- **Data source:** static for now (menu items hardcoded). Cart count will be `Storefront API` later.

## Brand tokens (re-extracted)
| Token | Value |
|---|---|
| Font family | `Poppins, sans-serif` |
| Body color | `rgba(18, 18, 18, 0.75)` |
| Header text color | `rgb(53, 53, 53)` (#353535) |
| Brand accent / orange | **`rgb(252, 101, 20)` (#FC6514)** — was previously #F36621, this was wrong |
| Cart bubble red | `rgb(255, 69, 58)` |
| Border-bottom gray | `rgb(211, 211, 211)` (#D3D3D3) |
| Search border color | `rgba(18, 18, 18, 0.75)` |
| Pipe-separator gray | `rgb(136, 134, 134)` |
| Letter-spacing (global) | `0.6px` |

## DOM hierarchy (visible @ desktop)

```
header.header  (block, max-width 1440, padding 28px 13px 0)
├── div.header-top  (flex row, gap 18px, space-between, align center, height 50)
│    ├── h2.header__heading  (logo wrapper, 207.5 × 38.7)
│    │    └── a.header__heading-link
│    │         └── img.header__heading-logo  (width 200, height auto, src cdn /logo-macorner.svg)
│    ├── div.header__icons--localization.header-localization  (search container, 602 × 50)
│    │    └── div.header__search.search_container
│    │         └── form.search  (action="/pages/search-results-page")
│    │              └── div.field  (relative, 602×50; ::after = the rounded border)
│    │                   ├── input.search__input  (600×48, padding 15px 98px 15px 15px, fs 15, color #121212)
│    │                   ├── label.field__label "Search"  (visually anchors placeholder)
│    │                   ├── button.reset__button.field__button.hidden  (hidden when empty)
│    │                   └── button.search__button.field__button  (36×36 ORANGE CIRCLE, abs top:1 right:1, margin 6, aria-label="Search")
│    │                        └── svg.icon-search  (18×18, color white)
│    └── div.box-header-right  (flex row, gap 15, align center, 450×25.3 @ x≈962)
│         ├── a.header__icon--account  →  /account/login  [TEXT-ONLY "Sign In"]
│         │     └── span.hidden-xs "Sign In"
│         ├── div.wishlist > div.box-show > a[href="/pages/wishlist"][title="Wishlist"]  [TEXT-ONLY "Wishlist"]
│         │     └── span.hidden-xs "Wishlist"
│         ├── div.track-order-mobile.hidden-xs > a[href="/pages/tracking-order"]  [TEXT-ONLY "Track Order"]
│         ├── div#box-shipping.select_wrap  (flex, align center, 148×22.5)  [LANGUAGE SWITCHER]
│         │     ├── div.shipping-to-flags  (relative, 40×13.3; img US flag 20×13.3; ::after = 2×13 gray PIPE at left:33)
│         │     │     └── img.img-country  (US flag SVG, 20×14)
│         │     └── div.currency  "United States"  (fs 15, fw 500)
│         └── a#cart-icon-bubble  (flex column, 29×25.3, position relative)  [CART ICON]
│              ├── svg cart (29×22.3, fill #121212 @ .8 alpha)
│              └── div.cart-count-bubble  (abs top:-6 right:-6, 19×19, bg red, color white, fs 9, border-radius 100%)
│                   └── span#header-cart-count-bubble "0"
└── nav.header__inline-menu  (block, text-align CENTER, margin-top 15, height 52)
     └── ul.list-menu.list-menu--inline  (inline-flex, 1072×52, auto-centered via text-align)
          └── li × N  →  a.header__menu-item.list-menu__item  (padding 12 12 20, fs 14 fw 600, gap 12)
               [Graduation, Father's Day, Gifts ▼, Home & Living, Drink & Barware,
                Apparel, Accessories, Interests ▼, Happy Customers]
```

## Computed styles (verbatim from `getComputedStyle`)

### `.header-wrapper` (outer)
- background: `rgb(255, 255, 255)`
- border-bottom: `1px solid rgb(211, 211, 211)`
- position: `relative`

### `header.header`
- max-width: `1440px`
- padding: `28px 13px 0px` (top, x, bottom)
- font: Poppins 16px / 24px, letter-spacing 0.6px
- (note: `grid-template-columns: 1fr auto` is set but layout is currently driven by inner flex `.header-top`)

### `.header-top`
- display: `flex`; flex-direction: row
- justify-content: `space-between`; align-items: `center`
- gap: `18px`
- height: `50px`

### Logo `img.header__heading-logo`
- width: `200px`; height: auto
- src: `https://macorner.co/cdn/shop/files/logo-macorner.svg?v=1719548910`
- alt: `Macorner`
- (we already have it locally at `/icons/logo-macorner.svg`)

### Search wrapper `.field`
- display: `flex`; position: `relative`
- size: `602 × 50`
- **`.field::after`** (THE rounded border):
  - position: `absolute`, inset 1px (top/right/bottom/left: 1px)
  - border: `1px solid rgba(18, 18, 18, 0.75)`
  - **border-radius: `25px`**
  - z-index: 1

### Search input `input.search__input`
- size: `600 × 48` (margin 1px all around)
- padding: `15px 98px 15px 15px` (right 98 to clear button)
- font: Poppins 15px / 22.5px, color `rgb(18, 18, 18)`
- background: white, border: 0
- placeholder: `"Search"` (color: `rgb(209, 214, 220)` via `.field__label`)

### Search button `button.search__button.field__button`
- position: `absolute`, top: 1px, right: 1px (effectively offset 7px due to margin: 6px)
- size: `36 × 36`
- background: `rgb(252, 101, 20)` ← brand orange `#FC6514`
- **border-radius: `999999px`** (perfect circle)
- aria-label: `Search`
- inner SVG: 18×18, white fill, `<svg class="icon icon-search"><use href="#icon-search"/></svg>`

### Utility cluster `.box-header-right`
- display: `flex`; flex-direction: row; align-items: `center`; **gap: `15px`**
- All links **TEXT-ONLY** (no leading icon)
- Link color: `rgb(53, 53, 53)` (#353535), font Poppins
- Sign In: fs `14px`, fw `500`
- Wishlist: fs `15px`, fw `500`
- Track Order: fs `15px`, fw `500`

### Language switcher `#box-shipping`
- display: `flex`, align-items: `center`, width ~148px (no explicit gap)
- Children:
  - `.shipping-to-flags` — `position: relative; width: 40px; height: 13.3px`
    - Contains the US flag `<img src="/icons/US.svg" width="20" height="14">` left-aligned
    - **`::after` pseudo = the vertical pipe `|`**
      - position: absolute, left: 33px, top: 0, bottom: 0
      - width: 2px; height: 13px
      - background: `rgb(136, 134, 134)`
  - `.currency` — text `" United States"`, fs `15px`, fw `500`, color `rgba(18, 18, 18, 0.75)`
- Net visual: `[flag 20×14] [2px gray pipe at left:33] [United States text]`

### Cart `a#cart-icon-bubble`
- display: `flex`; flex-direction: column; align-items: center
- position: relative
- size: `29 × 25.3` (svg occupies 29×22.3)
- No "Cart" label; just the icon
- color: `rgb(53, 53, 53)`
- **Cart count bubble `.cart-count-bubble`**:
  - position: absolute; top: `-6px`; right: `-6px`
  - size: `19 × 19`; border-radius: `100%`
  - background: `rgb(255, 69, 58)` (red — **not** orange)
  - color: white; fs `9px`, fw `500`
  - display: flex; justify-content: center; align-items: center

### Main nav `nav.header__inline-menu`
- display: `block`
- **`text-align: center`** ← this is what centers the inline-flex `ul`
- margin-top: `15px`
- height: `52.2px`
- Inner `ul.list-menu--inline`: `display: inline-flex; flex-direction: row; gap: normal`
- Inner `a.header__menu-item`:
  - display: flex; align-items: center; gap: `12px`
  - padding: `12px 12px 20px` (top, x, bottom)
  - font: Poppins **14px / 18.2px**, fw `600`, letter-spacing 0.6px
  - default color: `rgb(53, 53, 53)`
  - **active/hover color: `rgb(252, 101, 20)`** (#FC6514)
  - border-bottom: `2px solid transparent` (likely becomes orange when active — confirmed on "Graduation" active state)

#### Menu items (verbatim, in order)
1. **Graduation** → `/collections/graduation`
2. **Father's Day** → `/pages/gifts-for-dad`
3. **Gifts** (▼ dropdown) → `#` (mega menu opens)
4. **Home & Living**
5. **Drink & Barware**
6. **Apparel**
7. **Accessories**
8. **Interests** (▼ dropdown)
9. **Happy Customers**

## States & Behaviors

### Search hover/focus
- `.field::after` border color tightens / search button slightly darkens on hover (not yet captured precisely — minor)

### Nav link hover/active
- Color transitions from `#353535` → `#FC6514`. Border-bottom transitions from transparent to orange when active.

### Cart bubble
- Visible whenever count ≥ 0 in current site (shown even at 0). For Hydrogen, only render bubble when cart count > 0 — common pattern.

## Assets
- `logo-macorner.svg` — already in `public/icons/`
- `US.svg` (US flag) — needs to be downloaded from `https://macorner.co/cdn/shop/t/97/assets/US.svg` → save to `public/icons/flag-us.svg`
- Search icon — inline SVG (use existing `SearchIcon` from `app/components/macorner/icons.tsx`, render white)
- Cart SVG — inline (use existing `BagIcon` or replace with the actual cart SVG from the site)
- No need for `UserIcon`, `HeartIcon`, `GlobeIcon` references in utility links — they are TEXT-ONLY

## Responsive notes (measured 2026-05-23)

| Property | 1440 desktop | 1024 laptop | 768 tablet | 390 mobile |
|---|---|---|---|---|
| body font-size / line-height | 16 / 24 | 16 / 24 | 16 / 24 | **15 / 22.5** |
| header padding | `28 13 0` | `28 15 0` | `20 15` | `20 15` |
| header height | 146 | 197 (nav wraps 2 rows) | 64 (single row) | 60 |
| logo width | 200 | 200 | 151 | 151 |
| search form | visible 602 wide | visible 322 wide | **hidden** (overlay) | **hidden** (overlay) |
| sign in / wishlist / track order text | visible | visible (nav wraps) | hidden | hidden |
| desktop utility cluster `.box-header-right` | visible 450 | visible | hidden | hidden |
| mobile right cluster `.wishlist.hidden-xl` | hidden | hidden | visible 23×19 | visible 23×19 |
| hamburger | hidden | hidden | visible 18×18 | visible 18×18 |
| main nav `header__inline-menu` | visible 1 row | visible 2 rows (wraps) | hidden | hidden |
| cart icon | 29×25 | 29×25 | 25×19 | 24×23 |
| cart bubble | 19×19 (red) | 19×19 | 15×15 | 15×15 |

**Breakpoint signals:**
- `< 990px` (Shopify Dawn's `small-hide` threshold): desktop utility row hides; mobile cluster appears; main nav collapses.
- `≥ 990px`: full desktop layout.
- Effective Tailwind mapping: treat the desktop layout as `md:` (≥ 768) and `lg:` (≥ 1024) — but the *real* switch is around 990. Use `md:` with a custom `min-[990px]:` query for the desktop nav row if needed.

**Mobile (390/768) layout:**
- Single row: `[hamburger]  [logo, slightly left-of-center]  [search-icon, wishlist-icon, cart-icon]`
- Cart bubble shrinks 19→15. Cart icon shrinks 29→24.
- Header padding is `20px 15px` (vs `28px 13px 0` desktop).
- Body text base is 15px (vs 16px on desktop) — global, not header-specific.

## Global link decoration (confirmed 2026-05-23)
- **Every `<a>` element on macorner.co has `text-decoration: none`** — including a freshly-created anonymous link, which means a global selector `a { text-decoration: none; }` is applied.
- Our build inherits browser default `underline` on Tailwind v4 — must add the same global rule in `app.css`.


## Defect map (current build → fix)
| Current bug | Fix |
|---|---|
| Search input has icon on **LEFT** | Move to **RIGHT** as 36×36 orange circle button, white search icon inside |
| Search uses pill `rounded-full` on gray bg, NO border | Use `border-radius: 25px` + `1px solid rgba(18,18,18,0.75)` (via the input itself or pseudo). White background. Right padding 98px to clear icon. |
| Sign In has `<UserIcon>` icon | Remove icon — text only |
| Wishlist has `<HeartIcon>` icon | Remove icon — text only |
| Track Order has `/icons/icon_arow.svg` image | Remove icon — text only |
| Language uses `<GlobeIcon>` + "United States" | Use **flag image** (US.svg) + **2px gray pipe separator** + "United States" text. Drop chevron arrow. |
| Cart icon has "Cart" label and orange bubble | Remove "Cart" text label. Bubble background red `#FF453A`. Bubble position top:-6 right:-6. |
| Brand orange = `#F36621` | Brand orange = `#FC6514` |
| Nav uses `flex justify-center gap-9` | Wrap is fine; ensure nav text is `text-align: center` w/ `inline-flex` ul. Use gap from item padding (12/12/20) not on UL. |
| Nav item color/size | fs 14, fw 600, color `#353535`; active orange `#FC6514` |
| Nav items in current build | Update labels list to **9 items**: Graduation, Father's Day, Gifts ▼, Home & Living, Drink & Barware, Apparel, Accessories, Interests ▼, Happy Customers |
| Logo width 180×22 | Width 200, height auto |
| Header border-bottom currently `rgba(18,18,18,0.06)` | Use `1px solid #D3D3D3` |
