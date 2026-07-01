"use client";

import Link from "next/link";
import { CartEmptyState } from "@/components/CartEmptyState";
import { CartItemRow } from "@/components/CartItemRow";
import { CartSummary } from "@/components/CartSummary";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, itemCount, subtotal } = useCart();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Cart</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">Review your order</h1>
        </div>
        <Link href="/products" className="text-sm font-semibold text-brand transition hover:text-brand-dark">
          Continue shopping →
        </Link>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-4">
          {items.length === 0 ? (
            <CartEmptyState />
          ) : (
            items.map((item) => <CartItemRow key={item.product.id} item={item} />)
          )}
        </section>
        <CartSummary itemCount={itemCount} subtotal={subtotal} />
      </div>
    </div>
  );
}
