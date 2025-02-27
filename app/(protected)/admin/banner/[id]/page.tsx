import { getBanner } from "@/actions/banner";
import { auth } from "@/auth";

import { DashboardHeader } from "@/components/dashboard/header";
import { AddBanner } from "@/components/forms/add-banner";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();
  if (!session || !session.user.id) {
    return null; // or redirect to login  // Fix this
  }
  const banner = await getBanner(id);
  return (
    <>
      <DashboardHeader heading="Add banner" text="Create new banner" />
      <AddBanner banner={banner.data} />
    </>
  );
};

export default Page;
