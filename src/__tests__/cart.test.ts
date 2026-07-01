import products from "@/data/products.json";
import { CART_STORAGE_KEY, calculateItemCount, calculateSubtotal, cartReducer, readStoredCart, writeStoredCart } from "@/lib/cart";
import type { Product } from "@/types/product";

const sampleProduct = products[0] as Product;

describe("cartReducer", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("adds items and merges duplicate products", () => {
    const firstPass = cartReducer([], { type: "ADD_ITEM", product: sampleProduct, quantity: 1 });
    const secondPass = cartReducer(firstPass, { type: "ADD_ITEM", product: sampleProduct, quantity: 2 });

    expect(secondPass).toHaveLength(1);
    expect(secondPass[0].quantity).toBe(3);
    expect(calculateItemCount(secondPass)).toBe(3);
    expect(calculateSubtotal(secondPass)).toBe(sampleProduct.price * 3);
  });

  it("persists and restores cart state", () => {
    const state = cartReducer([], { type: "ADD_ITEM", product: sampleProduct, quantity: 2 });
    writeStoredCart(state);

    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    expect(stored).toBeTruthy();
    expect(readStoredCart()).toEqual(state);
  });

  it("clamps quantity updates to inventory", () => {
    const state = cartReducer([], { type: "ADD_ITEM", product: sampleProduct, quantity: sampleProduct.inventory + 5 });
    expect(state[0].quantity).toBe(sampleProduct.inventory);
  });
});
