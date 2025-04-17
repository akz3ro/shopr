import BasketButton from "@/components/basket/BasketButton";
import { imageUrlFor } from "@/lib/imageUrlFor";
import { cn } from "@/lib/utils";
import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import { PortableText } from "next-sanity";
import Image from "next/image";
import { notFound } from "next/navigation";

// export const dynamic = "force-static";
// export const revalidate = 10800;

const ProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  const isOutOfStock = product?.stoke != null && product?.stoke <= 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className={cn(
            "relative aspect-square overflow-hidden rounded-lg shadow-lg",
            isOutOfStock && "opacity-50"
          )}
        >
          {product?.image && (
            <Image
              src={imageUrlFor(product.image).url()}
              alt={product.title || "Product Image"}
              fill
              className="object-contain transition-transform duration-300 hover:scale-105"
              priority
            />
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold text-xl">
              Out of Stock
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-xl font-semibold mb-4">
              <span>$</span>
              <span>{product.price?.toFixed(2)}</span>
            </p>

            <div className="prose max-w-none mb-6">
              {Array.isArray(product.description) && (
                <PortableText value={product.description} />
              )}
            </div>
          </div>

          <div>
            <BasketButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductPage;
