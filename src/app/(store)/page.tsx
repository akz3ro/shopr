import ProductsView from "@/components/products/ProductsView";
import SaleBanner from "@/components/SaleBanner";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";

export const dynamic = "force-static";
export const revalidate = 10800;
export default async function Home() {
  const [productsRes, categoriesRes] = await Promise.allSettled([
    getAllProducts(),
    getAllCategories(),
  ]);

  const products = productsRes.status === "fulfilled" ? productsRes.value : [];

  const categories =
    categoriesRes.status === "fulfilled" ? categoriesRes.value : [];
  return (
    <main>
      <SaleBanner />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
        <ProductsView products={products} categories={categories} />
      </div>
    </main>
  );
}
