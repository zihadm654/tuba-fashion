import { getCategories } from "@/actions/category";

import { columns } from "@/components/dashboard/categories/columns";
import { DataTable } from "@/components/dashboard/data-table/data-table";

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
