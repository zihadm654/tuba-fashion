import { prisma } from "@/lib/db";

import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ categoryId: string; id: string }>;
}) => {
  const id = (await params).id;
  const categoryId = (await params).categoryId;
  console.log(id, categoryId);
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  const banners = await prisma.banner.findMany({
    where: {
      id: id,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm banners={banners} initialData={category} />
      </div>
    </div>
  );
};

export default CategoryPage;
