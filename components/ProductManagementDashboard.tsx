"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductForm } from "@/components/ProductForm";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductInventoryTable } from "@/components/ProductInventoryTable";
import {
  getSeedProducts,
  readStoredProducts,
  setProductStock,
  toggleProductActive,
  upsertProduct,
  writeStoredProducts,
  type ProductFormValues,
} from "@/lib/product-management";
import type { Product } from "@/types/product";

export function ProductManagementDashboard() {
  const [products, setProducts] = useState<Product[]>(getSeedProducts());
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [notice, setNotice] = useState("Catalog ready. Changes persist to browser storage.");

  useEffect(() => {
    setProducts(readStoredProducts());
  }, []);

  const orderedProducts = useMemo(
    () => [...products].sort((left, right) => Number(right.isActive) - Number(left.isActive) || left.name.localeCompare(right.name)),
    [products],
  );
  const activeProducts = useMemo(
    () => orderedProducts.filter((product) => product.isActive),
    [orderedProducts],
  );
  const editingProduct = orderedProducts.find((product) => product.id === editingProductId) ?? null;
  const totalStock = orderedProducts.reduce((sum, product) => sum + product.stockQuantity, 0);

  const commitProducts = (nextProducts: Product[], nextNotice: string) => {
    setProducts(nextProducts);
    writeStoredProducts(nextProducts);
    setNotice(nextNotice);
  };

  const handleSubmit = (values: ProductFormValues) => {
    const nextProducts = upsertProduct(products, values);
    commitProducts(
      nextProducts,
      values.id ? `Saved changes for ${values.name}.` : `Added ${values.name} to the catalog.`,
    );
    setEditingProductId(null);
    setFormKey((current) => current + 1);
  };

  const handleEdit = (productId: string) => {
    setEditingProductId(productId);
    setNotice("Editing existing product details.");
  };

  const handleSaveStock = (productId: string, stockQuantity: number) => {
    const productName = products.find((product) => product.id === productId)?.name ?? "product";
    commitProducts(setProductStock(products, productId, stockQuantity), `Updated stock for ${productName}.`);
  };

  const handleToggleActive = (productId: string) => {
    const product = products.find((item) => item.id === productId);
    const nextProducts = toggleProductActive(products, productId);
    const nextStatus = product?.isActive ? "inactive" : "active";
    commitProducts(nextProducts, `Set ${product?.name ?? "product"} to ${nextStatus}.`);
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setFormKey((current) => current + 1);
    setNotice("Switched back to new product mode.");
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Product management</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold text-ink">Add, update, and control storefront products</h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              This management flow keeps the catalog simple and usable: add products, edit details, update stock, and toggle active status without leaving the app.
            </p>
          </div>
          <div className="rounded-3xl bg-brand-light px-4 py-3 text-sm font-medium text-brand-dark">
            {notice}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">Catalog products</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{orderedProducts.length}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">Active storefront items</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{activeProducts.length}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">Units in stock</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{totalStock}</p>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
        <ProductForm
          key={`${editingProductId ?? "new"}-${formKey}`}
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancelEdit={handleCancelEdit}
        />

        <div className="space-y-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Storefront preview</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">What shoppers can see right now</h2>
            </div>
            <p className="text-sm text-slate-600">Inactive products stay hidden from the catalog.</p>
          </div>
          {activeProducts.length > 0 ? (
            <ProductGrid products={activeProducts} />
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 px-6 py-12 text-center text-slate-600">
              No active products yet. Add one or reactivate an existing product to repopulate the storefront.
            </div>
          )}
        </div>
      </div>

      <ProductInventoryTable
        products={orderedProducts}
        onEdit={handleEdit}
        onSaveStock={handleSaveStock}
        onToggleActive={handleToggleActive}
      />
    </div>
  );
}
