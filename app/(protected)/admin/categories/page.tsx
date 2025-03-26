import { getCategories } from "@/actions/category";

import { prisma } from "@/lib/db";
import { DataTable } from "@/components/dashboard/data-table/data-table";

import { columns } from "./_components/columns";
import { CategoriesClient, CategoryColumn } from "./components/table";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <DataTable
      columns={columns}
      data={
        categories.data?.map((category) => ({
          id: category.id,
          title: category.title,
          description: category.description,
          logo: null, // Adding the required logo property
        })) ?? []
      }
      link="categories"
    />
  );
}
