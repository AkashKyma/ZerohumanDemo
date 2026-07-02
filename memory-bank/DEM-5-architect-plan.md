# DEM-5 Architect Plan

## Issue
DEM-5 - Add product management items to ecommerce app and send all agent reports to Slack.

## Executive read
The ecommerce product-management feature is already substantially implemented in the current codebase. This phase should therefore be treated as a **verification + gap-closing + reporting** pass rather than a greenfield build.

The required product fields and flows already exist in the repo:
- name
- description
- price
- category
- stock quantity
- active status
- UI display
- add flow
- edit flow
- stock update flow
- active/inactive toggle

The main remaining work for downstream roles is to:
1. verify acceptance criteria end-to-end,
2. fix any edge-case gaps found during testing,
3. ensure docs still match the shipped behavior,
4. satisfy the mandatory Slack reporting requirement for each role.

## Current stack
- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Vitest + Testing Library
- Browser-local persistence via `localStorage`

## Evidence found in repo
### Existing management/data layer
- `lib/product-management.ts`
  - normalized product shape
  - `stockQuantity`
  - `isActive`
  - create/update helpers
  - stock update helper
  - active toggle helper
  - browser persistence helpers

### Existing management UI
- `app/products/manage/page.tsx`
- `components/ProductManagementDashboard.tsx`
- `components/ProductForm.tsx`
- `components/ProductInventoryTable.tsx`

### Existing storefront integration
- `components/ManagedCatalog.tsx`
- `app/products/page.tsx`
- `types/product.ts`
- `lib/products.ts`

### Existing tests/docs
- `src/__tests__/product-management.test.ts`
- `README.md`
- `docs/IMPLEMENTATION_NOTES.md`
- `CHANGELOG.md`

## Architecture assessment
### Product model
Current `Product` type already includes:
- `name`
- `description`
- `price`
- `category`
- `stockQuantity`
- `isActive`

### Persistence strategy
The app uses a simple browser-local catalog store based on:
- seed data from `data/products.json`
- runtime normalization in `lib/product-management.ts`
- persistence via `window.localStorage`

This is a good fit for the stated requirement to stay simple, usable, and production-clean within a demo/storefront app that does not yet have a backend catalog write path.

### UI strategy
The app already separates:
- shopper-facing catalog display
- internal management UI
- quick inventory operations
- add/edit form behavior

That structure is good and should be preserved.

## Gaps to verify first
Grunt should not rewrite the feature blindly. Verify these exact points first:

1. **Shopper-facing catalog uses managed state consistently**
   - confirm active-only filtering everywhere customer-facing
   - confirm inactive products do not leak into listing/detail/related views

2. **Product detail behavior for inactive products**
   - verify route behavior when a product is inactive or missing
   - expected outcome: graceful UX, not crashy/broken navigation

3. **Cart compatibility with managed stock**
   - verify add-to-cart respects `stockQuantity`
   - verify zero-stock products cannot be added
   - verify cart quantity clamping still works when stock changes

4. **Form/input hardening**
   - validate negative stock handling
   - validate price normalization
   - validate add/edit slug uniqueness behavior
   - validate empty/trimmed text handling

5. **Docs consistency**
   - check DEM naming consistency where needed
   - confirm docs describe browser-local persistence limitation clearly

6. **Slack reporting path**
   - determine whether runtime exposes a Slack destination
   - if a destination exists, each role must send its own report before exit
   - if no destination exists, each role must emit `SLACK_FAILED: <reason>` exactly as required

## Implementation strategy for Grunt
Treat the next phase as a targeted audit + fix pass.

### Phase A - verify before changing
Run:
- `npm test`
- `npm run build`

Then manually inspect the following flows in code and, if needed, locally in app behavior:
- `/products`
- `/products/manage`
- `/products/[slug]`
- cart interactions

### Phase B - only patch real gaps
If testing reveals issues, prioritize these files/areas:
- `lib/products.ts`
  - likely place to ensure shopper-facing lookups/filtering remain active-safe
- `components/ProductCard.tsx`
- `components/ProductDetailView.tsx`
- `components/ManagedCatalog.tsx`
- `context/CartContext.tsx`
- `lib/cart.ts`
- `src/__tests__/product-management.test.ts`
- related cart/detail tests under `src/__tests__/`

### Phase C - keep scope tight
Do **not** replace the current architecture with a server-backed system.
Do **not** introduce admin auth, database writes, or API routes unless a hard blocker proves the current structure cannot satisfy acceptance criteria.
Do **not** refactor the whole catalog flow just because it can be cleaner.

## Recommended acceptance checklist for Grunt/Pedant
- products are visible in UI
- add product works
- edit product works
- stock updates persist
- active/inactive toggle persists
- shopper catalog shows only active items
- stock-aware shopper/cart behavior remains sane
- tests pass
- build passes
- docs match implementation
- Slack report sent, or explicit `SLACK_FAILED: <reason>` emitted

## Impacted files/areas
Primary verification/fix surface:
- `app/products/manage/page.tsx`
- `app/products/page.tsx`
- `app/products/[slug]/page.tsx`
- `components/ProductManagementDashboard.tsx`
- `components/ProductForm.tsx`
- `components/ProductInventoryTable.tsx`
- `components/ManagedCatalog.tsx`
- `components/ProductCard.tsx`
- `components/ProductDetailView.tsx`
- `lib/product-management.ts`
- `lib/products.ts`
- `lib/cart.ts`
- `context/CartContext.tsx`
- `types/product.ts`
- `data/products.json`
- `src/__tests__/product-management.test.ts`
- cart/detail related tests
- `README.md`
- `docs/IMPLEMENTATION_NOTES.md`
- `CHANGELOG.md`

## Slack report payload for Architect
Use this exact content if a Slack destination becomes available:

ARCHITECT_REPORT:
- issue ID: DEM-5
- plan: Verify the already-implemented product-management flow, close any edge-case gaps, confirm shopper/catalog/cart consistency, and keep the architecture browser-local and simple.
- impacted files/areas: app/products/manage, app/products, app/products/[slug], product-management components, lib/product-management.ts, lib/products.ts, cart state/helpers, tests, README/docs.
- implementation strategy: audit first, patch only real gaps, rerun tests/build, then hand off to Pedant and Scribe.

## Slack status
No Slack destination was discoverable in repo files or environment during this phase. If runtime does not surface one at execution time, downstream roles must use the required explicit failure format.
