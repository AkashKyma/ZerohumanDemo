# DEM-4 Architect Plan

## Scope summary
Add a lightweight product-management flow to the existing Next.js storefront so products can be viewed, created, edited, stocked, and activated/deactivated without introducing a database or complex backend.

## Current stack and constraints
- Next.js 14 App Router
- React 18 + TypeScript
- Tailwind CSS
- Zod already used for checkout validation
- Current catalog data is static from `data/products.json`
- Current shopper pages already depend on `Product` shape, cart logic, and product listing/detail UI
- No existing admin area, persistence layer, or server-side write path

## Recommended implementation approach
Use a **client-side product store** seeded from `data/products.json` and persisted in `localStorage`.

Why this fits:
- keeps the implementation simple and runnable with no backend setup
- matches the current mock/demo storefront architecture
- avoids unsafe server-side JSON mutation in Next.js runtime
- allows add/edit/stock/status changes to reflect immediately in the UI

## Data model changes
Update product model to support required management fields explicitly:
- `name`
- `description`
- `price`
- `category`
- `stockQuantity` (replace current `inventory` naming)
- `isActive` (new)

Keep existing storefront fields where useful:
- `id`
- `slug`
- `image`
- `featured`
- `rating`
- `tags`

### Migration note
Seed data in `data/products.json` should be updated from `inventory` to `stockQuantity`, and each item should receive `isActive: true` initially.

## State / persistence plan
Create a dedicated product-state layer, separate from the cart:
- `lib/product-store.ts` or `context/ProductContext.tsx`
- storage key for managed products
- helpers for:
  - hydrating seeded products + local overrides
  - adding a product
  - updating a product
  - updating stock quantity
  - toggling active status
  - querying active storefront products only
  - looking up a product by slug/id from managed state

Recommended structure:
- `ProductProvider` mounted in `app/layout.tsx`
- shopper views consume active products from provider
- management page consumes full product list including inactive items

## UI plan
### 1) Shopper-facing catalog updates
Impacted areas:
- `app/page.tsx`
- `app/products/page.tsx`
- `app/products/[slug]/page.tsx`
- `components/ProductCard.tsx`
- `components/ProductDetailView.tsx`
- `components/CatalogFilters.tsx`

Changes:
- only show `isActive === true` products in customer-facing grids
- show `stockQuantity` instead of `inventory`
- disable add-to-cart when stock is `0`
- ensure product detail route gracefully handles inactive/missing products
- related products should exclude inactive products

### 2) Product management route
Add a dedicated internal management screen, simplest path:
- `app/products/manage/page.tsx`

Recommended UI sections:
- **Product form** for add/edit
  - name
  - description
  - price
  - category
  - stock quantity
  - active status
- **Product list/table/cards** showing all products
  - current stock
  - active/inactive badge
  - edit action
  - toggle action
  - stock quick-update input/button

Recommended component split:
- `components/ProductManager.tsx`
- `components/ProductForm.tsx`
- `components/ProductManagementList.tsx`

Keep styling consistent with existing rounded card-based Tailwind UI.

## Validation plan
Extend `lib/validations.ts` with a product schema, for example:
- required non-empty `name`
- required non-empty `description`
- positive numeric `price`
- enum category
- integer `stockQuantity >= 0`
- boolean `isActive`

Also validate/normalize generated values:
- slug derived from product name when creating
- stable id generation for new items
- prevent duplicate slug collisions by suffixing if needed

## Cart compatibility plan
Impacted areas:
- `lib/cart.ts`
- `context/CartContext.tsx`
- quantity controls/tests

Required updates:
- rename `inventory` usage to `stockQuantity`
- clamp cart quantity to current stock
- when stock becomes `0`, prevent new additions
- optionally sanitize hydrated cart items if managed product stock changed since last save

## Testing plan
Add/adjust focused tests rather than broad rewrites.

### Update existing tests
- `src/__tests__/cart.test.ts`
  - rename inventory expectations to stock quantity
  - verify clamping still works
- checkout tests only if product shape changes affect cart payloads

### Add new tests
Suggested files:
- `src/__tests__/product-store.test.ts`
  - seed hydration
  - localStorage persistence
  - add/edit/toggle/update stock flows
- `src/__tests__/product-management.test.tsx`
  - add new product form flow
  - edit existing product flow
  - toggle active/inactive flow
  - stock update flow

## Docs plan
Update `README.md` to mention:
- product management route
- local persistence behavior
- active/inactive product behavior
- any limitations of demo persistence (browser-local, not multi-user)

## File / area impact list
Likely touched by Grunt:
- `types/product.ts`
- `data/products.json`
- `lib/products.ts`
- `lib/cart.ts`
- `lib/validations.ts`
- `context/CartContext.tsx` (if stock sync is needed)
- `app/layout.tsx`
- `app/page.tsx`
- `app/products/page.tsx`
- `app/products/[slug]/page.tsx`
- `components/ProductCard.tsx`
- `components/ProductDetailView.tsx`
- `components/CatalogFilters.tsx`
- new `app/products/manage/page.tsx`
- new product management components
- tests under `src/__tests__/`
- `README.md`

## Implementation order for Grunt
1. Extend product types + seed data (`stockQuantity`, `isActive`)
2. Build product persistence/provider layer
3. Wire provider into layout
4. Update shopper catalog/detail components to consume managed active products
5. Add management route and form/list interactions
6. Update cart stock clamping logic
7. Add/update tests
8. Update README

## Risks / notes
- Client-side persistence means product changes are browser-local; acceptable for this demo/storefront architecture, but should be documented.
- Dynamic detail pages currently read from static helpers; Grunt should shift them to a managed client-backed lookup path.
- If inactive products already exist in carts, UX should remain graceful rather than crashing.

## Slack/process note
- Architect Slack report content is prepared, but no Slack target is discoverable in repo/env.
- Grunt/Pedant/Scribe should use the platform-provided Slack destination if surfaced in their run context; otherwise they must emit `SLACK_FAILED: <reason>` per task rules.
