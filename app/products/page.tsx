import Link from "next/link";
import { ManagedCatalog } from "@/components/ManagedCatalog";

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Catalog</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">Shop coffee, tea, and brewing gear</h1>
          <p className="mt-4 text-lg leading-7 text-slate-600">
            Browse the live storefront catalog, then jump into product management when you need to add new items, update stock, or pause products.
          </p>
        </div>
        <Link
          href="/products/manage"
          className="inline-flex rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:border-brand hover:text-brand"
        >
          Open product management
        </Link>
      </div>

      <div className="mt-10">
        <ManagedCatalog />
      </div>
    </div>
  );
}
