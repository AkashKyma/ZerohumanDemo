"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/ProductGrid";

interface CatalogFiltersProps {
  products: Product[];
  categories: string[];
}

export function CatalogFilters({ products, categories }: CatalogFiltersProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const nextProducts = products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
      const matchesCategory = category === "All" || product.category === category;

      return matchesQuery && matchesCategory;
    });

    return nextProducts.sort((a, b) => {
      if (sort === "price-asc") {
        return a.price - b.price;
      }
      if (sort === "price-desc") {
        return b.price - a.price;
      }
      if (sort === "rating") {
        return b.rating - a.rating;
      }
      if (a.featured === b.featured) {
        return a.name.localeCompare(b.name);
      }
      return a.featured ? -1 : 1;
    });
  }, [category, products, query, sort]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft md:grid-cols-[2fr_1fr_1fr]">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Search products
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search coffee, tea, or gear"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          >
            <option>All</option>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Sort by
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </label>
      </div>

      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-600 shadow-soft">
          No products matched your filters. Try a broader search or switch categories.
        </div>
      )}
    </div>
  );
}
