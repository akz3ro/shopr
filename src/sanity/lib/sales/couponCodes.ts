export const COUPON_CODES = ["WFRIDAY", "FREE", "HALFPRICE", "AKZERO"] as const;
export type CouponCode = (typeof COUPON_CODES)[number];
