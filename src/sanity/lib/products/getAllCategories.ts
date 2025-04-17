"use server";

import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllCategories = async () => {
  const allCategoriesQuery = defineQuery(`*[_type == "category"]
    | order(title asc)
      `);
  try {
    const res = await sanityFetch({
      query: allCategoriesQuery,
      requestTag: "getAllCategories",
    });

    return res.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
