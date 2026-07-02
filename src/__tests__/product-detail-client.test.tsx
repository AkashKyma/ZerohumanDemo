import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import type { Product } from "@/types/product";

const activeSeedProduct: Product = {
  id: "prod-aurora",
  slug: "aurora-roast",
  name: "Aurora Roast",
  description: "Bright seasonal espresso.",
  price: 18,
  category: "Coffee",
  image: "/images/aurora-espresso.svg",
  featured: true,
  stockQuantity: 6,
  isActive: true,
  rating: 4.7,
  tags: ["Coffee", "Seasonal"],
};

const inactiveStoredProduct: Product = {
  ...activeSeedProduct,
  isActive: false,
};

const getSeedProductsMock = vi.fn(() => [activeSeedProduct]);
const readStoredProductsMock = vi.fn(() => [activeSeedProduct]);
const getProductBySlugMock = vi.fn(() => activeSeedProduct);

vi.mock("@/components/ProductDetailView", () => ({
  ProductDetailView: ({ product }: { product: Product }) => <div>{product.name}</div>,
}));

vi.mock("@/lib/product-management", () => ({
  getSeedProducts: () => getSeedProductsMock(),
  readStoredProducts: () => readStoredProductsMock(),
}));

vi.mock("@/lib/products", () => ({
  getProductBySlug: (slug: string) => getProductBySlugMock(slug),
}));

describe("ProductDetailClient", () => {
  beforeEach(() => {
    getSeedProductsMock.mockReturnValue([activeSeedProduct]);
    readStoredProductsMock.mockReturnValue([activeSeedProduct]);
    getProductBySlugMock.mockReturnValue(activeSeedProduct);
  });

  it("renders a loading shell before hydration and the active product after hydration", async () => {
    const serverMarkup = renderToString(<ProductDetailClient slug="aurora-roast" />);

    expect(serverMarkup).toContain("Loading product details…");
    expect(serverMarkup).not.toContain("Aurora Roast");

    render(<ProductDetailClient slug="aurora-roast" />);

    await waitFor(() => {
      expect(screen.getByText("Aurora Roast")).toBeInTheDocument();
    });
  });

  it("never exposes inactive products on the storefront detail route", async () => {
    readStoredProductsMock.mockReturnValue([inactiveStoredProduct]);

    const serverMarkup = renderToString(<ProductDetailClient slug="aurora-roast" />);

    expect(serverMarkup).toContain("Loading product details…");
    expect(serverMarkup).not.toContain("Aurora Roast");

    render(<ProductDetailClient slug="aurora-roast" />);

    await waitFor(() => {
      expect(screen.getByText("Product not found")).toBeInTheDocument();
    });
    expect(screen.queryByText("Aurora Roast")).not.toBeInTheDocument();
  });
});
