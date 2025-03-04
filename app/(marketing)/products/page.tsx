import { constructMetadata } from "@/lib/utils";
import BreadcrumbSection from "@/components/layout/breadcrumb-section";

import Client from "./client";

export const metadata = constructMetadata({
  title: "Products - Tuba Fasion",
  description: "Lists of products.",
});
const page = async () => {
  return (
    <>
      <BreadcrumbSection end="products" />
      <Client />
    </>
  );
};

export default page;
