"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  calculateDiscountedPrice,
  getRemainingDiscountDays,
  isDiscountActive,
} from "@/utils/calculateDiscount";
import { Product } from "@prisma/client";

import BlurImage from "../shared/blur-image";
import MaxWidthWrapper from "../shared/max-width-wrapper";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carosuel";

interface ProductPros {
  products: Product[];
  title: string;
  link?: string;
  name?: string;
}

const Products = ({ products, title, link, name }: ProductPros) => {
  const router = useRouter();
  return (
    <section className="py-4">
      <MaxWidthWrapper>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="pb-3 text-2xl font-bold capitalize">{title}</h2>
          {link && name && (
            <Button
              onClick={() => router.push(`${link}`)}
              className="hover:cursor-pointer"
            >
              {name} &rarr;
            </Button>
          )}
        </div>
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products?.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </MaxWidthWrapper>
    </section>
  );
};

export default Products;

export const ProductCard = ({ product }: { product: Product }) => {
  // Calculate discount information
  const discountActive = isDiscountActive(
    product?.discount ?? undefined,
    product?.discountStart ? new Date(product.discountStart) : undefined,
    product?.discountEnd ? new Date(product.discountEnd) : undefined,
  );

  const discountedPrice = calculateDiscountedPrice(
    product?.price ?? 0,
    product?.discount ?? undefined,
    product?.discountStart ? new Date(product.discountStart) : undefined,
    product?.discountEnd ? new Date(product.discountEnd) : undefined,
  );

  // Calculate remaining days
  const remainingDays = getRemainingDiscountDays(
    product?.discountEnd ? new Date(product.discountEnd) : undefined,
  );

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:bg-gray-950">
      {/* Stock Badge */}
      <Badge
        className={`absolute top-3 left-3 z-10 ${
          product.stock > 0
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        {product.stock > 0 ? "In Stock" : "Out of Stock"}
      </Badge>

      {/* Discount Badge */}
      {product?.discount && discountActive && (
        <Badge className="bg-primary hover:bg-primary/90 absolute top-3 right-3 z-10">
          {product.discount}% OFF
        </Badge>
      )}

      {/* Product Image */}
      <div className="relative h-[280px] overflow-hidden">
        <Carousel className="mx-auto w-full">
          <Link
            href={`/products/${product.id}`}
            className="block overflow-hidden"
          >
            <CarouselContent>
              {product.images?.map((item, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[280px] overflow-hidden">
                    <BlurImage
                      src={item}
                      alt={`${product.title} - Image ${index + 1}`}
                      fill
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Link>
          <CarouselPrevious className="left-2 size-8 opacity-0 transition-opacity group-hover:opacity-100" />
          <CarouselNext className="right-2 size-8 opacity-0 transition-opacity group-hover:opacity-100" />
        </Carousel>
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Title and Category */}
        <div className="mb-2">
          <Link href={`/products/${product.id}`}>
            <h3 className="hover:text-primary line-clamp-1 text-lg font-medium transition-colors">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Description */}
        <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {product.description.split(" ").slice(0, 10).join(" ")}
        </p>

        {/* Price Section */}
        <div className="mb-3">
          {product?.discount && discountActive ? (
            <div className="flex items-center gap-2">
              <span className="text-primary text-xl font-bold">
                ৳{discountedPrice.toFixed(0)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ৳{product.price.toFixed(0)}
              </span>

              {remainingDays > 0 && (
                <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                  {remainingDays}d left
                </span>
              )}
            </div>
          ) : (
            <span className="text-primary text-xl font-bold">
              ৳{product?.price.toFixed(0)}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <Button
          asChild
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
        >
          <Link href={`/products/${product.id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  );
};
