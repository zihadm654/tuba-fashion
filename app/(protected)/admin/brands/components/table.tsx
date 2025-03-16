"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/data-table/data-table";

export type BrandColumn = {
  id: string;
  title: string;
  products: number;
};

export const columns: ColumnDef<BrandColumn>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "products",
    header: "Products #",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Link href={`/admin/brands/${row.original.id}`}>
        <Button size="icon" variant="outline">
          <EditIcon className="h-4" />
        </Button>
      </Link>
    ),
  },
];

interface BrandsClientProps {
  data: BrandColumn[];
}

export const BrandsClient: React.FC<BrandsClientProps> = ({ data }) => {
  return <DataTable columns={columns} data={data} link="brand" />;
};
