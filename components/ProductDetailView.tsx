"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/ProductGrid";
import { QuantitySelector } from "@/components/QuantitySelector";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const unavailable = !product.isActive || product.stockQuantity < 1;

  return (
    <div className="space-y-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-white shadow-soft">
          <Image src={product.image} alt={product.name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
        </div>
        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">{product.category}</p>
              <span
                className={product.isActive
                  ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
                  : "rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"}
              >
                {product.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">{product.name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="rounded-full bg-brand-light px-3 py-1 font-semibold text-brand-dark">
                {formatPrice(product.price)}
              </span>
              <span>{product.rating.toFixed(1)} ★ rating</span>
              <span>{product.stockQuantity} available</span>
            </div>
          </div>
          <p className="text-base leading-7 text-slate-600">{product.description}</p>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <QuantitySelector quantity={quantity} max={Math.max(product.stockQuantity, 1)} onChange={setQuantity} />
            <button
              type="button"
              disabled={unavailable}
              onClick={() => addItem(product, quantity)}
              className="rounded-full bg-ink px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            >
              {unavailable ? "Currently unavailable" : `Add ${quantity} to cart`}
            </button>
          </div>
          {unavailable ? (
            <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
              This product is hidden from the storefront or has no remaining stock. Update it in product management to make it purchasable again.
            </p>
          ) : null}
          <Link href="/checkout" className="inline-flex text-sm font-semibold text-brand transition hover:text-brand-dark">
            Prefer express checkout? Go straight to payment →
          </Link>
        </div>
      </div>

      {relatedProducts.length > 0 ? (
        <section className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">You may also like</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">More from the catalog</h2>
            </div>
          </div>
          <ProductGrid products={relatedProducts} />
        </section>
      ) : null}
    </div>
  );
}
