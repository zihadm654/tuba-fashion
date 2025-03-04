"use client";

import { useSearchParams } from "next/navigation";
import useCartStore from "@/utils/cart";
import { Product } from "@prisma/client";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import SelectVariant from "@/components/shared/select-variants";

interface Props {
  product: any;
  color: any;
  size: any;
}
const Client = ({ product, color, size }: Props) => {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart({
      ...product,
      color,
      size,
    });
  };

  return (
    <>
      <div className="space-y-4">
        <SelectVariant product={product} size={size} color={color} />
      </div>
      <div className="flex items-center justify-between gap-4 pt-4">
        <Button
          onClick={handleAddToCart}
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-6 py-3"
        >
          <ShoppingBag className="mr-2 size-6" />
          Add to Cart
        </Button>
        <Button
          disabled
          onClick={handleAddToCart}
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-6 py-3"
        >
          <ShoppingBag className="mr-2 size-6" />
          Buy Now
        </Button>
      </div>
    </>
  );
};
export default Client;
