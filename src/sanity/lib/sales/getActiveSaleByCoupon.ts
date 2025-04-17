"use server";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { CouponCode } from "./couponCodes";
/**
 * Fetch a single active sale by its coupon code.
 * @param coupon - The coupon code of the sale to fetch.
 * @returns The sale data or null if not found.
 */

export const getActiveSaleByCoupon = async (coupon: CouponCode) => {
  const saleByCouponQuery = defineQuery(
    '*[_type == "sale" && couponCode == $coupon && isActive == true] | order(startDate desc)[0]'
  );

  const res = await sanityFetch({
    query: saleByCouponQuery,
    requestTag: "getActiveSaleByCoupon",
    params: { coupon },
  });

  return res.data || null;
};
