"use client";

import { useRouter } from "next/navigation";
import useCartStore from "@/utilities/cart";
import { Star } from "lucide-react";

import BlurImage from "../shared/blur-image";
import MaxWidthWrapper from "../shared/max-width-wrapper";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "../ui/card";

const Products = ({ products }: any) => {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  return (
    <section className="py-10">
      <MaxWidthWrapper>
        {/* {categories?.map((category: any) => <span>{category}</span>)} */}
        <h2 className="pb-3 text-3xl font-bold">Featured Products</h2>
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products?.map((product: any) => (
            <Card
              onClick={() => router.push("/products/" + product.id)}
              key={product.id}
              className="cursor-pointer"
            >
              <BlurImage
                src={product?.image}
                alt={product.title}
                width={500}
                height={400}
                className="h-64 w-full rounded-t-lg object-contain"
              />
              <CardContent className="py-4">
                <CardTitle>{product.title}</CardTitle>
                <CardDescription className="py-2">
                  {product.description.substring(0, 50)}...
                </CardDescription>
              </CardContent>
              <CardFooter className="w-full flex-col justify-between">
                <div className="space-between flex w-full items-center">
                  <div className="space-between flex w-full items-center">
                    <span className="flex items-center space-x-1">
                      <Star className="mr-1.5 size-6 text-amber-500" />
                      {product.rating.rate}
                    </span>
                    <span className="ml-1 text-sm text-gray-500">
                      {product.rating.count} reviews
                    </span>
                  </div>
                  <span className="text-lg font-bold">${product.price}</span>
                </div>
                <Button
                  onClick={() => addToCart(product)}
                  className="mt-6 w-full hover:cursor-pointer"
                >
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>
      </MaxWidthWrapper>
    </section>
  );
};

export default Products;
