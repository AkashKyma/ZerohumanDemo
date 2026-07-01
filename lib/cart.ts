import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

export const CART_STORAGE_KEY = "dem2-store-cart";

export type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity?: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE_CART"; items: CartItem[] };

export function calculateSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
}

export function calculateItemCount(items: CartItem[]) {
  return items.reduce((count, item) => count + item.quantity, 0);
}

function clampQuantity(quantity: number, inventory: number) {
  return Math.min(Math.max(1, quantity), inventory);
}

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") {
    return false;
  }

  const product = value as Partial<Product>;
  return (
    typeof product.id === "string" &&
    typeof product.slug === "string" &&
    typeof product.name === "string" &&
    typeof product.description === "string" &&
    typeof product.price === "number" &&
    Number.isFinite(product.price) &&
    typeof product.category === "string" &&
    typeof product.image === "string" &&
    typeof product.featured === "boolean" &&
    typeof product.inventory === "number" &&
    Number.isFinite(product.inventory) &&
    product.inventory > 0 &&
    typeof product.rating === "number" &&
    Number.isFinite(product.rating) &&
    Array.isArray(product.tags)
  );
}

function normalizeCartItems(items: unknown): CartItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const candidate = item as Partial<CartItem>;
    if (!isProduct(candidate.product) || typeof candidate.quantity !== "number" || !Number.isFinite(candidate.quantity)) {
      return [];
    }

    return [{
      product: candidate.product,
      quantity: clampQuantity(Math.floor(candidate.quantity), candidate.product.inventory),
    }];
  });
}

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD_ITEM": {
      const quantity = Math.max(1, action.quantity ?? 1);
      const existing = state.find((item) => item.product.id === action.product.id);

      if (!existing) {
        return [...state, { product: action.product, quantity: clampQuantity(quantity, action.product.inventory) }];
      }

      return state.map((item) =>
        item.product.id === action.product.id
          ? {
              ...item,
              quantity: clampQuantity(item.quantity + quantity, item.product.inventory),
            }
          : item,
      );
    }
    case "REMOVE_ITEM":
      return state.filter((item) => item.product.id !== action.productId);
    case "UPDATE_QUANTITY":
      return state.map((item) =>
        item.product.id === action.productId
          ? {
              ...item,
              quantity: clampQuantity(action.quantity, item.product.inventory),
            }
          : item,
      );
    case "CLEAR_CART":
      return [];
    case "HYDRATE_CART":
      return normalizeCartItems(action.items);
    default:
      return state;
  }
}

export function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue) as unknown;
    return normalizeCartItems(parsed);
  } catch {
    return [];
  }
}

export function writeStoredCart(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalizeCartItems(items)));
}
