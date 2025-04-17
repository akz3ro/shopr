"use server";

import { imageUrlFor } from "@/lib/imageUrlFor";
import stripe from "@/lib/stripe";
import { BasketItem } from "@/store/BasketStore";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
};

export const createCheckoutSession = async (
  items: BasketItem[],
  metadata: Metadata
): Promise<string> => {
  try {
    await auth.protect();

    const filteredItems = items.filter(
      (item) =>
        !item.product.price ||
        item.product.price < 0 ||
        item.product.stoke == null ||
        item.product.stoke <= 0
    );
    if (filteredItems.length > 0) {
      throw new Error("Invalid items in the basket");
    }

    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      throw new Error("Base URL is not defined");
    }

    const success_url = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`;
    const cancel_url = `${baseUrl}/basket`;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_creation: customerId ? undefined : "always",
      customer_email: !customerId ? metadata.customerEmail : undefined,
      metadata,
      mode: "payment",
      allow_promotion_codes: true,
      success_url,
      cancel_url,
      line_items: items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(item.product.price! * 100),
          product_data: {
            name: item.product.title ?? "Unknown Product",
            description: `Product ID: ${item.product._id}`,
            images: item.product.image
              ? [imageUrlFor(item.product.image).url()]
              : undefined,
            metadata: {
              id: item.product._id,
            },
          },
        },
      })),
    });

    if (!session.url) {
      throw new Error("Checkout session URL is not available");
    }

    revalidatePath("/basket");
    revalidatePath("/orders");
    return session.url;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};
