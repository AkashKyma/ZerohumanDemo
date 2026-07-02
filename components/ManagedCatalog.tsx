"use client";

import { useEffect, useMemo, useState } from "react";
import { CatalogFilters } from "@/components/CatalogFilters";
import { getProductCategories, getSeedProducts, readStoredProducts } from "@/lib/product-management";
import type { Product } from "@/types/product";

export function ManagedCatalog() {
  const [products, setProducts] = useState<Product[]>(getSeedProducts());

  useEffect(() => {
    setProducts(readStoredProducts());
  }, []);

  const activeProducts = useMemo(
    () => products.filter((product) => product.isActive),
    [products],
  );

  const categories = useMemo(() => getProductCategories(activeProducts), [activeProducts]);
  const inactiveCount = products.length - activeProducts.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">Storefront catalog</h2>
          <p className="mt-1 text-sm text-slate-600">
            Active products appear here automatically. New catalog changes persist in browser storage so the management flow stays fast and simple.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="rounded-full bg-brand-light px-3 py-1 font-semibold text-brand-dark">
            {activeProducts.length} active
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600">
            {inactiveCount} inactive
          </span>
        </div>
      </div>

      <CatalogFilters products={activeProducts} categories={categories} />
    </div>
  );
}
