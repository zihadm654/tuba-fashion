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
        <div className="space-y-4">
          <div className="text-sm font-medium">Color:</div>
          <div className="flex flex-wrap gap-2">
            {product.color.map((x: string) => (
              <Button
                asChild
                variant="outline"
                className={`transition-all duration-200 hover:scale-105 ${selectedColor === x ? "ring-primary ring-2 ring-offset-2" : "hover:border-primary"} `}
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
                  className="flex items-center gap-2"
                >
                  <div
                    className={`size-6 rounded-full border shadow-sm transition-transform ${x}`}
                  />
                </Link>
              </Button>
            ))}
          </div>
        </div>
      )}
      {product.size.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="text-sm font-medium">Size:</div>
          <div className="flex flex-wrap gap-2">
            {product.size.map((x: string) => (
              <Button
                asChild
                variant="outline"
                className={`min-w-[3rem] transition-all duration-200 hover:scale-105 ${selectedSize === x ? "ring-primary ring-2 ring-offset-2" : "hover:border-primary"} `}
                key={x}
              >
                <Link
                  replace
                  scroll={false}
                  href={`?${new URLSearchParams({
                    color: selectedColor,
                    size: x,
                  })}`}
                  className="px-2"
                >
                  <span className="font-medium uppercase">{x}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
