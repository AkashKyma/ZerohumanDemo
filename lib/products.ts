import { getSeedProducts } from "@/lib/product-management";
import type { Product } from "@/types/product";

const allProducts = getSeedProducts();

interface GetAllProductsOptions {
  includeInactive?: boolean;
}

export function getAllProducts(options: GetAllProductsOptions = {}) {
  if (options.includeInactive) {
    return allProducts;
  }

  return allProducts.filter((product) => product.isActive);
}

export function getFeaturedProducts() {
  return getAllProducts().filter((product) => product.featured);
}

export function getProductBySlug(slug: string, options: GetAllProductsOptions = {}) {
  return getAllProducts({ includeInactive: options.includeInactive ?? true }).find((product) => product.slug === slug);
}

export function getCategories(options: GetAllProductsOptions = {}) {
  return Array.from(new Set(getAllProducts(options).map((product) => product.category)));
}

export function getRelatedProducts(currentProductId: string, category: Product["category"], options: GetAllProductsOptions = {}) {
  return getAllProducts(options)
    .filter((product) => product.id !== currentProductId && product.category === category)
    .slice(0, 3);
}
