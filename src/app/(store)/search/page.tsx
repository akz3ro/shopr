import ProductsGrid from "@/components/products/ProductsGrid";
import { getSearchProducts } from "@/sanity/lib/products/getSearchProducts";

const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) => {
  const { query } = await searchParams;

  const products = await getSearchProducts(query);

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-top bg-gray-100 p-4 min-h-screen">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl w-full text-center">
          <h1 className="text-3xl font-bold mb-4">
            No products found for: {query}
          </h1>
          <p className="text-gray-600">Try a different search term.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-top bg-gray-100 p-4 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl w-full text-center">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Search results for: {query}
        </h1>
        <ProductsGrid products={products} />
      </div>
    </div>
  );
};
export default SearchPage;
