"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { CartItem } from "@/types/cart";

interface StoredOrder {
  orderId: string;
  total: number;
  email: string;
  itemCount: number;
  items: CartItem[];
}

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [orderIdFromUrl, setOrderIdFromUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    setOrderIdFromUrl(params.get("orderId"));

    const raw = window.sessionStorage.getItem("dem2-last-order");
    if (!raw) {
      return;
    }

    try {
      setOrder(JSON.parse(raw) as StoredOrder);
    } catch {
      setOrder(null);
    }
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Order placed</p>
        <h1 className="mt-3 text-4xl font-semibold text-ink">Thanks for your order.</h1>
        <p className="mt-4 text-lg leading-7 text-slate-600">
          {order
            ? `A confirmation was prepared for ${order.email}. This order completed in mock payment mode and is ready for a future live Stripe handoff.`
            : "Your order completed successfully. If this page was refreshed, the local summary may no longer be available, but the flow still succeeded."}
        </p>

        <div className="mt-8 grid gap-6 rounded-3xl bg-slate-50 p-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Order reference</p>
            <p className="mt-1 text-lg font-semibold text-ink">{orderIdFromUrl ?? order?.orderId ?? "Mock order"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Order total</p>
            <p className="mt-1 text-lg font-semibold text-ink">{order ? formatPrice(order.total) : "Saved locally during checkout"}</p>
          </div>
        </div>

        {order ? (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-ink">What was included</h2>
            <div className="mt-4 space-y-4">
              {order.items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-3">
                  <div>
                    <p className="font-semibold text-ink">{item.product.name}</p>
                    <p className="text-sm text-slate-500">Qty {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-ink">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/products" className="rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark">
            Shop again
          </Link>
          <Link href="/" className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:border-brand hover:text-brand">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
