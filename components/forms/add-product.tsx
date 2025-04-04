"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { imageRemove } from "@/actions/image-remove";
import { addProduct, updateProduct } from "@/actions/product";
import { ProductWithIncludes } from "@/types";
import { UploadDropzone } from "@/utils/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { Brand, Category } from "@prisma/client";
import { Loader2, PencilLine, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { colors, sizes } from "@/config/categories";
import { productSchema, TProduct } from "@/lib/validations/product";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { TagsDemo } from "../shared/tag-select";
import { Checkbox } from "../ui/checkbox";
import { DatePickerWithRange } from "../ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

interface AddProductProps {
  product?: ProductWithIncludes | null;
  userId: string;
  categories: Category[];
  brands: Brand[];
}

export function AddProduct({
  product,
  userId,
  categories,
  brands,
}: AddProductProps) {
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [imageKeys, setImageKeys] = useState<string[]>([]); // Remove product?.imageKeys
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: product?.discountStart || undefined,
    to: product?.discountEnd || undefined,
  });

  const form = useForm<TProduct>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          ...product,
          price: parseFloat(String(product?.price.toFixed(2))),
          discount: parseFloat(String(product?.discount.toFixed(2))),
          categories: product.categories.map((cat) => cat.id),
          brands: product.brand ? [product.brand.id] : [],
          tags: product.tags,
        }
      : {
          title: "",
          description: "",
          images: [],
          tags: [],
          price: 100,
          discount: 0,
          stock: 0,
          status: "draft",
          color: [],
          size: [],
          isFeatured: false,
          isAvailable: false,
          isPhysical: true,
          categories: [],
          brands: [], // Add this default
          febric: "",
        },
  });
  const router = useRouter();
  async function onSubmit(data: TProduct) {
    if (product) {
      try {
        const res = await updateProduct(data, product.id, userId);
        if (res?.success) {
          toast.success(res.success);
          setImages([]);
          form.reset();
          router.push("/admin/products");
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    } else {
      try {
        const res = await addProduct(data, userId);
        if (res?.success) {
          toast.success(res.success);
          setImages([]);
          form.reset();
          router.push("/admin/products");
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    }
  }
  const handleRemove = async (index: number) => {
    try {
      // For existing products, we might not have imageKeys stored
      // So we'll just remove the image from UI and update the form
      const imageKeyToRemove = imageKeys[index];
      const newImages = images.filter((_, i) => i !== index);

      // Update UI first
      setImages(newImages);
      form.setValue("images", newImages);

      // If we have the key, try to remove from uploadthing
      if (imageKeyToRemove) {
        const newImageKeys = imageKeys.filter((_, i) => i !== index);
        setImageKeys(newImageKeys);

        const res = await imageRemove(imageKeyToRemove);
        if (res.success) {
          toast.success("Image removed successfully");
        }
      }
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image");
    }
  };
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) =>
      console.log(value, name, type),
    );
    return () => subscription.unsubscribe();
  }, [form, images]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Choose an Image</FormLabel>
              <FormControl>
                <Input type="hidden" placeholder="Image" {...field} />
              </FormControl>
              {images.length > 0 ? (
                <div className="flex gap-2">
                  {images?.map((image, index) => (
                    <div key={index} className="relative rounded border">
                      <Image
                        src={image}
                        alt="img"
                        height={400}
                        width={400}
                        className="object-contain"
                      />
                      <Button
                        className="absolute top-0 right-0"
                        onClick={() => handleRemove(index)}
                        type="button"
                        size="icon"
                        variant="ghost"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <UploadDropzone
                  endpoint="imageUploader"
                  className="w-full gap-x-2 rounded p-4 text-green-900"
                  onClientUploadComplete={(res) => {
                    // Do something with the response
                    console.log("Files: ", res);
                    setImages(res.map((item) => item.ufsUrl));
                    setImageKeys(res.map((item) => item.key));
                    form.setValue(
                      "images",
                      res.map((item) => item.ufsUrl),
                    );
                    toast.success("Upload Completed" + res[0].ufsUrl);
                  }}
                  onUploadError={(error: Error) => {
                    // Do something with the error.
                    toast.error(`ERROR! ${error.message}`);
                  }}
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input min={0} type="number" placeholder="price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="stock" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Discount percentage</FormLabel>
                <FormControl>
                  <Input
                    min={0}
                    type="number"
                    placeholder="discount percentage"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full space-y-2">
            <FormField
              control={form.control}
              name="discountStart"
              render={() => (
                <FormItem className="w-full">
                  <FormLabel>Discount Period</FormLabel>
                  <FormControl>
                    <DatePickerWithRange
                      date={date}
                      setDate={setDate}
                      form={form}
                      name="discount"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 max-md:flex-col">
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex w-full items-start space-x-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Featured</FormLabel>
                  <FormDescription>
                    You can manage product status
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isAvailable"
            render={({ field }) => (
              <FormItem className="flex w-full items-start space-x-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Is Available</FormLabel>
                  <FormDescription>
                    You can manage product availability
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="febric"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Fabric</FormLabel>
                <FormControl>
                  <Input
                    placeholder="fabric material"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center justify-between space-x-3">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="select status"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* // Update the categories field */}
          <FormField
            control={form.control}
            name="categories" // Changed from categoryId to categories
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Categories</FormLabel>
                <Select
                  disabled={loading}
                  onValueChange={(value) => {
                    const currentValues = field.value || [];
                    if (!currentValues.includes(value)) {
                      field.onChange([...currentValues, value]);
                    }
                  }}
                  value={field.value?.[0] || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select categories" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* size for the product example: m, l, xl,xxl */}
        <div className="flex items-center justify-between gap-3 max-md:flex-col">
          <FormField
            control={form.control}
            name="color"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Available color</FormLabel>
                  <FormDescription>
                    Select the available colors you want to display in the
                    product.
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {colors.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="color"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-y-0 space-x-3"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className={`text-sm font-normal`}>
                              <span
                                className={`${item.id} size-6 rounded-full border`}
                              ></span>
                              {item.title}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="size"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Available Sizes</FormLabel>
                  <FormDescription>
                    Select the available sizes you want to display in the
                    product.
                  </FormDescription>
                </div>
                {sizes.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="size"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-y-0 space-x-3"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {item.title}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center justify-between gap-4 max-md:flex-col">
          <TagsDemo form={form} />
          <FormField
            control={form.control}
            name="brands"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Brand</FormLabel>
                <Select
                  disabled={loading}
                  onValueChange={(value) => {
                    field.onChange([value]);
                  }}
                  value={field.value?.[0] || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brands?.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {product ? (
          <Button disabled={loading} className="max-w-[150px]">
            {loading ? (
              <Fragment>
                <Loader2 className="mr-2 size-4" />
                Updating
              </Fragment>
            ) : (
              <Fragment>
                <PencilLine className="size-4" />
                Update
              </Fragment>
            )}
          </Button>
        ) : (
          <Button className="max-w-[150px]" disabled={loading}>
            {loading ? (
              <Fragment>
                <Loader2 className="size-4" />
                Creating
              </Fragment>
            ) : (
              <Fragment>
                <PencilLine className="size-4" />
                Create
              </Fragment>
            )}
          </Button>
        )}
      </form>
    </Form>
  );
}
