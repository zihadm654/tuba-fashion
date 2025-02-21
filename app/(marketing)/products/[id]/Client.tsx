"use client";

import useCartStore from "@/utils/cart";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";

const Client = ({ product }: any) => {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="pt-4">
      <Button
        onClick={() => addToCart(product)}
        className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-6 py-3"
      >
        <ShoppingBag className="mr-2 size-6" />
        Add to Cart
      </Button>
    </div>
  );
};
export default Client;
