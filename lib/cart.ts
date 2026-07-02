import { normalizeProductRecord } from "@/lib/product-management";
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

function clampQuantity(quantity: number, stockQuantity: number) {
  const safeMax = Math.max(1, Math.floor(stockQuantity));
  return Math.min(Math.max(1, Math.floor(quantity)), safeMax);
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
    if (!candidate.product || typeof candidate.product !== "object") {
      return [];
    }

    if (typeof candidate.quantity !== "number" || !Number.isFinite(candidate.quantity)) {
      return [];
    }

    const product = normalizeProductRecord(candidate.product as Product);
    if (product.stockQuantity < 1 || !product.isActive) {
      return [];
    }

    return [{
      product,
      quantity: clampQuantity(candidate.quantity, product.stockQuantity),
    }];
  });
}

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD_ITEM": {
      if (action.product.stockQuantity < 1 || !action.product.isActive) {
        return state;
      }

      const quantity = Math.max(1, action.quantity ?? 1);
      const existing = state.find((item) => item.product.id === action.product.id);

      if (!existing) {
        return [...state, { product: action.product, quantity: clampQuantity(quantity, action.product.stockQuantity) }];
      }

      return state.map((item) =>
        item.product.id === action.product.id
          ? {
              ...item,
              quantity: clampQuantity(item.quantity + quantity, item.product.stockQuantity),
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
              quantity: clampQuantity(action.quantity, item.product.stockQuantity),
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
