# DEM-2 E-commerce Store

A polished Next.js storefront for browsing products, managing a persistent cart, and completing a Stripe-ready checkout flow.

## What was built

This ticket delivers a complete front-end store experience with:

- **Homepage** with hero content and featured products
- **Catalog page** with search, category filtering, and sorting
- **Product detail pages** for individual items
- **Persistent cart** backed by `localStorage`
- **Checkout flow** with form validation and mock order completion
- **Success page** that reads the last order from session storage
- **Mock-ready API route** at `app/api/checkout/route.ts` for future Stripe integration
- **Automated tests** covering cart behavior and checkout validation/retry behavior

The store ships with **8 seeded products** across Coffee, Tea, Accessories, and Gift Sets.

## Tech stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Zod
- Vitest + Testing Library

## Getting started

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

### Production build

```bash
npm run build
```

### Run tests

```bash
npm test
```

## Routes

- `/` — landing page with featured products
- `/products` — searchable and filterable catalog
- `/products/[slug]` — product detail page
- `/cart` — cart review and quantity management
- `/checkout` — checkout form with mock-to-live payment seam
- `/checkout/success` — order confirmation page
- `/api/checkout` — validates checkout payload and returns mock or Stripe-ready mode

## Checkout behavior

The checkout flow is **Stripe-ready but safe by default**:

- If Stripe keys are **not** configured, checkout completes in **mock mode**
- If both keys are configured, the API reports **ready-for-stripe** mode
- Current environment placeholders live in `.env.example`

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

## Project structure

```text
app/
  api/checkout/route.ts
  cart/page.tsx
  checkout/page.tsx
  checkout/success/page.tsx
  products/page.tsx
  products/[slug]/page.tsx
components/
context/
data/products.json
lib/
src/__tests__/
types/
```

## Release readiness

Verified in this repo:

- `npm test` ✅
- `npm run build` ✅
- Core shopper routes implemented ✅
- Mock checkout path works without env vars ✅
- `.env.example` included ✅

## Notes for follow-up

- Replace mock checkout response with live Stripe payment intent creation when keys and backend wiring are ready
- Keep the existing checkout form boundary and API route as the integration seam
- See `docs/IMPLEMENTATION_NOTES.md` for architecture and handoff details
