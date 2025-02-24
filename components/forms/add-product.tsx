"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { imageRemove } from "@/actions/image-remove";
import { addProduct, updateProduct } from "@/actions/product";
import { UploadDropzone } from "@/utils/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@prisma/client";
import { Loader2, PencilLine, X, XIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { categories, colors, sizes } from "@/config/categories";
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
  product?: Product | null;
  userId: string;
}
export function AddProduct({ product, userId }: AddProductProps) {
  const [images, setImages] = useState<string[]>(product?.images || []);
  //   const [imageKey, setImageKey] = useState<string>("");
  const [loading, setLoading] = useState(false);
  // const [date, setDate] = useState<DateRange | undefined>();
  // const [days, setDays] = useState(0);

  const form = useForm<TProduct>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          title: product.title,
          description: product.description,
          images: product.images,
          price: product.price,
          quantity: product.quantity,
          status: product.status,
          category: product.category,
          color: product.color,
          size: product.size,
          isFeatured: product.isFeatured,
          discountPercentage: product.discountPercentage || 0,
          discountStart: product.discountStart || undefined,
          discountEnd: product.discountEnd || undefined,
          febric: product.febric || undefined,
        }
      : {
          title: "",
          description: "",
          images: [],
          price: 0,
          quantity: 0,
          status: "draft",
          category: "men",
          color: ["red", "blue"],
          size: ["m", "l"],
          isFeatured: false,
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
  const handleDelete = (index: number) => {
    setImages(images?.filter((_, i) => i !== index));
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
                        onClick={() => handleDelete(index)}
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
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" placeholder="price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discountPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount percentage</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="discount percentage"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* discountStart and discountEnd are the dates when the discount will start and end respectivel. with date range */}
        {/* <DatePickerWithRange
          date={date}
          setDate={setDate}
          disabledDates={disabledDates}
        /> */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="quantity" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Featured</FormLabel>
                <FormDescription>
                  You can manage your mobile notifications in the settings
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full items-center justify-between space-x-3">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
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
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="select a category"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="febric"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Febric</FormLabel>
                <FormControl>
                  <Input placeholder="febric" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        {/* size for the product example: m, l, xl,xxl */}
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
        <FormField
          control={form.control}
          name="size"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Available Sizes</FormLabel>
                <FormDescription>
                  Select the available sizes you want to display in the product.
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
                Create Project
              </Fragment>
            )}
          </Button>
        )}
      </form>
    </Form>
  );
}
