import { Metadata } from "@/actions/createCheckoutSession";
import stripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();

  const sig = headersList.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      {
        error: "No stripe signature",
      },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      {
        error: "No stripe webhook secret",
      },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error("Error constructing Stripe event:", error);
    return NextResponse.json(
      {
        error: "Webhook Error",
      },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await createOrderInSanity(session);
    } catch (error) {
      console.error("Error creating order in Sanity:", error);
      return NextResponse.json(
        {
          error: "Error creating order in Sanity",
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    {
      received: true,
    },
    { status: 200 }
  );
}

const createOrderInSanity = async (session: Stripe.Checkout.Session) => {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    customer,
    total_details,
  } = session;

  const { orderNumber, customerName, customerEmail, clerkUserId } =
    metadata as Metadata;

  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
    id,
    {
      expand: ["data.price.product"],
    }
  );

  const sanityProducts = lineItemsWithProduct.data.map((item) => ({
    _key: crypto.randomUUID(),
    quantity: item.quantity || 0,
    product: {
      _type: "reference",
      _ref: (item.price?.product as Stripe.Product).metadata.id,
    },
  }));

  try {
    await backendClient.create({
      _type: "order",
      orderNumber,
      customerName,
      currency,
      stripeCheckoutSessionId: id,
      stripePaymentIntentId: payment_intent,
      stripeCustomerId: customer,
      clerkUserId,
      products: sanityProducts,
      orderDate: new Date().toISOString(),
      customerEmail,
      amountDiscount: total_details?.amount_discount
        ? total_details.amount_discount / 100
        : 0,
      status: "paid",
      totalPrice: amount_total ? amount_total / 100 : 0,
    });
  } catch (error) {
    console.error("Error creating order in Sanity:", error);
    throw new Error("Error creating order in Sanity");
  }
};
