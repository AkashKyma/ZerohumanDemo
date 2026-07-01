import products from "@/data/products.json";
import type { Product } from "@/types/product";

const allProducts = products as Product[];

export function getAllProducts() {
  return allProducts;
}

export function getFeaturedProducts() {
  return allProducts.filter((product) => product.featured);
}

export function getProductBySlug(slug: string) {
  return allProducts.find((product) => product.slug === slug);
}

export function getCategories() {
  return Array.from(new Set(allProducts.map((product) => product.category)));
}

export function getRelatedProducts(currentProductId: string, category: Product["category"]) {
  return allProducts
    .filter((product) => product.id !== currentProductId && product.category === category)
    .slice(0, 3);
}
