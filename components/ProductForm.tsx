"use client";

import { useEffect, useState } from "react";
import {
  prepareProductFormValues,
  type ProductFormErrors,
  type ProductFormValues,
} from "@/lib/product-management";
import { PRODUCT_CATEGORIES, type Product } from "@/types/product";

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (values: ProductFormValues) => void;
  onCancelEdit: () => void;
}

function getInitialValues(product?: Product | null): ProductFormValues {
  if (!product) {
    return {
      name: "",
      description: "",
      price: 0,
      category: "Coffee",
      stockQuantity: 0,
      isActive: true,
    };
  }

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    stockQuantity: product.stockQuantity,
    isActive: product.isActive,
  };
}

export function ProductForm({ product, onSubmit, onCancelEdit }: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(getInitialValues(product));
  const [errors, setErrors] = useState<ProductFormErrors>({});

  useEffect(() => {
    setValues(getInitialValues(product));
    setErrors({});
  }, [product]);

  const updateField = <Field extends keyof ProductFormValues>(field: Field, value: ProductFormValues[Field]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field as keyof ProductFormErrors]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[field as keyof ProductFormErrors];
      return nextErrors;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submission = prepareProductFormValues(values);

    setValues(submission.values);

    if (!submission.isValid) {
      setErrors(submission.errors);
      return;
    }

    setErrors({});
    onSubmit(submission.values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
          {product ? "Edit product" : "Add product"}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">
          {product ? `Update ${product.name}` : "Create a catalog item"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Keep the catalog clean: set the product details, choose a stock level, and decide whether the item should be visible in the storefront.
        </p>
      </div>

      <label className="block space-y-2 text-sm font-medium text-slate-700">
        Product name
        <input
          required
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          placeholder="Aurora Summer Roast"
        />
        {errors.name ? <p className="text-sm text-rose-600">{errors.name}</p> : null}
      </label>

      <label className="block space-y-2 text-sm font-medium text-slate-700">
        Description
        <textarea
          required
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
          className="min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          placeholder="Add a concise, customer-facing description."
        />
        {errors.description ? <p className="text-sm text-rose-600">{errors.description}</p> : null}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          Price
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={values.price}
            onChange={(event) => updateField("price", Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          {errors.price ? <p className="text-sm text-rose-600">{errors.price}</p> : null}
        </label>

        <label className="block space-y-2 text-sm font-medium text-slate-700">
          Category
          <select
            value={values.category}
            onChange={(event) => updateField("category", event.target.value as ProductFormValues["category"])}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          >
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          Stock quantity
          <input
            required
            type="number"
            min="0"
            step="1"
            value={values.stockQuantity}
            onChange={(event) => updateField("stockQuantity", Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          {errors.stockQuantity ? <p className="text-sm text-rose-600">{errors.stockQuantity}</p> : null}
        </label>

        <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(event) => updateField("isActive", event.target.checked)}
          />
          Visible in storefront
        </label>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          className="rounded-full bg-brand px-5 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          {product ? "Save product changes" : "Add product"}
        </button>
        {product ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:border-brand hover:text-brand"
          >
            Cancel editing
          </button>
        ) : null}
      </div>
    </form>
  );
}
