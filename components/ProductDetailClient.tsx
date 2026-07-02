"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductDetailView } from "@/components/ProductDetailView";
import { getProductBySlug } from "@/lib/products";
import { getSeedProducts, readStoredProducts } from "@/lib/product-management";
import type { Product } from "@/types/product";

export function ProductDetailClient({ slug }: { slug: string }) {
  const [products, setProducts] = useState<Product[]>(getSeedProducts());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProducts(readStoredProducts());
    setHydrated(true);
  }, []);

  const product = useMemo(
    () => products.find((item) => item.slug === slug) ?? getProductBySlug(slug, { includeInactive: true }),
    [products, slug],
  );

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    return products
      .filter((item) => item.id !== product.id && item.category === product.category && item.isActive)
      .slice(0, 3);
  }, [product, products]);

  if (!product && hydrated) {
    return (
      <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-soft">
        <h1 className="text-2xl font-semibold text-ink">Product not found</h1>
        <p className="mt-3 text-slate-600">
          This item is not available in the current catalog snapshot. Head back to product management to add it or restore it.
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-16 text-center shadow-soft">
        <p className="text-slate-600">Loading product details…</p>
      </div>
    );
  }

  return <ProductDetailView product={product} relatedProducts={relatedProducts} />;
}
