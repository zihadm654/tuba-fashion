import { prisma } from "@/lib/db";
import { DataTable } from "@/components/dashboard/data-table/data-table";

import { columns } from "./_components/columns";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    include: {
      products: true,
    },
  });

  return <DataTable columns={columns} data={brands} link="brand" />;
}
