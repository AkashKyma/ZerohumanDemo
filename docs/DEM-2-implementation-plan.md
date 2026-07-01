# DEM-2 — E-commerce Store Implementation Plan

## Goal
Build a complete Next.js storefront with Tailwind styling, a JSON-backed product catalog, cart persistence in `localStorage`, and a Stripe-ready checkout form that works without live Stripe keys.

## Recommended Stack
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** React context + reducer for cart state
- **Persistence:** `localStorage` with hydration guard
- **Data source:** local JSON file under `src/data/products.json`
- **Forms/validation:** lightweight controlled inputs + Zod for checkout payload validation
- **Testing:** Vitest + React Testing Library for unit/component coverage
- **Icons:** inline SVG or `lucide-react`

## App Structure
```text
src/
  app/
    layout.tsx
    page.tsx                  # Homepage / featured catalog
    products/
      page.tsx                # Full catalog page
      [slug]/page.tsx         # Product detail page
    cart/page.tsx             # Cart review/edit page
    checkout/page.tsx         # Checkout form page
    checkout/success/page.tsx # Mock success confirmation page
    globals.css
  components/
    layout/
      Header.tsx
      Footer.tsx
      Container.tsx
    products/
      ProductGrid.tsx
      ProductCard.tsx
      ProductDetail.tsx
      ProductBadge.tsx
      QuantitySelector.tsx
    cart/
      CartDrawer.tsx          # optional if time allows; page is primary UX
      CartItemRow.tsx
      CartSummary.tsx
      CartEmptyState.tsx
    checkout/
      CheckoutForm.tsx
      OrderSummary.tsx
      PaymentSection.tsx
    ui/
      Button.tsx
      Input.tsx
      Select.tsx
      Textarea.tsx
      Badge.tsx
      Price.tsx
  lib/
    products.ts               # product lookup/filter helpers
    cart.ts                   # cart math, storage helpers
    format.ts                 # currency helpers
    validations.ts            # Zod schemas
  context/
    CartContext.tsx
  data/
    products.json
  types/
    product.ts
    cart.ts
public/
  products/...               # product images/placeholders
.env.example
package.json
postcss.config.js
 tailwind.config.ts
 tsconfig.json
vitest.config.ts
```

## Core Routes / Pages
1. **`/` Home**
   - hero section
   - featured products grid
   - category/value highlights
   - CTA into full catalog
2. **`/products` Catalog**
   - searchable/filterable product listing from JSON
   - optional category filter and sort controls
   - add-to-cart from listing
3. **`/products/[slug]` Product detail**
   - image, description, price, category, stock badge
   - quantity selector
   - add-to-cart action
4. **`/cart` Cart**
   - line items with qty increment/decrement/remove
   - subtotal display
   - CTA to checkout
5. **`/checkout` Checkout**
   - shipping/contact form
   - payment section marked “Stripe-ready”
   - mock card fields and validation
   - place-order button that creates a local mock success flow when no Stripe env vars exist
6. **`/checkout/success` Success**
   - thank-you confirmation
   - order summary from transient checkout payload or safe fallback message

## Product Data Model
Each product in JSON should include:
- `id`
- `slug`
- `name`
- `description`
- `price` (number)
- `category`
- `image`
- `featured` (boolean)
- `inventory` or `inStock` flag
- optional `rating`, `tags`

Seed at least 8–12 realistic products so catalog, featured sections, and filters feel complete.

## Cart Architecture
Use a `CartContext` with reducer actions:
- `ADD_ITEM`
- `REMOVE_ITEM`
- `UPDATE_QUANTITY`
- `CLEAR_CART`
- `HYDRATE_CART`

Behavior:
- persist cart to `localStorage`
- guard browser-only APIs during SSR
- merge duplicate adds by incrementing quantity
- enforce quantity minimum 1
- optionally clamp to available inventory if inventory is modeled

Computed helpers:
- subtotal
- item count
- formatted totals

## Checkout Flow
Goal is **Stripe-ready**, not fully live-gateway dependent.

### Phase implementation for this repo
- Build a checkout form with sections:
  - contact info
  - shipping address
  - payment details UI
- Validate with Zod/client validation
- On submit:
  - if Stripe env vars are absent, run a **mock checkout completion** and route to success page
  - structure code so a later Stripe integration can swap in a real handler with minimal churn

### Stripe-ready design
Prepare these seams now:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env.example`
- optional `STRIPE_SECRET_KEY` placeholder in `.env.example`
- isolated payment component boundary (`PaymentSection`)
- optional future server route for payment intent creation:
  - `src/app/api/checkout/route.ts`

Grunt can decide whether to include a mock API route now for cleaner separation; recommended yes, but it can still return mock success when env vars are missing.

## UI / UX Expectations
- responsive layout across mobile and desktop
- persistent cart count in header
- clear empty states for cart and no-results catalog view
- accessible form labels and button states
- price formatting in USD by helper
- polished Tailwind styling with consistent spacing, hover states, and focus states

## Acceptance-Criteria Mapping
- **`npm run dev` starts app:** scaffold standard Next.js app with minimal dependencies
- **`npm run build` passes:** avoid server-only/browser-only crossovers; protect `localStorage` usage
- **All routes render:** implement `/`, `/products`, `/products/[slug]`, `/cart`, `/checkout`, `/checkout/success`
- **Store is usable without env vars:** provide mock checkout path and local JSON data
- **No placeholders:** include actual seeded products, finished components, and test coverage for cart + checkout behavior
- **`.env.example` exists:** include Stripe placeholders and note mock fallback

## Testing Plan
Minimum automated coverage:
- cart reducer math
- cart persistence helpers
- add/remove/update quantity behavior
- checkout validation schema
- one rendered component test for product card or cart summary

Manual verification checklist for Pedant:
- browse homepage and catalog
- view product detail
- add/update/remove cart items
- refresh browser and verify cart persists
- complete checkout with mock payment path
- build production bundle successfully

## Implementation Order for Grunt
1. Scaffold Next.js + Tailwind + TypeScript project files
2. Add seeded `products.json` and product/types helpers
3. Build app shell (`layout`, header, footer, container)
4. Implement cart context + storage hydration
5. Build home and catalog pages
6. Build product detail page
7. Build cart page and totals
8. Build checkout page + validation + mock success flow
9. Add `.env.example`
10. Add unit/component tests
11. Run `npm install`, `npm run build`, and smoke-check `npm run dev`

## Risks / Gotchas
- SSR hydration mismatch from `localStorage` access
- image handling if using remote URLs; prefer local/public assets or `unoptimized`
- success page should not hard-crash if checkout state is missing after refresh
- keep mock payment clearly separated so future Stripe integration is straightforward

## Handoff Notes
- Repository appears effectively empty aside from repo metadata and docs, so Grunt should scaffold from scratch.
- This phase intentionally makes **no application code edits**.
- Primary artifact is this implementation plan.
