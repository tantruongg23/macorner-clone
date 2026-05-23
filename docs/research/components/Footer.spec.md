# Footer Specification (macorner.co)

> Re-extracted **2026-05-23** from live `https://macorner.co/` via Playwright MCP @ 1440×900.
> Source of truth for `app/components/macorner/Footer.tsx`.

## Overview
- **Target file:** `hydrogen-storefront/app/components/macorner/Footer.tsx`
- **Screenshot:** `docs/design-references/macorner-footer-desktop-1440.png`
- **Structure:** Newsletter (cream cap) → 4-column link grid (navy) → payment icons row → bottom terms

## Theme tokens (additions)
| Token | Value |
|---|---|
| Footer bg | `rgb(11, 42, 74)` (#0b2a4a) |
| Footer text (body) | `rgba(255, 255, 255, 0.75)` |
| Footer text (headings, col-1 links) | `rgb(255, 255, 255)` |
| Newsletter bg | `rgb(255, 248, 230)` (#FFF8E6) |
| Newsletter heading color | `rgb(11, 42, 74)` (navy on cream) |
| Newsletter input border | `rgb(243, 102, 33)` (#F36621) |
| REVEAL NOW button bg | `rgb(251, 103, 24)` (#FB6718) |
| Support Ticket button bg | `rgb(252, 101, 20)` (#FC6514) |

## DOM hierarchy

```
div.shopify-section-group-footer-group  (margin-top 60px outside footer)
├── div.footer-block--newsletter  (bg cream #FFF8E6, padding 30 0 32)
│    └── div.footer-block__newsletter.page-width
│         └── form  [Klaviyo embed in the live site; we render a static placeholder]
│              ├── h2/span "Today Only: Secret privileges for you!"
│              │     fs 30px / fw 600 / color #0b2a4a / lh 39 / text-align center / ls 0.6
│              ├── input[type=email]   410×50, border 1px solid #F36621, radius 8, pad-left 16, bg white
│              └── button "REVEAL NOW"  ~130×50, bg #FB6718, color white, fs 20 fw 700, radius 8, pad 0 10
│
└── footer.footer  (bg #0b2a4a, color rgba(255,255,255,0.75), margin-top 60)
     ├── div.footer__content-top  (padding 60 50, max-width 1440)
     │    └── div.footer__blocks-wrapper  (flex, gap 80px, justify-content center, width 1325)
     │         ├── div.footer-block--menu  (col 1, 280px, "Shop Occasion" hidden h2)
     │         │    └── 5 × a.list-menu__item  (flex justify-between, padding 5 0, fs 18 fw 400, color white, capitalize, border-bottom 1px solid white, lh 27, gap 12)
     │         │         └── [Gift Finder] | [Shop By Product ▼] | [Shop By Occasion ▼] | [Shop By Recipient ▼] | [Shop By Hobby ▼]
     │         │         └── trailing svg 16x16 chevron-down for Shop By X items
     │         ├── div.footer-block--menu  (col 2, 177px, "Macorner")
     │         │    ├── h2.footer-block__heading  fs 18 fw 500 color white margin-bottom 15
     │         │    └── 3 × a.list-menu__item  fs 14 fw 400 lh 25.2 color rgba(255,255,255,0.75) capitalize
     │         │         └── [About Us] [Privacy Policy] [Accessibility Statement]
     │         ├── div.footer-block--menu  (col 3, 274px, "Help and Support")
     │         │    ├── h2  same as col 2 (18/500 white)
     │         │    └── 7 × a  same as col 2 styling
     │         │         └── [Return Policy] [Help Center] [Size Chart] [Shipping And Delivery]
     │         │             [Cancellation & Modification Policy] [Refund & Replacement Policy]
     │         │             [Disclaimer Regarding Fake Websites]
     │         └── div.footer-block  (col 4, 276px, "GET IN TOUCH")
     │              ├── h2.footer-block__heading  fs 16 fw 600 color white margin-bottom 15
     │              ├── p "Support Time: 9 AM to 5 PM, Mon-Sat"  fs 14 fw 400 lh 20 color white
     │              ├── a.support-ticket "Open A Support Ticket"
     │              │     bg #FC6514, color white, padding 10 25, radius 10, fs 15 fw 600, margin 20 0, inline-block, text-align center
     │              └── ul.footer-block-social  (flex row, 6 items)
     │                   └── li > a (padding 11)
     │                        └── svg 22×23 white  [Facebook, Instagram, Amazon, X (Twitter), TikTok, Pinterest]
     │
     ├── div.footer__payment  (margin 0 37.5px, 1350 wide)
     │    └── 13 payment provider icons (Amex, Apple Pay, Bancontact, Diners, Discover, Google Pay, iDEAL, MasterCard, PayPal, Shop, Venmo, Visa, DMCA)
     │
     └── div.footer__content-bottom  (centered text row)
          └── "Terms Of Services • Privacy Policy • MA Commerce Inc."  white text fs ~14
```

## Computed styles (key)

### `.footer-block--newsletter`
- background-color: `rgb(255, 248, 230)`
- padding: `30px 0px 32px`

### Newsletter heading
- text: `"Today Only: Secret privileges for you!"`
- fontSize: `30px`; fontWeight: `600`; color: `rgb(11, 42, 74)`
- lineHeight: `39px`; letterSpacing: `0.6px`; textAlign: `center`

### Newsletter input
- size: `410 × 50`
- padding: `0 0 0 16px`
- border: `1px solid rgb(243, 102, 33)`; borderRadius: `8px`
- background: white; color: black

### REVEAL NOW button (Klaviyo-styled)
- background-color: `rgb(251, 103, 24)` (#FB6718)
- color: white; fontSize: `20px`; fontWeight: `700`
- padding: `0 10px`; borderRadius: `8px`; height 50

### `footer.footer`
- background: `rgb(11, 42, 74)`
- color: `rgba(255, 255, 255, 0.75)`
- margin-top: `60px`
- font: Poppins 16 / 24 / 0.6px

### `.footer__content-top`
- padding: `60px 50px`; max-width: `1440px`

### `.footer__blocks-wrapper`
- display: `flex`; gap: `80px`; justify-content: `center`
- width: 1325 (within max-1440 with 50px x-padding)

### Column-1 links (`.footer-block--menu` link, "shop-by")
- 280px wide, height 48
- display: `flex`; justify-content: `space-between`; align-items: `center`; gap: `12px`
- padding: `5px 0` (with `0 0 5px` on the Gift Finder one — same effect)
- font: 18 / fw 400 / lh 27 / capitalize / letterSpacing 0.6
- color: `rgb(255, 255, 255)`
- border-bottom: `1px solid rgb(255, 255, 255)`
- trailing `svg 16×16` chevron for "Shop By X" items only

### Column-2/3 headings (`.footer-block__heading`)
- fontSize: `18px`; fontWeight: `500`; color: white
- lineHeight: `23.4px`; letterSpacing: `0.6px`
- margin: `0 0 15px`

### Column-2/3 links
- display: inline-block
- font: `14px` / `400` / lineHeight `25.2px`
- color: `rgba(255, 255, 255, 0.75)`
- textTransform: `capitalize`
- padding: `0 0 5px`

### Column-4 heading "GET IN TOUCH"
- fontSize: `16px`; fontWeight: `600` (smaller than other column headings)
- color white; ls 0.6; margin-bottom 15

### "Open A Support Ticket"
- a.support-ticket — inline-block
- background: `rgb(252, 101, 20)` (#FC6514)
- color: white; fontSize: `15px`; fontWeight: `600`
- padding: `10px 25px`; borderRadius: `10px`
- margin: `20px 0`; textAlign: center

### Social links
- `ul.footer-block-social` — flex row
- Each `li > a` padding: `11px` (no background, no border, just spacing around the svg)
- SVG: `22 × 23`, white fill
- 6 platforms: Facebook, Instagram, Amazon, X (Twitter), TikTok, Pinterest

### Payment row
- container `.footer__payment`: margin `0 37.5px`, width 1350, height ~16
- 13 small payment-provider images

### Bottom text
- "Terms Of Services • Privacy Policy • MA Commerce Inc."
- Centered, white text

## Global behaviors
- **All `<a>` tags have `text-decoration: none`** site-wide (confirmed by inspecting a freshly-created anchor — global rule).
- Footer links keep their color on hover (no underline added).
- Body font/text sizes shrink on mobile: body goes from `16px/24` to `15px/22.5`.

## Defects vs current Footer.tsx
| Current | Should be |
|---|---|
| `bg-[#0B2A4A]` ✓ | Keep; add `--color-footer-bg` token |
| `container-macorner` max 1280 | Use max-1440 with `padding 60 50` (footer__content-top) |
| `grid grid-cols-5` | flex with `gap: 80px`, `justify-content: center` |
| Column heading: 13px uppercase | 18px / fw 500, NOT uppercase |
| Column links: 13px white/70 | Col 1: 18px white border-bottom; Cols 2-3: 14px white/75 |
| Social icons: 36×36 white/10 bg rounded full | NO background; just padding 11 around 22×23 white svg |
| Has `border-t white/10` separator | No — content-bottom is on the navy bg directly |
| Missing newsletter section | Add cream "Today Only" newsletter with input + REVEAL NOW |
| Missing payment icons row | Add row of 13 payment icons |
| Wrong copyright text | "Terms Of Services • Privacy Policy • MA Commerce Inc." |
| Hover orange `#F7921F` | Use `#FC6514` |
| Col 1 links missing chevron | Add chevron-down on "Shop By X" items |
| Heading "Get In Touch" mixed-case | Source text "GET IN TOUCH" (already uppercase) |
