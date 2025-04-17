"use server";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductsByCategoryId = async (categoryId: string) => {
  const productsByCategoryIdQuery = defineQuery(`*[
      _type == "product"
      && references($categoryId)
      ] | order(title asc)`);

  try {
    const res = await sanityFetch({
      query: productsByCategoryIdQuery,
      params: {
        categoryId: `${categoryId}`,
      },
      requestTag: "getProductsByCategoryId",
    });
    return res.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
