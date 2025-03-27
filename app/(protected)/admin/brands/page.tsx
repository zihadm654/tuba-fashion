import { prisma } from "@/lib/db";
import { columns } from "@/components/dashboard/brands/columns";
import { DataTable } from "@/components/dashboard/data-table/data-table";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    include: {
      products: true,
    },
  });

  return <DataTable columns={columns} data={brands} link="brands" />;
}
