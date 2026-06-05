# macorner-clone — Project Documentation Index

**Generated:** 2026-06-03 | **Scan Level:** Deep | **Mode:** Initial Scan

---

## Project Overview

- **Type:** Monolith (single part)
- **Primary Language:** TypeScript
- **Architecture:** Component-based SSR/Hybrid (Cloudflare Workers)
- **Data Layer:** Shopify Storefront GraphQL API only — no custom backend

---

## Quick Reference

### hydrogen-storefront

- **Type:** Web — Shopify Hydrogen
- **Tech Stack:** Hydrogen 2026.4.2 + React Router 7 + React 18 + Tailwind v4 + TypeScript 5.9
- **Root:** `hydrogen-storefront/`
- **Entry Point:** `hydrogen-storefront/server.ts` (Cloudflare Worker)
- **Architecture Pattern:** React Router SSR loaders + Hydrogen Storefront API context

### Key Commands

```bash
cd hydrogen-storefront
npm install
npm run dev        # Dev server (MiniOxygen + codegen watch)
npm run build      # Production build + codegen
npm run typecheck  # React Router typegen + tsc --noEmit
npm run codegen    # Regenerate Storefront API + route types
```

---

## Generated Documentation

- [Project Overview](./project-overview.md) — Executive summary, tech stack, architecture highlights
- [Architecture](./architecture.md) — Data flow, route architecture, component hierarchy, cache strategy
- [Source Tree Analysis](./source-tree-analysis.md) — Annotated directory structure with entry points
- [Component Inventory](./component-inventory.md) — All 25 UI components catalogued by category
- [Development Guide](./development-guide.md) — Setup, env vars, adding routes/queries/components
- [API Contracts](./api-contracts.md) — All Storefront API GraphQL queries with variables and cache strategy

---

## Existing Documentation

- [Header Component Spec](./research/components/Header.spec.md) — Pixel-match spec for header
- [Footer Component Spec](./research/components/Footer.spec.md) — Pixel-match spec for footer
- [Design References](./design-references/) — Screenshots comparing clone vs. macorner.co original

---

## Getting Started

### Understand the project

1. Read **[Project Overview](./project-overview.md)** for the full picture
2. Read **[Architecture](./architecture.md)** to understand the data flow and routing

### Start developing

1. Follow **[Development Guide](./development-guide.md)** for environment setup
2. All page data flows start in `hydrogen-storefront/app/routes/`
3. All UI components live in `hydrogen-storefront/app/components/macorner/`
4. All GraphQL queries live in `hydrogen-storefront/app/lib/graphql/`

### Add a new feature

| Task | Where to start |
|------|---------------|
| New page | `app/routes/` → add loader + component → run codegen |
| New GraphQL query | `app/lib/graphql/<domain>.ts` → import in route loader |
| New UI component | `app/components/macorner/` → use Tailwind tokens from `app/styles/app.css` |
| New design token | `app/styles/app.css` → `@theme inline` block |

### Use for brownfield PRD

When planning new features, reference this index as the primary project context entry point.

---

_Generated using BMAD Method `document-project` workflow — 2026-06-03_
