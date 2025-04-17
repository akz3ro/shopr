import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const saleType = defineType({
  name: "sale",
  title: "Sales",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Sale Title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Sale Description",
      type: "blockContent",
    }),
    defineField({
      name: "discountAmount",
      title: "Discount Amount",
      type: "number",
      initialValue: 0,
      description: "Amount off in percentage or fixed value",
    }),
    defineField({
      name: "couponCode",
      title: "Coupon Code",
      type: "string",
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "datetime",
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "datetime",
    }),
    defineField({
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      initialValue: true,
      description: "Toggle to activate or deactivate the sale",
      options: {
        layout: "switch",
      },
    }),
  ],

  preview: {
    select: {
      title: "title",
      discountAmount: "discountAmount",
      couponCode: "couponCode",
      isActive: "isActive",
    },

    prepare(selection) {
      const { title, discountAmount, couponCode, isActive } = selection;
      return {
        title: title || "No title",
        subtitle: `${discountAmount}% off - Code: ${couponCode} - ${
          isActive ? "Active" : "Inactive"
        }`,
      };
    },
  },
});
