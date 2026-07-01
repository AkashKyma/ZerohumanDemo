import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/ProductDetailView";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product.id, product.category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <ProductDetailView product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
