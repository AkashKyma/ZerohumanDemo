# DEM-5 Storefront with Product Management

A polished Next.js storefront for browsing products, managing a persistent cart, and maintaining the catalog directly inside the app.

## What was built

The app now includes the original shopping flow, the marketing shell, and the DEM-5 product-management experience:

- **Homepage** with hero content and featured products
- **Catalog page** with shopper-facing browsing for active products
- **Product detail pages** for individual products
- **Persistent cart** backed by `localStorage`
- **Checkout flow** with form validation and mock order completion
- **Success page** that reads the last order from session storage
- **Global footer** with About and Contact navigation
- **Product management dashboard** at `/products/manage`
- **Add product flow** for creating new catalog items
- **Edit product flow** for updating existing product details
- **Stock management** for changing inventory quantities in place
- **Active/inactive toggle** so hidden products stay out of shopper-facing catalog views
- **Browser-local catalog persistence** so management changes survive refreshes in the current browser
- **Validation hardening** for trimmed text input, non-negative stock values, positive prices, and normalized catalog records
- **Automated tests** covering cart behavior, checkout behavior, and product-management utilities

## DEM-5 feature overview

The product-management flow supports products with these fields:

- **name**
- **description**
- **price**
- **category**
- **stock quantity**
- **active status**

### Management behavior

- Add products from the in-app management form
- Edit existing products without leaving the dashboard
- Update stock quantity from the inventory table
- Toggle products between active and inactive states
- Preview active products exactly as shoppers see them
- Normalize and validate product input before saving
- Generate safe, unique slugs for managed catalog items

### Storefront behavior

- Only **active** products appear in customer-facing catalog views
- Catalog changes are stored in browser `localStorage`
- Seed products are used as the default catalog if no local catalog exists yet
- Existing storefront, cart, and checkout flows continue to work against the managed catalog

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
npm test
npm run build
npm start
```

## Routes to review

- `/` — storefront homepage
- `/products` — shopper-facing catalog
- `/products/[slug]` — product detail page
- `/products/manage` — product management dashboard
- `/cart` — cart management
- `/checkout` — checkout form
- `/checkout/success` — mock order confirmation
- `/about` — brand/about page
- `/contact` — support/contact page

## Key product-management files

- `app/products/manage/page.tsx`
- `components/ProductManagementDashboard.tsx`
- `components/ProductForm.tsx`
- `components/ProductInventoryTable.tsx`
- `lib/product-management.ts`
- `src/__tests__/product-management.test.ts`

## Demo limitation

Product-management changes are intentionally **browser-local** for this implementation. They are production-clean for the current demo/storefront architecture, but they are not shared across browsers or users because there is no backend catalog write path yet.

## Delivery note

The Slack reporting requirement for Architect, Grunt, Pedant, and Scribe is an **agent workflow requirement**, not an in-app storefront feature. The repository changes here cover the ecommerce product-management experience and its documentation handoff.

## Release readiness

Current release-readiness checks for DEM-5:

```bash
npm test
npm run build
```

These should pass before automated PR completion.