"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import {
  calculateItemCount,
  calculateSubtotal,
  cartReducer,
  readStoredCart,
  writeStoredCart,
} from "@/lib/cart";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  hydrated: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [] as CartItem[]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    dispatch({ type: "HYDRATE_CART", items: readStoredCart() });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    writeStoredCart(items);
  }, [hydrated, items]);

  const addItem = useCallback((product: Product, quantity?: number) => {
    dispatch({ type: "ADD_ITEM", product, quantity });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_ITEM", productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const value = useMemo(
    () => ({
      items,
      itemCount: calculateItemCount(items),
      subtotal: calculateSubtotal(items),
      hydrated,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [addItem, clearCart, hydrated, items, removeItem, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
