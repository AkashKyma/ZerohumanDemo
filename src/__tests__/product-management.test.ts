import {
  PRODUCTS_STORAGE_KEY,
  getSeedProducts,
  prepareProductFormValues,
  readStoredProducts,
  setProductStock,
  toggleProductActive,
  upsertProduct,
  writeStoredProducts,
} from "@/lib/product-management";

describe("product management utilities", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("creates a new product with a normalized slug", () => {
    const products = upsertProduct(getSeedProducts(), {
      name: "Summer Matcha Kit",
      description: "A seasonal bundle for iced matcha drinks.",
      price: 54,
      category: "Gift Sets",
      stockQuantity: 12,
      isActive: true,
    });

    expect(products[0]).toMatchObject({
      name: "Summer Matcha Kit",
      slug: "summer-matcha-kit",
      category: "Gift Sets",
      stockQuantity: 12,
      isActive: true,
    });
  });

  it("updates stock and active status", () => {
    const [firstProduct] = getSeedProducts();
    const withUpdatedStock = setProductStock(getSeedProducts(), firstProduct.id, 0);
    const toggledProducts = toggleProductActive(withUpdatedStock, firstProduct.id);
    const updatedProduct = toggledProducts.find((product) => product.id === firstProduct.id);

    expect(updatedProduct).toMatchObject({
      stockQuantity: 0,
      isActive: false,
    });
  });

  it("persists catalog changes to local storage", () => {
    const products = upsertProduct(getSeedProducts(), {
      name: "Desk Tasting Flight",
      description: "Three compact bags for office brew bars.",
      price: 39,
      category: "Coffee",
      stockQuantity: 9,
      isActive: false,
    });

    writeStoredProducts(products);

    expect(window.localStorage.getItem(PRODUCTS_STORAGE_KEY)).toBeTruthy();
    expect(readStoredProducts()[0]).toMatchObject({
      name: "Desk Tasting Flight",
      isActive: false,
      stockQuantity: 9,
    });
  });

  it("falls back to seed products when stored data is invalid", () => {
    window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify({ bad: true }));

    const products = readStoredProducts();

    expect(products).toHaveLength(getSeedProducts().length);
    expect(products[0].id).toBe(getSeedProducts()[0].id);
  });

  it("normalizes form input and reports invalid values", () => {
    const submission = prepareProductFormValues({
      name: "   ",
      description: "  ",
      price: -5.239,
      category: "Coffee",
      stockQuantity: -2.4,
      isActive: true,
    });

    expect(submission.isValid).toBe(false);
    expect(submission.values).toMatchObject({
      name: "",
      description: "",
      price: 0,
      stockQuantity: 0,
    });
    expect(submission.errors).toMatchObject({
      name: "Enter a product name.",
      description: "Enter a product description.",
      price: "Enter a price greater than 0.",
    });
  });
});
