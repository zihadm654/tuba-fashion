import { z } from "zod";

export const productSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(["draft", "published", "archived"]),
  price: z.coerce.number().min(1),
  discountPercentage: z.coerce.number().min(0).max(100).optional(),
  discountStart: z.date().optional(),
  discountEnd: z.date().optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  category: z.enum(["men", "women", "kids"]),
  quantity: z.coerce.number().min(1).default(0),
  color: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  size: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  febric: z
    .string()
    .min(3, "Febric must be at least 3 characters long")
    .optional(),
  isFeatured: z.boolean().default(false),
});
export const bannerSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  imageString: z.string().min(3, "Image must be at least 3 characters long"),
});

export type TProduct = z.infer<typeof productSchema>;
export type TBanner = z.infer<typeof bannerSchema>;
