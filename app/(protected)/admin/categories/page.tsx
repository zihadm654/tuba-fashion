import { prisma } from "@/lib/db";

import { CategoriesClient, CategoryColumn } from "./components/table";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      products: true,
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map(
    (category: any) => ({
      id: category.id,
      title: category.title,
      products: category.products.length,
    }),
  );

  return (
    <div className="my-6 block space-y-4">
      <CategoriesClient data={formattedCategories} />
    </div>
  );
}
