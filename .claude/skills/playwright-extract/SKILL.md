---
name: playwright-extract
description: "Extract a live webpage's full design system — computed CSS, screenshots, DOM structure, hover/scroll states, assets, and product data — then build the matching Hydrogen component or route. Works with Playwright MCP (live automation) or falls back to a generated Node.js script the user runs themselves. Use when the user wants to clone a page, extract UI details, screenshot a live site, or reverse-engineer a design before building. Triggers: 'extract this page', 'screenshot and build', 'clone this UI', 'get the CSS from', 'reverse-engineer this page'."
argument-hint: "<url> [--route <route-file>] [--component <ComponentName>]"
user-invocable: true
---

# Playwright Extract → Build

Extract a live page's complete design specification and build the matching Hydrogen component or route.

**Arguments:**
- `<url>` — the page to extract (required)
- `--route <file>` — target route, e.g. `collections.$handle.tsx` (optional, inferred if omitted)
- `--component <Name>` — primary component name (optional, inferred if omitted)

---

## Step 1 — Browser Automation Check

Check for any available browser MCP tool by attempting a simple tool call. Look for: Playwright MCP, Chrome MCP, Browserbase MCP, Puppeteer MCP.

**If a browser MCP is available → use [Live Path](#live-path).**
**If no browser MCP is available → use [Script Path](#script-path).**

---

## Live Path

*Use this when a Playwright/Chrome MCP tool is in the session.*

### 1a. Navigate & Screenshot

```
Navigate to $ARGUMENTS (desktop 1440×900)
Take full-page screenshot → docs/design-references/<slug>-desktop.png

Resize to 390×844 (mobile)
Take full-page screenshot → docs/design-references/<slug>-mobile.png
```

### 1b. Run the extraction sweep inline

Execute the full extraction JS (see **Extraction JS Library** below) directly via the browser MCP `evaluate` command. Capture:

1. Global tokens (colors, fonts, font sizes)
2. Page topology (all top-level sections with tag/class/rect)
3. Asset inventory (all img src, background-image URLs, SVGs)
4. Section-by-section computed styles (run `extractEl` on each section, depth 3–4)
5. Product/collection data if visible (titles, prices, hrefs, image URLs)
6. Scroll behavior: header styles at scroll=0 vs scroll=300
7. Hover states: card before/after hover

Save each capture to `docs/research/<slug>-<section>.json`.

### 1c. Download assets

For each CDN image URL discovered, download to `hydrogen-storefront/public/images/`.

### 1d. Proceed to [Build Phase](#build-phase).

---

## Script Path

*Use this when no browser MCP is available. Generate a Node.js script the user runs locally.*

### 2a. Create the output directories

```
docs/design-references/
docs/research/
docs/research/components/
hydrogen-storefront/public/images/
scripts/
```

### 2b. Generate the extraction script

Write `scripts/extract-<slug>.mjs` using the **Script Template** below, substituting `$ARGUMENTS` as the target URL.

The script must capture everything in §1b above. Use `headless: false` so the user can see it working.

### 2c. Create scripts/package.json (if it doesn't exist)

```json
{
  "name": "extraction-scripts",
  "private": true,
  "type": "module",
  "dependencies": { "playwright": "^1.49.0" }
}
```

### 2d. Instruct the user

Tell the user:

```
Run these commands, then come back:

  cd scripts
  npm install
  npx playwright install chromium
  node extract-<slug>.mjs

When done, the results will be in docs/research/. Reply here and I will build the page.
```

### 2e. Wait for user confirmation

When the user says the script finished (or pastes output), read all JSON files from `docs/research/` and screenshots from `docs/design-references/`, then proceed to [Build Phase](#build-phase).

---

## Build Phase

*Runs after extraction data is available (either path).*

### 3a. Write spec files

For each distinct section found in the topology, write `docs/research/components/<ComponentName>.spec.md`:

```markdown
# <ComponentName> Specification

## Overview
- Target file: app/components/<ComponentName>.tsx
- Route (if page): app/routes/<route>.tsx
- Screenshot: docs/design-references/<slug>-<section>.png
- Interaction model: <static | click-driven | scroll-driven>
- Data source: <static | Storefront API — query name>

## DOM Structure
<hierarchy from extractEl output>

## Computed Styles
<exact values from getComputedStyle — no estimates>

## States & Behaviors
<hover, scroll, click transitions — before/after values>

## Storefront API Integration
<GraphQL query + loader pattern if data-driven>

## Assets
<local public/ paths for all images used>

## Text Content (verbatim)
<all visible text from the extraction>

## Responsive Behavior
- Desktop 1440px: <layout>
- Mobile 390px: <layout>
```

### 3b. Determine build targets

From the URL and topology, identify:
- If it's a **collection page** → create/update `app/routes/collections.$handle.tsx`
- If it's a **product page** → `app/routes/products.$handle.tsx`
- If it's a **home page** → `app/routes/_index.tsx`
- Otherwise → infer from URL path

For each section with > 2 sub-components, plan one builder agent per sub-component.

### 3c. Write the GraphQL queries

For any data-driven section (product grids, collection info, filters):

```graphql
# Collection page — minimal query
query CollectionPage($handle: String!, $first: Int!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
  collection(handle: $handle) {
    id
    title
    description
    image { url altText width height }
    products(first: $first, sortKey: $sortKey, reverse: $reverse) {
      nodes {
        id
        title
        handle
        availableForSale
        priceRange { minVariantPrice { amount currencyCode } }
        compareAtPriceRange { minVariantPrice { amount currencyCode } }
        featuredImage { url altText width height }
        variants(first: 1) {
          nodes { id availableForSale selectedOptions { name value } }
        }
        tags
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}
```

Always use `storefront.query()` in the `loader` function — never `useEffect`.

### 3d. Dispatch builder agents in parallel

For each spec file, dispatch a builder agent (in a worktree) with:
- The full spec file contents inline
- Path to the relevant screenshot
- The GraphQL query and loader pattern
- Target file path
- Instruction: `npx tsc --noEmit` must pass before finishing
- Stack reminder: Hydrogen + Remix, no Next.js, `<Image>` from `@shopify/hydrogen`

Never give a builder agent more than ~150 lines of spec. Split complex sections.

### 3e. Merge and verify

After each agent finishes:
1. Merge the worktree
2. Run `npm run build` — fix any type errors before continuing
3. Wire the component into the route's loader + JSX

### 3f. Visual QA

Take a new screenshot of the running local dev server and compare side-by-side with `docs/design-references/<slug>-desktop.png`. Fix any discrepancies.

---

## Extraction JS Library

Inject this into the page before any `extractEl` calls:

```javascript
const EXTRACT_PROPS = [
  'display','flexDirection','flexWrap','justifyContent','alignItems','alignSelf','gap',
  'gridTemplateColumns','gridTemplateRows',
  'position','top','right','bottom','left','zIndex',
  'width','height','minWidth','maxWidth','minHeight','maxHeight',
  'padding','paddingTop','paddingRight','paddingBottom','paddingLeft',
  'margin','marginTop','marginRight','marginBottom','marginLeft',
  'backgroundColor','background','backgroundImage','backgroundSize','backgroundPosition',
  'color','fontSize','fontWeight','fontFamily','lineHeight','letterSpacing',
  'textTransform','textDecoration','textAlign','whiteSpace','textOverflow',
  'borderRadius','border','borderTop','borderBottom','borderLeft','borderRight',
  'boxShadow','opacity','transform','transition','overflow','overflowX','overflowY',
  'objectFit','objectPosition','cursor','filter','backdropFilter','aspectRatio',
];

function extractEl(selectorOrEl, depth = 3) {
  const el = typeof selectorOrEl === 'string'
    ? document.querySelector(selectorOrEl)
    : selectorOrEl;
  if (!el) return null;
  function styles(e) {
    const cs = window.getComputedStyle(e);
    const out = {};
    EXTRACT_PROPS.forEach(p => {
      const v = cs[p];
      if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px'
          && v !== 'rgba(0, 0, 0, 0)' && v !== 'visible' && v !== 'static') out[p] = v;
    });
    return out;
  }
  function walk(e, d) {
    if (d < 0) return null;
    const r = e.getBoundingClientRect();
    return {
      tag: e.tagName.toLowerCase(),
      id: e.id || undefined,
      classes: e.className?.toString().trim() || undefined,
      text: e.children.length === 0 ? e.textContent?.trim().slice(0, 300) : undefined,
      href: e.tagName === 'A' ? e.href : undefined,
      src: e.tagName === 'IMG' ? e.src : undefined,
      alt: e.tagName === 'IMG' ? e.alt : undefined,
      rect: { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) },
      styles: styles(e),
      children: [...e.children].slice(0, 15).map(c => walk(c, d-1)).filter(Boolean),
    };
  }
  return walk(el, depth);
}
```

---

## Script Template

```javascript
/**
 * Auto-generated extraction script
 * Target: TARGET_URL
 *
 * Usage:
 *   cd scripts && npm install && npx playwright install chromium
 *   node extract-SLUG.mjs
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const REFS = path.join(ROOT, 'docs', 'design-references');
const RESEARCH = path.join(ROOT, 'docs', 'research');
const PUBLIC_IMAGES = path.join(ROOT, 'hydrogen-storefront', 'public', 'images');
const TARGET = 'TARGET_URL';

for (const d of [REFS, RESEARCH, path.join(RESEARCH,'components'), PUBLIC_IMAGES])
  fs.mkdirSync(d, { recursive: true });

const save = (f, d) => {
  fs.writeFileSync(f, typeof d === 'string' ? d : JSON.stringify(d, null, 2));
  console.log(' saved:', path.relative(ROOT, f));
};

async function dl(url, dest) {
  return new Promise((res, rej) => {
    const f = fs.createWriteStream(dest);
    https.get(url, r => {
      if (r.statusCode === 301 || r.statusCode === 302) { f.close(); dl(r.headers.location, dest).then(res).catch(rej); return; }
      r.pipe(f); f.on('finish', () => { f.close(); res(); });
    }).on('error', e => { fs.unlink(dest, () => {}); rej(e); });
  });
}

// ── INJECT THIS BEFORE ANY extractEl CALLS ──
const INJECT = `
const EXTRACT_PROPS=['display','flexDirection','flexWrap','justifyContent','alignItems','alignSelf','gap','gridTemplateColumns','gridTemplateRows','position','top','right','bottom','left','zIndex','width','height','minWidth','maxWidth','minHeight','maxHeight','padding','paddingTop','paddingRight','paddingBottom','paddingLeft','margin','marginTop','marginRight','marginBottom','marginLeft','backgroundColor','background','backgroundImage','backgroundSize','backgroundPosition','color','fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','textTransform','textDecoration','textAlign','whiteSpace','textOverflow','borderRadius','border','borderTop','borderBottom','borderLeft','borderRight','boxShadow','opacity','transform','transition','overflow','overflowX','overflowY','objectFit','objectPosition','cursor','filter','backdropFilter','aspectRatio'];
function extractEl(sel,depth=3){const el=typeof sel==='string'?document.querySelector(sel):sel;if(!el)return null;function st(e){const cs=window.getComputedStyle(e);const o={};EXTRACT_PROPS.forEach(p=>{const v=cs[p];if(v&&v!=='none'&&v!=='normal'&&v!=='auto'&&v!=='0px'&&v!=='rgba(0, 0, 0, 0)'&&v!=='visible'&&v!=='static')o[p]=v;});return o;}function walk(e,d){if(d<0)return null;const r=e.getBoundingClientRect();return{tag:e.tagName.toLowerCase(),id:e.id||undefined,classes:e.className?.toString().trim()||undefined,text:e.children.length===0?e.textContent?.trim().slice(0,300):undefined,href:e.tagName==='A'?e.href:undefined,src:e.tagName==='IMG'?e.src:undefined,alt:e.tagName==='IMG'?e.alt:undefined,rect:{x:Math.round(r.x),y:Math.round(r.y+scrollY),w:Math.round(r.width),h:Math.round(r.height)},styles:st(e),children:[...e.children].slice(0,15).map(c=>walk(c,d-1)).filter(Boolean)};}return walk(el,depth);}
`;

async function run() {
  const browser = await chromium.launch({ headless: false, slowMo: 50 });

  // ── Desktop ──
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(TARGET, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(REFS, 'SLUG-desktop.png'), fullPage: true });
  console.log('screenshot: SLUG-desktop.png');

  // Trigger lazy loads
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  await page.evaluate(INJECT);

  // ── Global tokens ──
  save(path.join(RESEARCH, 'SLUG-globals.json'), await page.evaluate(() => {
    const els = [...document.querySelectorAll('*')].slice(0, 400);
    const colors = new Set(), fonts = new Set(), sizes = new Set();
    els.forEach(e => {
      const cs = getComputedStyle(e);
      if (cs.color !== 'rgba(0, 0, 0, 0)') colors.add(cs.color);
      if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)') colors.add(cs.backgroundColor);
      fonts.add(cs.fontFamily); sizes.add(cs.fontSize);
    });
    return { colors:[...colors], fonts:[...fonts], sizes:[...sizes], title:document.title,
      googleFonts:[...document.querySelectorAll('link[href*="fonts.google"]')].map(l=>l.href) };
  }));

  // ── Assets ──
  save(path.join(RESEARCH, 'SLUG-assets.json'), await page.evaluate(() => ({
    images: [...document.querySelectorAll('img')].map(i=>({src:i.src,alt:i.alt,w:i.naturalWidth,h:i.naturalHeight,classes:i.className})),
    bgImages: [...document.querySelectorAll('*')].filter(e=>getComputedStyle(e).backgroundImage!=='none').slice(0,30).map(e=>({url:getComputedStyle(e).backgroundImage,tag:e.tagName,classes:e.className?.toString().slice(0,80)})),
    svgs: [...document.querySelectorAll('svg')].slice(0,20).map(s=>({html:s.outerHTML.slice(0,400),classes:s.className?.toString(),parent:s.parentElement?.className?.toString()})),
  })));

  // ── Page topology ──
  save(path.join(RESEARCH, 'SLUG-topology.json'), await page.evaluate(() =>
    [...document.body.children].filter(e=>e.getBoundingClientRect().height>20).map((e,i)=>{
      const r=e.getBoundingClientRect();
      return {i,tag:e.tagName.toLowerCase(),id:e.id,classes:e.className?.toString().slice(0,100),
        rect:{w:Math.round(r.width),h:Math.round(r.height),y:Math.round(r.top+scrollY)},
        imgs:e.querySelectorAll('img').length,btns:e.querySelectorAll('button').length,
        links:e.querySelectorAll('a').length,text:e.textContent?.trim().slice(0,80)};
    })
  ));

  // ── Section extractions ──
  const sections = [
    ['header','header, [class*="header"]',3],
    ['main','main, #MainContent, [class*="collection"]',4],
    ['product-card','[class*="product-card"], li.grid__item:first-child',3],
    ['filter','[class*="filter"], aside, [class*="facet"]',4],
    ['pagination','[class*="pagination"], [class*="load-more"]',2],
    ['footer','footer',3],
  ];
  for (const [name, sel, depth] of sections) {
    const data = await page.evaluate(([s,d]) => extractEl(s,d), [sel, depth]);
    if (data) save(path.join(RESEARCH, `SLUG-${name}.json`), data);
  }

  // ── Product cards data ──
  save(path.join(RESEARCH, 'SLUG-products.json'), await page.evaluate(() =>
    [...document.querySelectorAll('[class*="product-card"], li.grid__item, [class*="card--product"]')].slice(0,20).map(c=>({
      title: c.querySelector('[class*="title"],h2,h3,h4')?.textContent?.trim(),
      price: c.querySelector('[class*="price"]')?.textContent?.trim(),
      src: c.querySelector('img')?.src,
      alt: c.querySelector('img')?.alt,
      href: c.querySelector('a')?.href,
      badge: c.querySelector('[class*="badge"],[class*="label"]')?.textContent?.trim(),
    }))
  ));

  // ── Scroll behavior ──
  const hBefore = await page.evaluate(() => { const h=document.querySelector('header,[class*="header"]'); if(!h)return null; const cs=getComputedStyle(h); return {bg:cs.backgroundColor,shadow:cs.boxShadow,h:cs.height,pos:cs.position}; });
  await page.evaluate(() => window.scrollTo(0,300));
  await page.waitForTimeout(500);
  const hAfter = await page.evaluate(() => { const h=document.querySelector('header,[class*="header"]'); if(!h)return null; const cs=getComputedStyle(h); return {bg:cs.backgroundColor,shadow:cs.boxShadow,h:cs.height,pos:cs.position}; });
  save(path.join(RESEARCH, 'SLUG-scroll.json'), { headerBefore:hBefore, headerAfter:hAfter });
  await page.evaluate(() => window.scrollTo(0,0));

  // ── Hover states ──
  const cardSel = '[class*="product-card"], li.grid__item:first-child';
  const hov0 = await page.evaluate(s => {
    const c=document.querySelector(s); if(!c)return null;
    const img=c.querySelector('img'), btn=c.querySelector('button');
    return {card:{tr:getComputedStyle(c).transition,sh:getComputedStyle(c).boxShadow,tf:getComputedStyle(c).transform},img:img?{tr:getComputedStyle(img).transition,tf:getComputedStyle(img).transform}:null,btn:btn?{op:getComputedStyle(btn).opacity,vis:getComputedStyle(btn).visibility}:null};
  }, cardSel);
  const card = await page.$(cardSel);
  if (card) { await card.hover(); await page.waitForTimeout(400); }
  const hov1 = await page.evaluate(s => {
    const c=document.querySelector(s); if(!c)return null;
    const img=c.querySelector('img'), btn=c.querySelector('button');
    return {card:{tr:getComputedStyle(c).transition,sh:getComputedStyle(c).boxShadow,tf:getComputedStyle(c).transform},img:img?{tr:getComputedStyle(img).transition,tf:getComputedStyle(img).transform}:null,btn:btn?{op:getComputedStyle(btn).opacity,vis:getComputedStyle(btn).visibility}:null};
  }, cardSel);
  save(path.join(RESEARCH, 'SLUG-hover.json'), { before:hov0, after:hov1 });

  // ── Section screenshots ──
  await page.evaluate(() => window.scrollTo(0,0));
  for (const [name, sel] of sections.slice(0,5)) {
    try {
      const el = await page.$(sel);
      if (!el) continue;
      const box = await el.boundingBox();
      if (!box || box.height === 0) continue;
      await page.evaluate(s => document.querySelector(s)?.scrollIntoView({block:'center'}), sel);
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(REFS, `SLUG-${name}.png`),
        clip:{ x:0, y:Math.max(0,box.y-8), width:1440, height:Math.min(box.height+16,2000) } });
    } catch {}
  }

  // ── Mobile ──
  const mCtx = await browser.newContext({ viewport:{width:390,height:844}, userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1' });
  const mPage = await mCtx.newPage();
  await mPage.goto(TARGET, { waitUntil:'networkidle', timeout:30000 });
  await mPage.waitForTimeout(1500);
  await mPage.screenshot({ path:path.join(REFS,'SLUG-mobile.png'), fullPage:true });

  // ── Download images ──
  const imgs = JSON.parse(fs.readFileSync(path.join(RESEARCH,'SLUG-assets.json'),'utf8')).images;
  for (const img of imgs.filter(i=>i.w>100&&i.src?.startsWith('https://cdn.shopify.com')).slice(0,10)) {
    try {
      const fname = path.basename(new URL(img.src).pathname);
      const dest = path.join(PUBLIC_IMAGES, fname);
      if (!fs.existsSync(dest)) { await dl(img.src, dest); console.log(' img:', fname); }
    } catch {}
  }

  await browser.close();
  console.log('\nDone. Files in docs/research/ and docs/design-references/');
}

run().catch(e => { console.error(e); process.exit(1); });
```

---

## Hydrogen Constraints (remind every builder)

- All Storefront API calls in `loader` functions — never `useEffect`
- `<Image>` from `@shopify/hydrogen` — never raw `<img>` for product images
- `<Money>` from `@shopify/hydrogen` for prices
- Cart mutations via `CartForm` from `@shopify/hydrogen`
- Routes in `app/routes/` with Remix file conventions
- No `next/*` imports anywhere
- TypeScript — `npx tsc --noEmit` must pass

## Collection Route Loader Pattern

```typescript
// app/routes/collections.$handle.tsx
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {json} from '@shopify/remix-oxygen';

const COLLECTION_QUERY = `#graphql
  query CollectionPage($handle: String!, $first: Int!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
    collection(handle: $handle) {
      id title description
      image { url altText width height }
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
        nodes {
          id title handle availableForSale
          priceRange { minVariantPrice { amount currencyCode } }
          compareAtPriceRange { minVariantPrice { amount currencyCode } }
          featuredImage { url altText width height }
          variants(first: 1) { nodes { id availableForSale } }
          tags
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
` as const;

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {handle} = params;
  if (!handle) throw new Response('Not Found', {status: 404});
  const url = new URL(request.url);
  const sortKey = url.searchParams.get('sort') as any ?? 'BEST_SELLING';
  const reverse = url.searchParams.get('reverse') === 'true';
  const {collection} = await context.storefront.query(COLLECTION_QUERY, {
    variables: {handle, first: 24, sortKey, reverse},
    cache: context.storefront.CacheShort(),
  });
  if (!collection) throw new Response('Not Found', {status: 404});
  return json({collection});
}
```
