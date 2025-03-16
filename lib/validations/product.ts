import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),

  // Price and discount fields with proper validation
  price: z.coerce.number().min(0, "Price must be positive").default(100),
  discount: z.coerce
    .number()
    .min(0, "Discount must be positive")
    .max(100, "Discount cannot exceed 100%")
    .default(0),
  discountStart: z.date().optional().nullable(),
  discountEnd: z.date().optional().nullable(),
  stock: z.coerce.number().min(0, "Stock must be non-negative").default(0),

  // Product status
  status: z.enum(["draft", "published", "archived"]),

  // Boolean flags
  isPhysical: z.boolean().default(true),
  isAvailable: z.boolean().default(false),
  isFeatured: z.boolean().default(false),

  // Product attributes
  color: z.array(z.string()).min(1, "At least one color is required"),
  size: z.array(z.string()).min(1, "At least one size is required"),
  febric: z.string().optional().nullable(),

  // Relations
  brands: z.array(z.string()).min(1, "At least one brand is required"),
  categories: z.array(z.string()).min(1, "At least one category is required"),

  // Optional metadata
  // metdata: z.record(z.any()).optional().nullable(),
});

export const bannerSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  imageString: z.string().min(3, "Image must be at least 3 characters long"),
  categoryId: z.string().optional().nullable(),
});
export const categorySchema = z.object({
  bannerId: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
});
export const brandSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
  logo: z.string().optional(),
});
export const addressSchema = z.object({
  address: z.string().min(3, "Address must be at least 3 characters long"),
  city: z.string().min(3, "City must be at least 3 characters long"),
  postalCode: z
    .string()
    .min(3, "Postal code must be at least 3 characters long"),
  phone: z.string().min(3, "Phone must be at least 3 characters long"),
});

export type TProduct = z.infer<typeof productSchema>;
export type TBanner = z.infer<typeof bannerSchema>;
export type TCategory = z.infer<typeof categorySchema>;
export type TBrand = z.infer<typeof brandSchema>;
export type TAddress = z.infer<typeof addressSchema>;
