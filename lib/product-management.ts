import seedProducts from "@/data/products.json";
import { PRODUCT_CATEGORIES, type Product, type ProductCategory } from "@/types/product";

export const PRODUCTS_STORAGE_KEY = "dem4-product-catalog";

export interface ProductFormValues {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  stockQuantity: number;
  isActive: boolean;
}

export interface ProductFormErrors {
  name?: string;
  description?: string;
  price?: string;
  stockQuantity?: string;
}

type RawProductRecord = Partial<Product> & {
  inventory?: number;
  active?: boolean;
};

const DEFAULT_PRODUCT_IMAGES: Record<ProductCategory, string> = {
  Coffee: "/images/aurora-espresso.svg",
  Tea: "/images/matcha-cloud.svg",
  Accessories: "/images/brew-scale.svg",
  "Gift Sets": "/images/weekend-gift-set.svg",
};

function normalizeCategory(category: unknown): ProductCategory {
  if (typeof category === "string" && PRODUCT_CATEGORIES.includes(category as ProductCategory)) {
    return category as ProductCategory;
  }

  return "Accessories";
}

function normalizeTags(tags: unknown, name: string, category: ProductCategory) {
  if (Array.isArray(tags)) {
    const filtered = tags.filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0);
    if (filtered.length > 0) {
      return filtered;
    }
  }

  return [category, name.split(" ")[0] ?? "Catalog"];
}

function normalizePrice(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Number(value.toFixed(2)));
}

function normalizeStock(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.floor(value));
}

export function prepareProductFormValues(values: ProductFormValues) {
  const normalizedValues: ProductFormValues = {
    ...values,
    name: values.name.trim(),
    description: values.description.trim(),
    price: normalizePrice(values.price),
    stockQuantity: normalizeStock(values.stockQuantity),
  };
  const errors: ProductFormErrors = {};

  if (!normalizedValues.name) {
    errors.name = "Enter a product name.";
  }

  if (!normalizedValues.description) {
    errors.description = "Enter a product description.";
  }

  if (normalizedValues.price <= 0) {
    errors.price = "Enter a price greater than 0.";
  }

  if (!Number.isInteger(normalizedValues.stockQuantity) || normalizedValues.stockQuantity < 0) {
    errors.stockQuantity = "Enter a stock quantity of 0 or more.";
  }

  return {
    values: normalizedValues,
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

export function slugifyProductName(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "catalog-item";
}

function ensureUniqueSlug(baseSlug: string, usedSlugs: Set<string>) {
  if (!usedSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let suffix = 2;
  while (usedSlugs.has(`${baseSlug}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseSlug}-${suffix}`;
}

export function normalizeProductRecord(candidate: RawProductRecord, index = 0): Product {
  const name = typeof candidate.name === "string" && candidate.name.trim() ? candidate.name.trim() : `Product ${index + 1}`;
  const category = normalizeCategory(candidate.category);
  const slug = typeof candidate.slug === "string" && candidate.slug.trim() ? candidate.slug.trim() : slugifyProductName(name);
  const stockQuantity = normalizeStock(candidate.stockQuantity ?? candidate.inventory ?? 0);

  return {
    id: typeof candidate.id === "string" && candidate.id.trim() ? candidate.id.trim() : `prod-${slug}`,
    slug,
    name,
    description: typeof candidate.description === "string" ? candidate.description.trim() : "",
    price: normalizePrice(candidate.price),
    category,
    image: typeof candidate.image === "string" && candidate.image.trim() ? candidate.image : DEFAULT_PRODUCT_IMAGES[category],
    featured: typeof candidate.featured === "boolean" ? candidate.featured : false,
    stockQuantity,
    isActive: typeof candidate.isActive === "boolean" ? candidate.isActive : typeof candidate.active === "boolean" ? candidate.active : true,
    rating: typeof candidate.rating === "number" && Number.isFinite(candidate.rating) ? candidate.rating : 4.6,
    tags: normalizeTags(candidate.tags, name, category),
  };
}

const normalizedSeedProducts = (seedProducts as RawProductRecord[]).map((product, index) => normalizeProductRecord(product, index));

function cloneProducts(products: Product[]) {
  return products.map((product) => ({
    ...product,
    tags: [...product.tags],
  }));
}

export function getSeedProducts() {
  return cloneProducts(normalizedSeedProducts);
}

function normalizeStoredProducts(items: unknown) {
  if (!Array.isArray(items)) {
    return getSeedProducts();
  }

  const normalized = items.map((item, index) => normalizeProductRecord((item ?? {}) as RawProductRecord, index));
  return normalized.length > 0 ? normalized : getSeedProducts();
}

export function readStoredProducts() {
  if (typeof window === "undefined") {
    return getSeedProducts();
  }

  try {
    const rawValue = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!rawValue) {
      return getSeedProducts();
    }

    return normalizeStoredProducts(JSON.parse(rawValue));
  } catch {
    return getSeedProducts();
  }
}

export function writeStoredProducts(products: Product[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(cloneProducts(products)));
}

export function upsertProduct(products: Product[], values: ProductFormValues) {
  const existingProduct = values.id ? products.find((product) => product.id === values.id) : undefined;
  const name = values.name.trim();
  const baseSlug = slugifyProductName(name);
  const usedSlugs = new Set(
    products.filter((product) => product.id !== existingProduct?.id).map((product) => product.slug),
  );
  const slug = ensureUniqueSlug(baseSlug, usedSlugs);

  const nextProduct = normalizeProductRecord({
    ...existingProduct,
    id: existingProduct?.id ?? `prod-${slug}`,
    slug,
    name,
    description: values.description.trim(),
    price: values.price,
    category: values.category,
    stockQuantity: values.stockQuantity,
    isActive: values.isActive,
    image: existingProduct?.image ?? DEFAULT_PRODUCT_IMAGES[values.category],
    featured: existingProduct?.featured ?? false,
    rating: existingProduct?.rating ?? 4.6,
    tags: existingProduct?.tags ?? [values.category, "Managed"],
  });

  if (!existingProduct) {
    return [nextProduct, ...products];
  }

  return products.map((product) => (product.id === existingProduct.id ? nextProduct : product));
}

export function setProductStock(products: Product[], productId: string, stockQuantity: number) {
  return products.map((product) => (
    product.id === productId
      ? {
          ...product,
          stockQuantity: normalizeStock(stockQuantity),
        }
      : product
  ));
}

export function toggleProductActive(products: Product[], productId: string) {
  return products.map((product) => (
    product.id === productId
      ? {
          ...product,
          isActive: !product.isActive,
        }
      : product
  ));
}

export function getProductCategories(products: Product[]) {
  return Array.from(new Set(products.map((product) => product.category))).sort((left, right) => left.localeCompare(right));
}
