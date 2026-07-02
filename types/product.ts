export const PRODUCT_CATEGORIES = ["Coffee", "Tea", "Accessories", "Gift Sets"] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  featured: boolean;
  stockQuantity: number;
  isActive: boolean;
  rating: number;
  tags: string[];
}
