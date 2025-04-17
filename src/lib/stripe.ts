import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  throw new Error("Missing Stripe secret key");
}

const stripe = new Stripe(secretKey, {
  apiVersion: "2025-03-31.basil",
  typescript: true,
});

export default stripe;
