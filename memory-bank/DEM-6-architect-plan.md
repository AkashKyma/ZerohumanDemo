# DEM-6 Architect Plan

## Scope verdict
This checkout already contains a merged implementation for the requested product-management feature set under earlier DEM-4 naming. The architect handoff for DEM-6 is therefore **not a greenfield build plan**; it is a **reconciliation + verification plan** for Grunt:

1. verify the shipped implementation matches the DEM-6 acceptance criteria,
2. close any small gaps,
3. keep docs/reporting aligned with DEM-6,
4. preserve the current simple browser-local architecture.

## Current stack
- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Zod
- Vitest + Testing Library
- Browser-local persistence via `localStorage`

## Current implementation already present
Confirmed in the repo:
- product type includes `name`, `description`, `price`, `category`, `stockQuantity`, `isActive`
- product-management utility layer exists in `lib/product-management.ts`
- shopper-facing managed catalog exists in `components/ManagedCatalog.tsx`
- management route exists at `app/products/manage/page.tsx`
- add/edit form exists in `components/ProductForm.tsx`
- stock update + active toggle controls exist in `components/ProductInventoryTable.tsx`
- management dashboard orchestration exists in `components/ProductManagementDashboard.tsx`
- tests for product-management utilities already exist in `src/__tests__/product-management.test.ts`
- docs already mention the feature in `README.md` and `docs/IMPLEMENTATION_NOTES.md`

## Architecture summary
### Data layer
- `lib/product-management.ts` is the source of truth for catalog normalization, slug generation, stock clamping, active/inactive state, and `localStorage` persistence.
- Seed data still provides the default catalog fallback.

### UI layer
- `/products/manage` is the internal management surface.
- The dashboard is split cleanly into:
  - product create/edit form
  - storefront preview of active products
  - inventory/status controls
- Shopper-facing catalog reads from the managed product set and filters inactive items.

### Domain model
The catalog contract is already production-clean for this app shape:
- required business fields present
- stock normalized to non-negative integers
- active state isolated from display logic
- slug generation handled centrally

## Plan for Grunt
### Phase 1: audit current feature against acceptance
Review these areas first before changing anything:
- `types/product.ts`
- `lib/product-management.ts`
- `components/ProductManagementDashboard.tsx`
- `components/ProductForm.tsx`
- `components/ProductInventoryTable.tsx`
- `components/ManagedCatalog.tsx`
- `app/products/manage/page.tsx`
- `README.md`
- `docs/IMPLEMENTATION_NOTES.md`
- `src/__tests__/product-management.test.ts`

Audit checklist:
- products show clearly in shopper UI
- add flow works cleanly
- edit flow works cleanly
- stock save flow works cleanly
- active/inactive toggle hides inactive products from shopper views
- browser refresh preserves catalog state
- copy and docs still reflect actual behavior

### Phase 2: close only real gaps
Expected implementation posture:
- prefer **small corrective edits** only
- do **not** replace the existing local-storage architecture
- do **not** introduce backend APIs or database complexity
- do **not** broaden scope beyond DEM-6 acceptance

Most likely gap areas if any exist:
- shopper-facing routes that still read stale static data instead of managed browser data
- inconsistent wording between DEM-4 history and DEM-6 task naming
- missing UI edge-case handling for zero-stock / inactive products
- missing or incomplete end-to-end-ish component coverage
- missing Slack reporting artifact/handoff notes

### Phase 3: verify with tests/build
Minimum verification target:
- `npm test`
- `npm run build`

If Grunt makes behavior changes, add/update focused tests rather than large rewrites.

## Likely impacted files/areas
### Core logic
- `lib/product-management.ts`
- `lib/products.ts`
- `types/product.ts`

### Management UI
- `app/products/manage/page.tsx`
- `components/ProductManagementDashboard.tsx`
- `components/ProductForm.tsx`
- `components/ProductInventoryTable.tsx`

### Shopper UI
- `components/ManagedCatalog.tsx`
- `app/products/page.tsx`
- `app/products/[slug]/page.tsx`
- `components/ProductDetailView.tsx`
- `components/ProductCard.tsx`

### Tests/docs
- `src/__tests__/product-management.test.ts`
- any relevant component/cart tests
- `README.md`
- `docs/IMPLEMENTATION_NOTES.md`
- `CHANGELOG.md` if Scribe needs release-note cleanup

## Implementation strategy
1. **Assume feature exists already** and start with a gap audit, not a rebuild.
2. **Preserve the current simple architecture**: client-side catalog state + `localStorage`.
3. **Tighten UX only where acceptance needs it**: stock, active state, visibility, edit flow.
4. **Keep tests targeted** to utility + UI behaviors most likely to regress.
5. **Leave final narrative cleanup to Scribe**, but document any DEM-6/DEM-4 naming mismatch in the handoff.

## Slack reporting note
No Slack destination, webhook, or channel target is discoverable in repo files or environment for this run.

Operational rule for this phase and subsequent roles:
- if a platform-level Slack target becomes available in runtime context, send the required role report there,
- otherwise explicitly emit `SLACK_FAILED: no Slack destination available in repo/env/tool context`.

## Handoff for Pedant/Scribe
- Pedant should focus on acceptance validation rather than architectural rewrites.
- Scribe should summarize DEM-6 as delivered via the existing implementation and document any small reconciliation edits made by Grunt/Pedant.
