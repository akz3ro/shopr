"use client";
import { cn } from "@/lib/utils";
import { Product } from "@/sanity/types/sanity.types";
import useBasketStore from "@/store/BasketStore";
import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";

type Props = {
  product: Product;
};
const BasketButton = ({ product }: Props) => {
  const { addToBasket, removeFromBasket, getItemCount } = useBasketStore();
  const itemCount = getItemCount(product._id);
  const disabled = product?.stoke != null && product?.stoke <= 0;

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="default"
        size="icon"
        className={cn(
          "w-8 h-8 rounded-full transition-colors duration-200",
          disabled || itemCount === 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gray-400 hover:bg-gray-500 text-gray-600"
        )}
        onClick={() => removeFromBasket(product._id)}
        aria-label="Remove to basket"
        disabled={disabled || itemCount === 0}
      >
        <Minus className="!w-5 !h-5" />
      </Button>

      <span className="w-8 text-center font-semibold">
        {disabled ? 0 : itemCount}
      </span>

      <Button
        variant="default"
        size="icon"
        className={cn(
          "w-8 h-8 rounded-full transition-colors duration-200",
          disabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        )}
        onClick={() => addToBasket(product)}
        aria-label="Add to basket"
        disabled={
          disabled || Boolean(product.stoke && itemCount >= product.stoke)
        }
      >
        <Plus className="!w-5 !h-5" />
      </Button>
    </div>
  );
};
export default BasketButton;
