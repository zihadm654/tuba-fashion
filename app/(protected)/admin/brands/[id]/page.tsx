import { prisma } from "@/lib/db";
import { DashboardHeader } from "@/components/dashboard/header";
import { BrandForm } from "@/components/forms/brand-form";

const BrandPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const brand = await prisma.brand.findUnique({
    where: {
      id: id,
    },
  });

  return (
    <>
      <DashboardHeader heading="Add brand" text="Create new brands" />
      <BrandForm initialData={brand} />
    </>
  );
};

export default BrandPage;
