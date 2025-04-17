"use server";

import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

/**
 * Fetch a single product by its slug.
 * @param slug - The slug of the product to fetch.
 * @returns The product data or null if not found.
 */
export const getProductBySlug = async (slug: string) => {
  const productBySlugQuery = defineQuery(`*[
    _type == "product" && slug.current == $slug][0]
    `);
  try {
    const res = await sanityFetch({
      query: productBySlugQuery,
      params: {
        slug: `${slug}`,
      },
      requestTag: "getProductBySlug",
    });
    return res.data || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};
