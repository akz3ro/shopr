import { imageUrlFor } from "@/lib/imageUrlFor";
import { cn } from "@/lib/utils";
import { Product } from "@/sanity/types/sanity.types";
import Image from "next/image";
import Link from "next/link";

type Props = {
  product: Product;
};
const ProductCard = ({ product }: Props) => {
  const isOutOfStock = product.stoke != null && product.stoke <= 0;

  return (
    <Link
      href={`/product/${product.slug?.current}`}
      aria-label={`View ${product.title} product page`}
      className={cn(
        "group flex flex-col rounded-lg border bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden h-full",
        isOutOfStock && "opacity-50"
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden h-full">
        {product.image && (
          <Image
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            src={imageUrlFor(product.image).url()}
            alt={product.title || "Product Image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-white text-lg font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {product.title}
        </h2>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {product.description
            ?.map((block) =>
              block._type === "block"
                ? block.children?.map((child) => child.text).join("")
                : ""
            )
            .join("") || "No description available"}
        </p>

        <p className="mt-2 text-lg font-bold text-gray-900">
          ${product.price?.toFixed(2) || 0}
        </p>
      </div>
    </Link>
  );
};
export default ProductCard;
