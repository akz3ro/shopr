import { BasketIcon, TrolleyIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required().error("Order number is required"),
    }),
    defineField({
      name: "stripeCheckoutSessionId",
      title: "Stripe Checkout Session ID",
      type: "string",
    }),
    defineField({
      name: "stripeCustomerId",
      title: "Stripe Customer ID",
      type: "string",
      validation: (Rule) =>
        Rule.required().error("Stripe customer ID is required"),
    }),
    defineField({
      name: "stripePaymentIntentId",
      title: "Stripe Payment Intent ID",
      type: "string",
      validation: (Rule) =>
        Rule.required().error("Stripe payment intent ID is required"),
    }),
    defineField({
      name: "clerkUserId",
      title: "Clerk User ID",
      type: "string",
      validation: (Rule) => Rule.required().error("Clerk user ID is required"),
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required().error("Customer name is required"),
    }),
    defineField({
      name: "customerEmail",
      title: "Customer Email",
      type: "string",
      validation: (Rule) => Rule.required().error("Customer email is required"),
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",

          fields: [
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: { type: "product" },
            }),
            defineField({
              name: "quantity",
              title: "Quantity Purchased",
              type: "number",
              initialValue: 1,
            }),
          ],
          preview: {
            select: {
              product: "product.title",
              image: "product.image",
              quantity: "quantity",
              price: "product.price",
              currency: "product.currency",
            },
            prepare(selection) {
              const { product, image, quantity, price, currency } = selection;
              return {
                title: `${product} x ${quantity}`,
                subtitle: `${+price * +quantity} ${currency}`,
                media: image || TrolleyIcon,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      validation: (Rule) =>
        Rule.required().min(0).error("Total price is required"),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      validation: (Rule) => Rule.required().error("Currency is required"),
    }),
    defineField({
      name: "amountDiscount",
      title: "Amount Discount",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required().error("Order status is required"),
    }),
    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      validation: (Rule) => Rule.required().error("Order date is required"),
    }),
  ],
  preview: {
    select: {
      name: "customerName",
      amount: "totalPrice",
      currency: "currency",
      email: "customerEmail",
      orderId: "orderNumber",
    },
    prepare(selection) {
      const { name, amount, currency, email, orderId } = selection;
      const orderSnippet = `${orderId.slice(0, 5)}...${orderId.slice(-5)}`;
      return {
        title: `${name} - (${orderSnippet})`,
        subtitle: `${amount} ${currency}, ${email}`,
        media: BasketIcon,
      };
    },
  },
});
