"use client";

import { getProductsByCategoryId } from "@/sanity/lib/products/getProductsByCategoryId";
import { Category, Product } from "@/sanity/types/sanity.types";
import useCategoryStore from "@/store/CategoriesStore";
import { useEffect, useState } from "react";
import CategorySelector from "../CategorySelector";
import ProductsGrid from "./ProductsGrid";

type Props = {
  products: Product[];
  categories: Category[];
};
const ProductsView = ({ products, categories }: Props) => {
  const [updatedProducts, setUpdatedProducts] = useState<Product[]>(products);
  const { category } = useCategoryStore();

  useEffect(() => {
    const getProducts = async () => {
      if (category && category !== "all") {
        return await getProductsByCategoryId(category);
      } else {
        return products;
      }
    };
    getProducts().then((res) => setUpdatedProducts(res));
  }, [category]);

  return (
    <section className="flex flex-col">
      {/* Categories */}
      <div className="w-full sm:w-[200px]">
        <CategorySelector categories={categories} />
      </div>
      {/* Products */}
      <div className="flex-1">
        <div>
          <ProductsGrid products={updatedProducts} />
          <hr className="w-1/2 sm:w-3/4" />
        </div>
      </div>
    </section>
  );
};
export default ProductsView;
