"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/format";

interface CartSummaryProps {
  itemCount: number;
  subtotal: number;
  ctaLabel?: string;
  ctaHref?: string;
}

export function CartSummary({ itemCount, subtotal, ctaLabel = "Proceed to checkout", ctaHref = "/checkout" }: CartSummaryProps) {
  const shipping = itemCount > 0 ? 8 : 0;
  const total = subtotal + shipping;

  return (
    <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-ink">Order summary</h2>
      <div className="mt-6 space-y-4 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <span>Items</span>
          <span>{itemCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span>{itemCount > 0 ? formatPrice(shipping) : formatPrice(0)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base font-semibold text-ink">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      <Link
        href={ctaHref}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
      >
        {ctaLabel}
      </Link>
    </aside>
  );
}
