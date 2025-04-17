import { getActiveSaleByCoupon } from "@/sanity/lib/sales/getActiveSaleByCoupon";
import { PortableText } from "next-sanity";

const SaleBanner = async () => {
  const sale = await getActiveSaleByCoupon("AKZERO");

  if (!sale?.isActive) {
    return null;
  }

  return (
    <section className="bg-gradient-to-r from-red-600 to-black text-white px-6 py-10 mx-4 mt-2 rounded-lg shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-left mb-4">
            {sale.title}
          </h2>

          <div className="prose text-white">
            {Array.isArray(sale.description) &&
              sale.description.map((block) => (
                <PortableText key={block._key} value={block} />
              ))}
          </div>

          <div className="flex">
            <p className="bg-white text-black font-bold px-4 py-2 rounded-full mt-4 flex gap-1 shadow-md transform hover:scale-105 transition duration-300 text-base sm:text-xl">
              <span>Use code:</span>
              <span className="text-red-600">{sale.couponCode}</span>
              <span>for {sale.discountAmount}%</span>
              <span className="uppercase">off</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default SaleBanner;
