import { z } from "zod";

export const productSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(["draft", "published", "archived"]),
  price: z.coerce.number().min(1),
  images: z.array(z.string()).min(1, "At least one image is required"),
  category: z.enum(["men", "women", "kids"]),
  quantity: z.coerce.number().min(1),
  isFeatured: z.boolean().optional(),
});
export const bannerSchema = z.object({
  title: z.string(),
  imageString: z.string(),
});

export type TProduct = z.infer<typeof productSchema>;
