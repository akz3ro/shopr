import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getOrders = async (userId: string) => {
  const orderQuery = defineQuery(`*[
    _type == "order" && clerkUserId == $userId] | order(orderDate desc) {
      ...,
      products[] {
        ...,
        product->
      }
    }`);

  const res = await sanityFetch({
    query: orderQuery,
    requestTag: "getOrders",
    params: { userId },
  });

  return res.data || [];
};
