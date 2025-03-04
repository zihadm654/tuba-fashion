import Link from "next/link";
import { Product } from "@prisma/client";

import { Button } from "@/components/ui/button";

export default function SelectVariant({
  product,
  size,
  color,
}: {
  product: Product;
  color: string;
  size: string;
}) {
  const selectedColor = color || product.color[0];
  const selectedSize = size || product.size[0];

  return (
    <>
      {product.color.length > 0 && (
        <div className="space-y-2 space-x-2">
          <div>Color:</div>
          {product.color.map((x: string) => (
            <Button
              asChild
              variant="outline"
              className={
                selectedColor === x ? "border-primary border-2" : "border-2"
              }
              key={x}
            >
              <Link
                replace
                scroll={false}
                href={`?${new URLSearchParams({
                  color: x,
                  size: selectedSize,
                })}`}
                key={x}
              >
                <div
                  style={{ backgroundColor: x }}
                  className="border-muted-foreground h-4 w-4 rounded-full border"
                ></div>
                {x}
              </Link>
            </Button>
          ))}
        </div>
      )}
      {product.size.length > 0 && (
        <div className="mt-2 space-y-2 space-x-2">
          <div>Size:</div>
          {product.size.map((x: string) => (
            <Button
              asChild
              variant="outline"
              className={
                selectedSize === x ? "border-primary border-2" : "border-2"
              }
              key={x}
            >
              <Link
                replace
                scroll={false}
                href={`?${new URLSearchParams({
                  color: selectedColor,
                  size: x,
                })}`}
              >
                {x}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </>
  );
}
