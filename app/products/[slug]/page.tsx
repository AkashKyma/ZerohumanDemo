import { ProductDetailClient } from "@/components/ProductDetailClient";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <ProductDetailClient slug={params.slug} />
    </div>
  );
}
