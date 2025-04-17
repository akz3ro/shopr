"use server";

import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllProducts = async () => {
  const allProductsQuery = defineQuery(`*[_type == "product"]
    | order(title asc)
      `);
  try {
    const res = await sanityFetch({
      query: allProductsQuery,
      requestTag: "getAllProducts",
    });

    return res.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
