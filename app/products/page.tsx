import { CatalogFilters } from "@/components/CatalogFilters";
import { getAllProducts, getCategories } from "@/lib/products";

export default function ProductsPage() {
  const products = getAllProducts();
  const categories = getCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Catalog</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">Shop coffee, tea, and brewing gear</h1>
        <p className="mt-4 text-lg leading-7 text-slate-600">
          Everything here is powered by local JSON data, so the store works immediately and is easy to extend later.
        </p>
      </div>
      <div className="mt-10">
        <CatalogFilters products={products} categories={categories} />
      </div>
    </div>
  );
}
