"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addBanner, updateBanner } from "@/actions/banner";
import { addProduct, updateProduct } from "@/actions/product";
import { UploadDropzone } from "@/utils/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banner } from "@prisma/client";
import { Loader2, PencilLine, X, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { bannerSchema, TBanner } from "@/lib/validations/product";
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

import BlurImage from "../shared/blur-image";

interface AddBannerProps {
  banner?: Banner | null;
}
export function AddBanner({ banner }: AddBannerProps) {
  const [image, setImage] = useState<string>(banner?.imageString || "");
  const [loading, setLoading] = useState(false);

  const form = useForm<TBanner>({
    resolver: zodResolver(bannerSchema),
    defaultValues: banner
      ? {
          title: banner.title,
          imageString: banner.imageString,
        }
      : {
          title: "",
          imageString: "",
        },
  });
  const router = useRouter();
  async function onSubmit(data: TBanner) {
    if (banner) {
      try {
        const res = await updateBanner(data, banner.id);
        if (res?.success) {
          toast.success(res.success);
          setImage("");
          form.reset();
          router.push("/admin/banner");
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    } else {
      try {
        const res = await addBanner(data);
        if (res?.success) {
          toast.success(res.success);
          setImage("");
          form.reset();
          router.push("/admin/banner");
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    }
  }
  const handleDelete = () => {
    setImage(image);
  };

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) =>
      console.log(value, name, type),
    );
    return () => subscription.unsubscribe();
  }, [form]);

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
          name="imageString"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Choose an Image</FormLabel>
              <FormControl>
                <Input type="hidden" placeholder="Image" {...field} />
              </FormControl>
              {image ? (
                <div className="relative">
                  <BlurImage
                    src={image}
                    alt="img"
                    height={400}
                    width={400}
                    className="object-contain"
                  />
                  <Button
                    className="absolute top-0 right-0"
                    onClick={() => handleDelete()}
                    type="button"
                    size="icon"
                    variant="ghost"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <UploadDropzone
                  endpoint="imageUploader"
                  className="w-full gap-x-2 rounded p-4 text-green-900"
                  onClientUploadComplete={(res) => {
                    // Do something with the response
                    console.log("Files: ", res);
                    setImage(res[0].ufsUrl);
                    form.setValue("imageString", res[0].ufsUrl);
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
        {banner ? (
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
                Create banner
              </Fragment>
            )}
          </Button>
        )}
      </form>
    </Form>
  );
}
