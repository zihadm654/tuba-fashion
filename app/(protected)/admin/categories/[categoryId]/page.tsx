import { getBanners } from "@/actions/banner";
import { getCategory } from "@/actions/category";

import { CategoryForm } from "@/components/forms/category-form";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) => {
  const categoryId = (await params).categoryId;
  console.log(categoryId);
  const category = await getCategory(categoryId);
  const banners = await getBanners();
  console.log(category, banners, "data");
  // if (category.success) return <div>category not found</div>;
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm
          banners={banners?.data ?? []}
          initialData={category?.data || null}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
