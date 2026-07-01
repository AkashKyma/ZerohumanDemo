import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { getFeaturedProducts } from "@/lib/products";

const highlights = [
  {
    title: "Small-batch sourcing",
    description: "Seasonal coffees and teas selected for clarity, sweetness, and repeatable brewing.",
  },
  {
    title: "Fast cart-to-checkout flow",
    description: "Local cart persistence and a Stripe-ready payment handoff keep the purchase path short.",
  },
  {
    title: "Gear that earns counter space",
    description: "Only practical accessories: durable tools, giftable bundles, and daily-use brewing gear.",
  },
];

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-20 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="hero-gradient overflow-hidden rounded-[2rem] border border-white/70 px-6 py-14 shadow-soft sm:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Northstar Supply</p>
            <h1 className="mt-4 max-w-2xl text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
              Brew a better store experience from first click to checkout.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Browse specialty coffee, premium tea, and countertop essentials in a clean storefront with a saved cart and a mock-to-live checkout path.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products" className="rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark">
                Shop the catalog
              </Link>
              <Link href="/checkout" className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:border-brand hover:text-brand">
                Go to checkout
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {highlights.map((highlight) => (
              <article key={highlight.title} className="rounded-3xl bg-white/90 p-5 shadow-soft last:sm:col-span-2">
                <h2 className="text-lg font-semibold text-ink">{highlight.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{highlight.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Featured picks</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">Start with customer favorites</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-brand transition hover:text-brand-dark">
            View all products →
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>
    </div>
  );
}
