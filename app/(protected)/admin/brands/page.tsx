import Link from "next/link";
import { Plus } from "lucide-react";

import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { BrandColumn, BrandsClient } from "./components/table";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    include: {
      products: true,
    },
  });

  const formattedBrands: BrandColumn[] = brands.map((brand) => ({
    id: brand.id,
    title: brand.title,
    products: brand.products.length,
  }));

  return (
    <div className="my-6 block space-y-4">
      <Separator />
      <BrandsClient data={formattedBrands} />
    </div>
  );
}
