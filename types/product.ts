export type ProductCategory =
  | "Coffee"
  | "Tea"
  | "Accessories"
  | "Gift Sets";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  featured: boolean;
  inventory: number;
  rating: number;
  tags: string[];
}
