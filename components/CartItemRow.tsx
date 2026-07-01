"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import type { CartItem } from "@/types/cart";
import { QuantitySelector } from "@/components/QuantitySelector";

export function CartItemRow({ item }: { item: CartItem }) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:grid-cols-[120px_1fr]">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="120px" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href={`/products/${item.product.slug}`} className="text-xl font-semibold text-ink transition hover:text-brand">
              {item.product.name}
            </Link>
            <p className="mt-1 text-sm text-slate-500">{item.product.category}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-ink">{formatPrice(item.product.price * item.quantity)}</p>
            <p className="text-sm text-slate-500">{formatPrice(item.product.price)} each</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <QuantitySelector
            quantity={item.quantity}
            max={item.product.inventory}
            onChange={(quantity) => updateQuantity(item.product.id, quantity)}
          />
          <button
            type="button"
            onClick={() => removeItem(item.product.id)}
            className="text-left text-sm font-semibold text-accent transition hover:text-orange-700 sm:text-right"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
