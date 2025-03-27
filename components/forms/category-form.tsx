"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addCategory, updateCategory } from "@/actions/category";
import { CategoryWithIncludes } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banner, Category } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { categorySchema, TCategory } from "@/lib/validations/product";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFormProps {
  initialData: CategoryWithIncludes | null;
  banners: Banner[];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  banners,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<TCategory>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description || "",
          bannerId: initialData.id || "", // Changed from id to bannerId
        }
      : {
          title: "",
          description: "",
          bannerId: "",
        },
  });

  async function onSubmit(data: TCategory) {
    try {
      setLoading(true);
      if (initialData) {
        const res = await updateCategory(data, initialData.id);
        if (res?.success) {
          toast.success("Category updated successfully");
          router.push("/admin/categories");
          router.refresh();
        } else {
          toast.error(
            typeof res?.error === "string" ? res.error : "Something went wrong",
          );
        }
      } else {
        const res = await addCategory(data);
        if (res?.success) {
          toast.success("Category created successfully");
          router.push("/admin/categories");
          router.refresh();
        } else {
          toast.error(
            typeof res?.error === "string" ? res.error : "Something went wrong",
          );
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="gap-8 md:grid md:grid-cols-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Category name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Category description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bannerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner</FormLabel>
                <Select
                  disabled={loading}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="Select a banner"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {banners.map((banner) => (
                      <SelectItem key={banner.id} value={banner.id}>
                        {banner.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={loading} className="ml-auto" type="submit">
          {initialData ? "Save changes" : "Create category"}
        </Button>
      </form>
    </Form>
  );
};
