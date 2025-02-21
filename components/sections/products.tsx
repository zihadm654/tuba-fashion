"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";
import { ArrowRight, Star } from "lucide-react";

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
}

const Products = ({ products }: ProductPros) => {
  const router = useRouter();
  return (
    <section className="py-10">
      <MaxWidthWrapper>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="pb-3 text-3xl font-bold">Featured Products</h2>
          <Button
            onClick={() => router.push("/products")}
            className="hover:cursor-pointer"
          >
            Browse all Products &rarr;
          </Button>
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
  return (
    <div className="relative rounded-lg">
      <Badge
        className={`absolute top-2 right-2 z-20 ${product.quantity > 0 ? "bg-green-500" : "bg-red-500"}`}
      >
        {product.quantity > 0 ? "In Stock" : "Out of Stock"}
      </Badge>
      <Carousel className="mx-auto w-full">
        <CarouselContent>
          {product.images?.map((item, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[330px]">
                <BlurImage
                  src={item}
                  alt="Product Image"
                  fill
                  className="h-full w-full rounded-lg object-cover object-center"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-16" />
        <CarouselNext className="mr-16" />
      </Carousel>

      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{product.title}</h1>
        <h3 className="bg-primary/10 text-primary ring-primary/10 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset">
          ${product.price}
        </h3>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
        {product.description}
      </p>

      <Button asChild className="mt-5 w-full cursor-pointer">
        <Link href={`/products/${product.id}`}>Learn More!</Link>
      </Button>
    </div>
  );
};
