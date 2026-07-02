# Changelog

## DEM-5 — Product Management Delivery Handoff

### Added
- Stronger product-form normalization and validation for trimmed text input, positive pricing, and non-negative integer stock values
- Extra utility test coverage for invalid stored data and invalid product-form submissions
- DEM-5 documentation handoff covering setup, run commands, routes, and release notes

### Changed
- Product-management documentation now reflects the `/products/manage` workflow as the primary in-app catalog admin surface
- Release notes now describe active/inactive catalog visibility, stock updates, edit flow, and browser-local persistence in DEM-5 terms
- Implementation notes now document the hardened validation path and operational handoff expectations

### Verified
- Product-management implementation commit present: `feat(dem-5): harden product management form flow` (`94c6093`)
- Scribe phase limited to markdown/documentation updates only
- Release verification rerun during Scribe phase: `npm test` and `npm run build`

## DEM-4 — Product Management for the Storefront

### Added
- `/products/manage` management route for in-app catalog administration
- Product-management dashboard with catalog summary cards and active storefront preview
- Product form for creating and editing products with name, description, price, category, stock quantity, and active status
- Inventory table for quick stock saves and active/inactive toggles
- Product-management utility layer with seed normalization, slug generation, and browser `localStorage` persistence
- Automated tests for product-management utilities

### Changed
- Product data now uses `stockQuantity` and `isActive` as first-class catalog fields
- Shopper-facing catalog behavior reflects the managed product set and hides inactive products
- Header navigation now exposes the management route
- README and implementation notes updated for DEM-4 handoff

### Verified
- `npm test` passes (`12` tests)
- `npm run build` passes

## DEM-3 — Adding the Footer

### Added
- Global `Footer` component rendered through `app/layout.tsx`
- Footer navigation links for About, Contact us, and Shop
- `/about` marketing page with store positioning, values, and navigation CTAs
- `/contact` support page with support email, wholesale contact, and studio hours

### Changed
- Storefront shell now includes a persistent footer across the app
- README and implementation notes updated for deployment and PR review handoff

## DEM-2 — E-commerce Store

### Added
- Next.js storefront with homepage, catalog, product detail, cart, checkout, and success routes
- JSON-backed product catalog with seeded inventory across multiple categories
- Cart state management with `localStorage` persistence
- Checkout API route with payload validation and mock/Stripe-ready response mode
- Automated tests for cart utilities and checkout form behavior
- `.env.example` placeholders for future Stripe configuration

### Documented
- README setup and run instructions for local development
- Delivery notes and architecture handoff in `docs/IMPLEMENTATION_NOTES.md`

### Verified
- `npm test` passes
- `npm run build` passes
