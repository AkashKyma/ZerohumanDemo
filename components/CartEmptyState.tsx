"use client";

import Link from "next/link";

export function CartEmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-soft">
      <h2 className="text-2xl font-semibold text-ink">Your cart is empty</h2>
      <p className="mx-auto mt-3 max-w-xl text-slate-600">
        Browse the catalog to add freshly roasted coffee, tea, and gear for your next brewing ritual.
      </p>
      <Link
        href="/products"
        className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
      >
        Explore the catalog
      </Link>
    </div>
  );
}
