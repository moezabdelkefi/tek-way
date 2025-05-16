export default {
  name: "product",
  title: "Product Section",
  type: "document",
  fields: [
    {
      name: "image",
      title: "Image",
      type: "array",
      of: [{ type: "image" }],
      options: { hotspot: true },
    },
    { name: "name", title: "Name", type: "string" },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
    },
    { name: "price", title: "Price", type: "number" },
    {
      name: "details",
      title: "Details",
      type: "text",
      description: "Enter details in both Arabic and English if needed.",
      options: {
        direction: "auto", // Automatically adjusts direction based on input language
      },
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Smart Watch", value: "SmartWatch" },
          { title: "Airpod", value: "airpod" },
        ],
      },
    },
    {
      name: "discount",
      title: "Discount",
      type: "number",
      description: "Discount percentage for the product",
      validation: (Rule) => Rule.min(0).max(100),
    },
  ],
};
