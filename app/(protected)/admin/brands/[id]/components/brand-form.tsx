"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addBrand, updateBrand } from "@/actions/brand";
import { zodResolver } from "@hookform/resolvers/zod";
import { Brand } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { brandSchema, TBrand } from "@/lib/validations/product";
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
import { Separator } from "@/components/ui/separator";

interface BrandFormProps {
  initialData: Brand | null;
}

export const BrandForm: React.FC<BrandFormProps> = ({ initialData }) => {
  const router = useRouter();

  const action = initialData ? "Save changes" : "Create";

  const form = useForm<TBrand>({
    resolver: zodResolver(brandSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description || "",
          logo: initialData.logo || "",
        }
      : {
          title: "",
          description: "",
          logo: "",
        },
  });

  async function onSubmit(data: TBrand) {
    if (initialData) {
      try {
        const res = await updateBrand(data, initialData.id);
        if (res?.success) {
          toast.success(res.success);
          // setImages([]);
          form.reset();
          router.push("/admin/brands");
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    } else {
      try {
        const res = await addBrand(data);
        if (res?.success) {
          toast.success(res.success);
          //  setImages([]);
          form.reset();
          router.push("/admin/brands");
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    }
  }

  return (
    <>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Brand title" {...field} />
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
                    <Input placeholder="Brand description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/logo.png"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
