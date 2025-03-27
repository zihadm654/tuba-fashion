import { getBanners } from "@/actions/banner";

import { constructMetadata } from "@/lib/utils";
import { columns } from "@/components/dashboard/banner/columns";
import { DataTable } from "@/components/dashboard/data-table/data-table";
import { DashboardHeader } from "@/components/dashboard/header";

export const metadata = constructMetadata({
  title: "Banner - Tuba Fasion",
  description: "creation of  banner",
});

export default async function ChartsPage() {
  const banners = await getBanners();
  console.log(banners, "banners");
  if (!banners) return <div>banners not found</div>;
  if ("error" in banners) {
    return <div>Error loading listings: {String(banners.error)}</div>;
  }
  return (
    <>
      <DashboardHeader heading="Banners" text="List of Banners." />
      {banners && (
        <DataTable columns={columns} data={banners.data} link="banner" />
      )}
    </>
  );
}
