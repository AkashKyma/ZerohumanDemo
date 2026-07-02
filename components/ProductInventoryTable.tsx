"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

interface ProductInventoryTableProps {
  products: Product[];
  onEdit: (productId: string) => void;
  onSaveStock: (productId: string, stockQuantity: number) => void;
  onToggleActive: (productId: string) => void;
}

export function ProductInventoryTable({
  products,
  onEdit,
  onSaveStock,
  onToggleActive,
}: ProductInventoryTableProps) {
  const [stockDrafts, setStockDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    setStockDrafts(
      Object.fromEntries(products.map((product) => [product.id, String(product.stockQuantity)])),
    );
  }, [products]);

  return (
    <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Inventory</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Manage stock and status</h2>
        </div>
        <p className="text-sm text-slate-600">Quick updates save directly to the in-browser catalog.</p>
      </div>

      <div className="space-y-4">
        {products.map((product) => {
          const stockValue = stockDrafts[product.id] ?? String(product.stockQuantity);

          return (
            <article
              key={product.id}
              className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[1.3fr_0.7fr_auto] lg:items-center"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-ink">{product.name}</h3>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {product.category}
                  </span>
                  <span
                    className={product.isActive
                      ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
                      : "rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
                <p className="mt-3 text-sm font-semibold text-slate-700">{formatPrice(product.price)}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-[minmax(0,140px)_auto] lg:grid-cols-1">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Stock quantity
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={stockValue}
                    onChange={(event) => setStockDrafts((current) => ({ ...current, [product.id]: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => onSaveStock(product.id, Number(stockValue))}
                  className="rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand"
                >
                  Save stock
                </button>
              </div>

              <div className="flex flex-wrap gap-3 lg:justify-end">
                <button
                  type="button"
                  onClick={() => onEdit(product.id)}
                  className="rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Edit details
                </button>
                <button
                  type="button"
                  onClick={() => onToggleActive(product.id)}
                  className="rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand"
                >
                  {product.isActive ? "Set inactive" : "Set active"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
