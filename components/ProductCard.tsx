"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{product.category}</p>
            <Link href={`/products/${product.slug}`} className="mt-2 block text-lg font-semibold text-ink transition hover:text-brand">
              {product.name}
            </Link>
          </div>
          <span className="rounded-full bg-brand-light px-3 py-1 text-sm font-semibold text-brand-dark">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="text-sm leading-6 text-slate-600">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm text-slate-500">{product.inventory} in stock</span>
          <button
            type="button"
            onClick={() => addItem(product, 1)}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
