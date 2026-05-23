---
name: clone-template
description: Reverse-engineer and clone one or more websites as a Shopify Hydrogen storefront — extracts assets, CSS, and content section-by-section, maps data to Storefront API queries, and proactively dispatches parallel builder agents in worktrees as it goes. Use this whenever the user wants to clone, replicate, rebuild, reverse-engineer, or copy any website into a Hydrogen/React storefront. Also triggers on phrases like "clone this store", "rebuild this Shopify theme", "make a Hydrogen version of this site", "pixel-perfect Hydrogen clone". Provide one or more target URLs as arguments.
argument-hint: "<url1> [<url2> ...]"
user-invocable: true
---

# Clone Template (Hydrogen + Storefront API)

You are about to reverse-engineer and rebuild **$ARGUMENTS** as pixel-perfect Shopify Hydrogen storefronts powered by the Storefront API.

When multiple URLs are provided, process them independently and in parallel where possible, while keeping each site's extraction artifacts isolated in dedicated folders (for example, `docs/research/<hostname>/`).

This is not a two-phase process (inspect then build). You are a **foreman walking the job site** — as you inspect each section of the page, you write a detailed specification to a file, then hand that file to a specialist builder agent with everything they need. Extraction and construction happen in parallel, but extraction is meticulous and produces auditable artifacts.

## Stack

This skill targets **Shopify Hydrogen** — Shopify's React-based storefront framework built on Remix. The tech stack is:

| Layer | Technology |
|---|---|
| Framework | Shopify Hydrogen (Remix) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Data | Shopify Storefront API (GraphQL) |
| Image optimization | `@shopify/hydrogen` `<Image>` component |
| Cart | `<CartProvider>`, `useCart()` from Hydrogen |
| Routing | Remix file-based routing (`app/routes/`) |
| SEO | Hydrogen `<Seo>` component |

Do NOT use Next.js, shadcn/ui, or any Next.js-specific APIs (`next/font`, `next/image`, `next/router`). All font loading, image optimization, and routing must use Hydrogen/Remix idioms.

## Scope Defaults

The target is whatever page `$ARGUMENTS` resolves to. Clone exactly what's visible at that URL. Unless the user specifies otherwise, use these defaults:

- **Fidelity level:** Pixel-perfect — exact match in colors, spacing, typography, animations
- **In scope:** Visual layout and styling, component structure and interactions, responsive design, Storefront API integration for real product/collection data, cart functionality
- **Out of scope:** Shopify admin, order management, customer accounts (unless visible on the target), authentication, real-time inventory, SEO audit
- **Customization:** None — pure emulation of the target site's design; data is wired to real Storefront API

If the user provides additional instructions (specific fidelity level, customizations, extra context), honor those over the defaults.

## Pre-Flight

1. **Browser automation is required.** Check for available browser MCP tools (Chrome MCP, Playwright MCP, Browserbase MCP, Puppeteer MCP, etc.). Use whichever is available — if multiple exist, prefer Chrome MCP. If none are detected, ask the user which browser tool they have and how to connect it. This skill cannot work without browser automation.
2. Parse `$ARGUMENTS` as one or more URLs. Normalize and validate each URL; if any are invalid, ask the user to correct them before proceeding.
3. Verify the base project builds: `npm run build`. The Hydrogen scaffold should already be in place. If not, scaffold it:
   ```bash
   npm create @shopify/hydrogen@latest -- --template hello-world
   cd <project-dir>
   npm install
   npm run build
   ```
4. Verify `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` are present in `.env`. If not, prompt the user to add them before proceeding — Storefront API calls cannot be mocked.
5. Create the output directories if they don't exist: `docs/research/`, `docs/research/components/`, `docs/design-references/`, `scripts/`. For multiple clones, also prepare per-site folders like `docs/research/<hostname>/`.
6. When working with multiple sites in one command, optionally confirm whether to run them in parallel (recommended, if resources allow) or sequentially.

## Guiding Principles

These are the truths that separate a successful clone from a "close enough" mess. Internalize them — they should inform every decision you make.

### 1. Completeness Beats Speed

Every builder agent must receive **everything** it needs to do its job perfectly: screenshot, exact CSS values, downloaded assets with local paths, real text content, component structure, and the GraphQL query that powers the component. If a builder has to guess anything — a color, a font size, a Storefront API field name — you have failed at extraction.

### 2. Small Tasks, Perfect Results

When an agent gets "build the entire features section," it glosses over details. When it gets a single focused component with exact CSS values and a ready GraphQL query, it nails it every time.

**Complexity budget rule:** If a builder prompt exceeds ~150 lines of spec content, the section is too complex for one agent. Break it into smaller pieces. This is a mechanical check — don't override it.

### 3. Real Content, Real Assets — and Real Storefront API Data

Extract the actual text, images, videos, and SVGs from the live site. This is a clone, not a mockup.

**Identify every data-driven section.** Product grids, collection carousels, featured products, search results, cart items — these must be backed by live Storefront API queries, not hardcoded. For each dynamic section:
- Identify the Storefront API resource it maps to (`products`, `collections`, `productByHandle`, etc.)
- Write the GraphQL query that fetches exactly the fields the component needs
- Include the query in the component spec so the builder uses it directly

**Layered assets matter.** A section that looks like one image is often multiple layers. Inspect each container's full DOM tree and enumerate ALL `<img>` elements and background images within it, including absolutely-positioned overlays.

### 4. Foundation First

Nothing can be built until the foundation exists: global CSS with design tokens, TypeScript types, Storefront API client setup, GraphQL fragment library, and global assets. This is sequential and non-negotiable. Everything after this can be parallel.

### 5. Extract How It Looks AND How It Behaves

For every element, extract its **appearance** (exact computed CSS via `getComputedStyle()`) AND its **behavior** (what changes, what triggers the change, and how the transition happens).

Examples of behaviors to watch for:
- A navbar that shrinks, changes background, or gains a shadow after scrolling past a threshold
- Elements that animate into view when they enter the viewport (fade-up, slide-in, stagger delays)
- Sections that snap into place on scroll (`scroll-snap-type`)
- Parallax layers that move at different rates than the scroll
- Hover states that animate (duration and easing matter)
- Dropdowns, modals, accordions with enter/exit animations
- Auto-playing carousels or cycling content
- **Tabbed/pill content that cycles** — buttons that switch visible card sets with transitions
- **Scroll-driven tab/accordion switching** — sidebars where the active item auto-changes as content scrolls
- **Cart drawer / mini-cart** — does the cart slide in from the side? Animate open/close?
- **Product image gallery** — swipe, zoom, thumbnail switching behavior
- **Smooth scroll libraries** (Lenis, Locomotive Scroll) — check for `.lenis` class or scroll container wrappers

### 6. Identify the Interaction Model Before Building

Before writing any builder prompt for an interactive section, definitively answer: **Is this section driven by clicks, scrolls, hovers, time, or some combination?**

How to determine this:
1. **Don't click first.** Scroll through the section slowly and observe if things change on their own.
2. If they do, it's scroll-driven. Extract the mechanism: `IntersectionObserver`, `scroll-snap`, `position: sticky`, `animation-timeline`, or JS scroll listeners.
3. If nothing changes on scroll, THEN click/hover to test.
4. Document the interaction model explicitly in the component spec.

### 7. Extract Every State, Not Just the Default

For tabbed/stateful content:
- Click each tab/button via browser MCP
- Extract the content, images, and card data for EACH state
- Note the transition animation between states

For scroll-dependent elements:
- Capture computed styles at scroll position 0 (initial state)
- Scroll past the trigger threshold and capture again (scrolled state)
- Diff the two to identify exactly which CSS properties change

### 8. Spec Files Are the Source of Truth

Every component gets a specification file in `docs/research/components/` BEFORE any builder is dispatched. This file is the contract between your extraction work and the builder agent. The builder receives the spec file contents inline in its prompt.

The spec file is not optional. It is not a nice-to-have.

### 9. Build Must Always Compile

Every builder agent must verify `npx tsc --noEmit` passes before finishing. After merging worktrees, you verify `npm run build` passes. A broken build is never acceptable, even temporarily.

### 10. Hydrogen-Specific Constraints

- **Never use `useEffect` to fetch data** — use Remix `loader` functions and `useLoaderData()` for all server-side data fetching
- **Never import `next/*` anything** — Hydrogen uses Remix routing, not Next.js
- **All images must use `<Image>` from `@shopify/hydrogen`** — never raw `<img>` for product images
- **Cart mutations use Hydrogen's cart actions** — `useCart()` hook and Hydrogen's `CartForm` component
- **Routes live in `app/routes/`** using Remix file conventions (`_index.tsx`, `products.$handle.tsx`, `collections.$handle.tsx`)
- **Storefront API calls belong in `loader`/`action` functions** — never in client-side hooks
- **GraphQL queries should use `storefront.query()` from the Hydrogen context**

## Phase 1: Reconnaissance

Navigate to the target URL with browser MCP.

### Screenshots
- Take **full-page screenshots** at desktop (1440px) and mobile (390px) viewports
- Save to `docs/design-references/` with descriptive names

### Global Extraction
Extract these from the page before doing anything else:

**Fonts** — Inspect `<link>` tags for Google Fonts or self-hosted fonts. Check computed `font-family` on key elements. Configure them in `app/root.tsx` using standard CSS `@import` or self-hosted font files in `public/fonts/`.

**Colors** — Extract the site's color palette from computed styles across the page. Update `app/styles/app.css` with the target's actual colors in `:root` CSS variable blocks. Add Tailwind CSS v4 custom properties for all tokens.

**Favicons & Meta** — Download favicons, apple-touch-icons, OG images, webmanifest to `public/`. Update `app/root.tsx` metadata exports.

**Global UI patterns** — Identify any site-wide CSS or JS: custom scrollbar hiding, scroll-snap on the page container, global keyframe animations, backdrop filters, smooth scroll libraries. Add these to `app/styles/app.css`.

**Data topology** — Identify which sections of the page are data-driven:
- Product listings → `products` Storefront API query
- Collection pages → `collection` query with `products` field
- Featured/hero product → `productByHandle` or `products(first: 1)` query
- Navigation menus → `menu` query
- Blog/articles → `articles` query
- Cart → Hydrogen `CartProvider` (client-side, session-backed)

Save this mapping to `docs/research/DATA_TOPOLOGY.md`.

### Mandatory Interaction Sweep

This is a dedicated pass AFTER screenshots and BEFORE anything else.

**Scroll sweep:** Scroll the page slowly from top to bottom. At each section, pause and observe: header changes, viewport-entering animations, sidebar auto-switching, scroll-snap points.

**Click sweep:** Click every element that looks interactive — buttons, tabs, pills, links, cards. Specifically test: add-to-cart buttons, cart icon (does a drawer open?), product variant selectors, quantity controls.

**Hover sweep:** Hover over every element that might have hover states.

**Responsive sweep:** Test at 1440px, 768px, and 390px. Note which sections change layout and at which breakpoint.

Save all findings to `docs/research/BEHAVIORS.md`.

### Page Topology
Map out every distinct section from top to bottom. Document:
- Visual order
- Fixed/sticky overlays vs. flow content
- Overall page layout (scroll container, column structure, z-index layers)
- Dependencies between sections
- **Interaction model** of each section (static, click-driven, scroll-driven, time-driven)
- **Whether the section is data-driven** and which Storefront API resource it maps to

Save this as `docs/research/PAGE_TOPOLOGY.md`.

## Phase 2: Foundation Build

This is sequential. Do it yourself (not delegated to an agent) since it touches many files:

1. **Update fonts** in `app/root.tsx` to match the target site's actual fonts
2. **Update `app/styles/app.css`** with the target's color tokens, spacing values, keyframe animations, utility classes, Tailwind v4 theme overrides, and any global scroll behaviors
3. **Create TypeScript interfaces** in `app/types/` for content structures AND for Storefront API response shapes
4. **Set up Storefront API client** — verify `app/lib/context.ts` exports a `storefront` client properly configured with `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` from `.env`
5. **Write base GraphQL fragments** in `app/lib/fragments/` for the data topology you identified: product fragments, collection fragments, menu fragments

```graphql
# app/lib/fragments/product.ts
export const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      url
      altText
      width
      height
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
        selectedOptions {
          name
          value
        }
      }
    }
  }
`;
```

6. **Extract SVG icons** — find all inline `<svg>` elements on the page, deduplicate them, and save as named React components in `app/components/icons.tsx`
7. **Download global assets** — write and run a Node.js script (`scripts/download-assets.mjs`) that downloads all images, videos, and binary assets to `public/`
8. Verify: `npm run build` passes

### Asset Discovery Script Pattern

```javascript
// Run this via browser MCP to discover all assets
JSON.stringify({
  images: [...document.querySelectorAll('img')].map(img => ({
    src: img.src || img.currentSrc,
    alt: img.alt,
    width: img.naturalWidth,
    height: img.naturalHeight,
    parentClasses: img.parentElement?.className,
    siblings: img.parentElement ? [...img.parentElement.querySelectorAll('img')].length : 0,
    position: getComputedStyle(img).position,
    zIndex: getComputedStyle(img).zIndex
  })),
  videos: [...document.querySelectorAll('video')].map(v => ({
    src: v.src || v.querySelector('source')?.src,
    poster: v.poster,
    autoplay: v.autoplay,
    loop: v.loop,
    muted: v.muted
  })),
  backgroundImages: [...document.querySelectorAll('*')].filter(el => {
    const bg = getComputedStyle(el).backgroundImage;
    return bg && bg !== 'none';
  }).map(el => ({
    url: getComputedStyle(el).backgroundImage,
    element: el.tagName + '.' + el.className?.split(' ')[0]
  })),
  svgCount: document.querySelectorAll('svg').length,
  fonts: [...new Set([...document.querySelectorAll('*')].slice(0, 200).map(el => getComputedStyle(el).fontFamily))],
  favicons: [...document.querySelectorAll('link[rel*="icon"]')].map(l => ({ href: l.href, sizes: l.sizes?.toString() }))
});
```

## Phase 3: Component Specification & Dispatch

This is the core loop. For each section in your page topology (top to bottom), you do THREE things: **extract**, **write the spec file**, then **dispatch builders**.

### Step 1: Extract

For each section, use browser MCP to extract everything:

1. **Screenshot** the section in isolation. Save to `docs/design-references/`.

2. **Extract CSS** for every element in the section using this script:

```javascript
(function(selector) {
  const el = document.querySelector(selector);
  if (!el) return JSON.stringify({ error: 'Element not found: ' + selector });
  const props = [
    'fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','color',
    'textTransform','textDecoration','backgroundColor','background',
    'padding','paddingTop','paddingRight','paddingBottom','paddingLeft',
    'margin','marginTop','marginRight','marginBottom','marginLeft',
    'width','height','maxWidth','minWidth','maxHeight','minHeight',
    'display','flexDirection','justifyContent','alignItems','gap',
    'gridTemplateColumns','gridTemplateRows',
    'borderRadius','border','borderTop','borderBottom','borderLeft','borderRight',
    'boxShadow','overflow','overflowX','overflowY',
    'position','top','right','bottom','left','zIndex',
    'opacity','transform','transition','cursor',
    'objectFit','objectPosition','mixBlendMode','filter','backdropFilter',
    'whiteSpace','textOverflow','WebkitLineClamp'
  ];
  function extractStyles(element) {
    const cs = getComputedStyle(element);
    const styles = {};
    props.forEach(p => { const v = cs[p]; if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px' && v !== 'rgba(0, 0, 0, 0)') styles[p] = v; });
    return styles;
  }
  function walk(element, depth) {
    if (depth > 4) return null;
    const children = [...element.children];
    return {
      tag: element.tagName.toLowerCase(),
      classes: element.className?.toString().split(' ').slice(0, 5).join(' '),
      text: element.childNodes.length === 1 && element.childNodes[0].nodeType === 3 ? element.textContent.trim().slice(0, 200) : null,
      styles: extractStyles(element),
      images: element.tagName === 'IMG' ? { src: element.src, alt: element.alt, naturalWidth: element.naturalWidth, naturalHeight: element.naturalHeight } : null,
      childCount: children.length,
      children: children.slice(0, 20).map(c => walk(c, depth + 1)).filter(Boolean)
    };
  }
  return JSON.stringify(walk(el, 0), null, 2);
})('SELECTOR');
```

3. **Extract multi-state styles** — for any element with multiple states, capture BOTH states. Record the diff: "Property X changes from VALUE_A to VALUE_B, triggered by TRIGGER, with transition: TRANSITION_CSS."

4. **Extract real content** — all text, alt attributes, aria labels. For tabbed/stateful content, click each tab and extract content per state.

5. **Identify assets** — which downloaded images/videos from `public/`, which icon components from `icons.tsx`. Check for layered images.

6. **Map to Storefront API** — for data-driven sections, write the specific GraphQL query the component needs. Test it against the Storefront API to verify the shape before including in the spec.

7. **Assess complexity** — how many distinct sub-components does this section contain?

### Step 2: Write the Component Spec File

**File path:** `docs/research/components/<component-name>.spec.md`

**Template:**

```markdown
# <ComponentName> Specification

## Overview
- **Target file:** `app/components/<ComponentName>.tsx`
- **Route (if a page):** `app/routes/<route-file>.tsx`
- **Screenshot:** `docs/design-references/<screenshot-name>.png`
- **Interaction model:** <static | click-driven | scroll-driven | time-driven>
- **Data source:** <static | Storefront API — specify query name>

## DOM Structure
<Describe the element hierarchy — what contains what>

## Computed Styles (exact values from getComputedStyle)

### Container
- display: ...
- padding: ...
- maxWidth: ...

### <Child element 1>
- fontSize: ...
- color: ...

## States & Behaviors

### <Behavior name>
- **Trigger:** <exact mechanism>
- **State A (before):** <CSS values>
- **State B (after):** <CSS values>
- **Transition:** <transition CSS>
- **Implementation approach:** <CSS transition + scroll listener | IntersectionObserver | etc.>

### Hover states
- **<Element>:** <property>: <before> → <after>, transition: <value>

## Per-State Content (if applicable)
<Content per state, verbatim>

## Storefront API Integration

### GraphQL Query
```graphql
query <QueryName>($first: Int!) {
  products(first: $first) {
    nodes {
      ...ProductCard
    }
  }
}
```

### Loader Pattern
```typescript
export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {products} = await storefront.query(QUERY_NAME, {
    variables: {first: 8},
  });
  return json({products});
}
```

### Component Props
```typescript
type Props = {
  products: ProductCardFragment[];
};
```

## Assets
- Background image: `public/images/<file>.webp`
- Hydrogen components used: `<Image>`, `<Money>`, `<CartForm>` (list all)

## Text Content (verbatim)
<All text content, copy-pasted from the live site>

## Responsive Behavior
- **Desktop (1440px):** <layout description>
- **Tablet (768px):** <what changes>
- **Mobile (390px):** <what changes>
- **Breakpoint:** layout switches at ~<N>px
```

Fill every section. If a section doesn't apply, write "N/A" — but think twice. Even a footer might have a newsletter signup mutation.

### Step 3: Dispatch Builders

Based on complexity, dispatch builder agent(s) in worktree(s):

**Simple section** (1-2 sub-components): One builder agent gets the entire section.

**Complex section** (3+ distinct sub-components): Break it up. One agent per sub-component, plus one agent for the section wrapper.

**What every builder agent receives:**
- The full contents of its component spec file (inline in the prompt — never "go read the spec file")
- Path to the section screenshot in `docs/design-references/`
- Which shared components to import (`icons.tsx`, Hydrogen primitives like `<Image>`, `<Money>`)
- The target file path (e.g., `app/components/HeroSection.tsx`)
- The GraphQL query / loader pattern to use (if data-driven)
- Instruction to verify with `npx tsc --noEmit` before finishing
- **Reminder: no Next.js imports; use Remix/Hydrogen APIs only**

**Don't wait.** As soon as you've dispatched the builder(s) for one section, move to extracting the next.

### Step 4: Merge

As builder agents complete their work:
- Merge their worktree branches into main
- Resolve any conflicts intelligently
- After each merge, verify: `npm run build`
- Fix type errors immediately

## Phase 4: Route Assembly

After all sections are built and merged, wire everything together in `app/routes/_index.tsx` and any other routes identified in the topology:

```typescript
// app/routes/_index.tsx
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {Seo} from '@shopify/hydrogen';

import HeroSection from '~/components/HeroSection';
import FeaturedProducts from '~/components/FeaturedProducts';
import CollectionGrid from '~/components/CollectionGrid';

import {FEATURED_PRODUCTS_QUERY} from '~/lib/queries/featured-products';
import {COLLECTIONS_QUERY} from '~/lib/queries/collections';

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const [{products}, {collections}] = await Promise.all([
    storefront.query(FEATURED_PRODUCTS_QUERY, {variables: {first: 8}}),
    storefront.query(COLLECTIONS_QUERY, {variables: {first: 6}}),
  ]);
  return json({products, collections});
}

export default function Index() {
  const {products, collections} = useLoaderData<typeof loader>();
  return (
    <>
      <HeroSection />
      <FeaturedProducts products={products.nodes} />
      <CollectionGrid collections={collections.nodes} />
    </>
  );
}
```

- Implement page-level behaviors: scroll snap, scroll-driven animations, smooth scroll (Lenis etc.)
- Add `<Seo>` component with appropriate meta from loader data
- Verify: `npm run build` passes clean

## Phase 5: Visual QA Diff

After assembly, do NOT declare the clone complete. Take side-by-side comparison screenshots:

1. Compare section by section at desktop (1440px), then mobile (390px)
2. For each discrepancy: check the spec file, re-extract if needed, fix the component
3. **Verify Storefront API integration:**
   - Product grids show real products, not placeholder data
   - Images load via `<Image>` with correct CDN URLs
   - Prices render correctly with `<Money>` formatting
   - Add-to-cart works and updates the cart drawer/counter
   - Cart persists across page navigations
4. Test all interactive behaviors: scroll, click, hover
5. Verify smooth scroll, header transitions, tab switching, animations

Only after this visual QA pass is the clone complete.

## Pre-Dispatch Checklist

Before dispatching ANY builder agent, verify you can check every box:

- [ ] Spec file written to `docs/research/components/<name>.spec.md` with ALL sections filled
- [ ] Every CSS value is from `getComputedStyle()`, not estimated
- [ ] Interaction model is identified and documented (static / click / scroll / time)
- [ ] For stateful components: every state's content and styles are captured
- [ ] For scroll-driven components: trigger threshold, before/after styles, and transition are recorded
- [ ] For hover states: before/after values and transition timing are recorded
- [ ] All images in the section are identified (including overlays)
- [ ] Responsive behavior is documented for at least desktop and mobile
- [ ] Text content is verbatim from the site
- [ ] **If data-driven: GraphQL query is written and tested against the Storefront API**
- [ ] **If data-driven: loader function pattern is documented in the spec**
- [ ] **No Next.js imports or APIs appear anywhere in the spec**
- [ ] Builder prompt is under ~150 lines; if over, split the section

## What NOT to Do

- **Don't use Next.js APIs.** Not `next/image`, not `next/font`, not `useRouter`. A single stray `import from 'next/...'` breaks the build.
- **Don't fetch data in `useEffect`.** All Storefront API calls go in `loader` functions.
- **Don't hardcode product data.** Even in the scaffold phase, connect to the Storefront API.
- **Don't build click-based tabs when the original is scroll-driven (or vice versa).** Determine the interaction model FIRST.
- **Don't extract only the default state.** Click every tab, scroll every sticky element, hover every card.
- **Don't miss overlay/layered images.** A background watercolor + foreground UI mockup = 2 images.
- **Don't build mockup components for content that's actually videos/animations.** Check if a section uses `<video>`, Lottie, or canvas.
- **Don't approximate CSS classes.** Extract exact computed values.
- **Don't build everything in one monolithic commit.** Incremental progress with verified builds at each step.
- **Don't reference docs from builder prompts.** Each builder gets the CSS spec AND GraphQL query inline.
- **Don't skip asset extraction.** Without real images, videos, and fonts, the clone looks fake.
- **Don't give a builder agent too much scope.** Long builder prompt = signal to split.
- **Don't bundle unrelated sections into one agent.**
- **Don't skip responsive extraction.** Test at 1440, 768, and 390 during extraction.
- **Don't forget smooth scroll libraries.** Check for Lenis, Locomotive Scroll, or similar.
- **Don't dispatch builders without a spec file.**

## Completion

When done, report:
- Total sections built
- Total components created
- Total spec files written (should match components)
- Total assets downloaded (images, videos, SVGs, fonts)
- Total Storefront API queries written
- Routes created (list each with its data dependencies)
- Build status (`npm run build` result)
- Visual QA results (any remaining discrepancies)
- Cart / add-to-cart: working or known gaps
- Any known limitations
