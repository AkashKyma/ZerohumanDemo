# Changelog

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
