import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "products",
      type: "array",
      of: [{ type: "reference", to: { type: "product" } }],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },

    prepare(selection) {
      const { title } = selection;
      return {
        title: title || "No title",
        media: TagIcon,
      };
    },
  },
});
