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

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD_ITEM": {
      const quantity = Math.max(1, action.quantity ?? 1);
      const existing = state.find((item) => item.product.id === action.product.id);

      if (!existing) {
        return [...state, { product: action.product, quantity: Math.min(quantity, action.product.inventory) }];
      }

      return state.map((item) =>
        item.product.id === action.product.id
          ? {
              ...item,
              quantity: Math.min(item.quantity + quantity, item.product.inventory),
            }
          : item,
      );
    }
    case "REMOVE_ITEM":
      return state.filter((item) => item.product.id !== action.productId);
    case "UPDATE_QUANTITY":
      return state
        .map((item) =>
          item.product.id === action.productId
            ? {
                ...item,
                quantity: Math.min(Math.max(1, action.quantity), item.product.inventory),
              }
            : item,
        )
        .filter((item) => item.quantity > 0);
    case "CLEAR_CART":
      return [];
    case "HYDRATE_CART":
      return action.items.filter((item) => item.quantity > 0 && item.product.inventory > 0);
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

    const parsed = JSON.parse(rawValue) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeStoredCart(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}
