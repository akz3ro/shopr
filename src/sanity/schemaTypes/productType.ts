import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  groups: [
    {
      name: "details",
      title: "Details",
    },
    {
      name: "media",
      title: "Media",
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Product Title",
      type: "string",
      group: "details",
      validation: (Rule) => Rule.required().error("Product name is required"),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "details",
      options: {
        source: "title",
        maxLength: 96,
      },
      hidden: ({ document }) => !document?.title,
      validation: (Rule) => Rule.required().error("Product slug is required"),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      group: "media",
      options: {
        hotspot: true,
        accept: "image/*",
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
      group: "details",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      group: "details",
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "details",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "stoke",
      title: "Stoke",
      type: "number",
      group: "details",
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      group: "details",
      initialValue: "USD",
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "price",
      media: "image",
    },

    prepare(selection) {
      const { title, media, subtitle } = selection;
      return {
        title: title || "No title",
        subtitle: subtitle || "No Price",
        media: media || TrolleyIcon,
      };
    },
  },
});
