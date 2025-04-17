"use client";
import { Product } from "@/sanity/types/sanity.types";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
};

const variants = {
  hidden: { opacity: 0.2 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};
const ProductsGrid = ({ products }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {products.map((product) => (
        <AnimatePresence key={product._id}>
          <motion.div
            layout
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
          >
            <ProductCard product={product} />
          </motion.div>
        </AnimatePresence>
      ))}
    </div>
  );
};
export default ProductsGrid;
