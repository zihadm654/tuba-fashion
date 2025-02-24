import { getUserProducts } from "@/actions/product";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { columns } from "@/components/dashboard/data-table/columns";
import { DataTable } from "@/components/dashboard/data-table/data-table";
import { DashboardHeader } from "@/components/dashboard/header";

export const metadata = constructMetadata({
  title: "Listings - Advanture",
  description: "creation of hotel and rooms",
});

export default async function ChartsPage() {
  const currentUser = await getCurrentUser();
  const products = await getUserProducts(currentUser?.id!);
  console.log(products, "products");
  if (!products) return <div>hotels not found</div>;
  if ("error" in products) {
    return <div>Error loading listings: {String(products.error)}</div>;
  }
  return (
    <>
      <DashboardHeader heading="Listings" text="List of listings." />
      {products && <DataTable columns={columns} data={products.data} />}
    </>
  );
}
