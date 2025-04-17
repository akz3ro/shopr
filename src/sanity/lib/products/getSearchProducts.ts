"use server";

import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

/**
 * @param term string
 */

export const getSearchProducts = async (term: string) => {
  const searchProductsQuery = defineQuery(
    `*[
      _type == "product" &&
      (
        title match $term ||
        categories[]->title match $term ||
        slug.current match $term
      )
    ] | order(title asc)`
  );

  try {
    const res = await sanityFetch({
      query: searchProductsQuery,
      params: {
        term: `${term}*`,
      },
      requestTag: "getSearchProducts",
    });
    return res.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
