import { getUserProducts } from "@/actions/product";
import { auth } from "@/auth";

import { constructMetadata } from "@/lib/utils";
import { columns } from "@/components/dashboard/data-table/columns";
import { DataTable } from "@/components/dashboard/data-table/data-table";
import { DashboardHeader } from "@/components/dashboard/header";

export const metadata = constructMetadata({
  title: "Products - Tuba Fasion",
  description: "products list",
});

export default async function ChartsPage() {
  const session = await auth();
  const products = await getUserProducts(session?.user?.id!);
  console.log(products, "products");
  if (!products) return <div>products not found</div>;
  if ("error" in products) {
    return <div>Error loading products: {String(products.error)}</div>;
  }
  return (
    <>
      <DashboardHeader heading="Listings" text="List of listings." />
      {products && (
        <DataTable columns={columns} data={products.data} link="products" />
      )}
    </>
  );
}
