# DEM-3 Storefront Footer, About, and Contact Pages

A polished Next.js storefront for browsing products, managing a persistent cart, and navigating a finished marketing shell with footer-driven About and Contact pages.

## What was built

The current app now includes the original store flow plus the DEM-3 footer/navigation work:

- **Homepage** with hero content and featured products
- **Catalog page** with search, category filtering, and sorting
- **Product detail pages** for individual items
- **Persistent cart** backed by `localStorage`
- **Checkout flow** with form validation and mock order completion
- **Success page** that reads the last order from session storage
- **Global footer** rendered from `app/layout.tsx`
- **About page** at `/about` with brand story, values, and CTA links
- **Contact page** at `/contact` with support, wholesale, and studio-hours details
- **Mock-ready API route** at `app/api/checkout/route.ts` for future Stripe integration
- **Automated tests** covering cart behavior and checkout validation/retry behavior

The store ships with **8 seeded products** across Coffee, Tea, Accessories, and Gift Sets.

## Footer ticket summary

DEM-3 adds the finishing navigation layer for the storefront:

- footer links to **About**, **Contact us**, and **Shop**
- support copy in the footer explains the current mock checkout state
- dedicated informational pages give the footer destinations real content instead of placeholders
- the footer is mounted globally so it appears across the storefront experience

## Tech stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Zod
- Vitest + Testing Library

## Setup

```bash
npm install
```

## Run locally

Start the development server:

```bash
npm run dev
```

Then open <http://localhost:3000>.

## Useful commands

```bash
npm run build
npm start
npm test
```

## Routes to review

- `/` — storefront homepage
- `/products` — product catalog
- `/products/[slug]` — product detail
- `/cart` — cart management
- `/checkout` — checkout form
- `/checkout/success` — mock order confirmation
- `/about` — brand/about page added for DEM-3
- `/contact` — support/contact page added for DEM-3

## Files added for DEM-3

- `components/Footer.tsx`
- `app/about/page.tsx`
- `app/contact/page.tsx`

## Release note

This repository is ready for automated PR packaging with the footer/about/contact documentation updated for reviewers and deployers.
