"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/utils/cart";
import { Product } from "@prisma/client";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import SelectVariant from "@/components/shared/select-variants";

interface Props {
  product: any;
  color: any;
  size: any;
}
const Client = ({ product, color, size }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const handleAddToCart = () => {
    addToCart(product, color, size);
  };

  const handleBuyNow = async () => {
    try {
      setIsLoading(true);
      // Clear the cart first
      clearCart();
      // Add the current product to cart
      addToCart(product, color, size);
      // Navigate to cart page
      router.push("/cart");
    } catch (error) {
      console.error("Buy now error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <SelectVariant product={product} size={size} color={color} />
      </div>
      <div className="flex w-full items-center justify-between gap-4 pt-4">
        <Button
          onClick={handleAddToCart}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 py-3"
        >
          <ShoppingBag className="mr-2 size-6" />
          Add to Cart
        </Button>
        <Button
          onClick={handleBuyNow}
          disabled={isLoading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 py-3"
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ShoppingBag className="mr-2 size-6" />
          )}
          Buy Now
        </Button>
      </div>
      <div className="flex w-full items-center justify-start gap-4">
        <h5>Tags:</h5>
        {product.tags.map((tag: any) => (
          <span
            key={tag}
            className="inline-block rounded px-1 py-1.5 text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
      {/* <div className="flex w-full items-center justify-start gap-4">
        <h5>Categories:</h5>
        {product..map((tag: any) => (
          <span
            key={tag}
            className="inline-block rounded px-1 py-1.5 text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div> */}
    </>
  );
};
export default Client;
