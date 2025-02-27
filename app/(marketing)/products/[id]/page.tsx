import type { Metadata, ResolvingMetadata } from "next";
import { getProduct } from "@/actions/product";
import { calculateDiscountedPrice } from "@/utils/calculateDiscount";

import BreadcrumbSection from "@/components/layout/breadcrumb-section";
import { ImageSlider } from "@/components/shared/image-slider";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { SkeletonSection } from "@/components/shared/section-skeleton";

import Client from "./Client";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const id = (await params).id;

  // fetch data
  const res = await getProduct(id);
  const product = res.data;

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product?.title,
    description: product?.description,
    openGraph: {
      images: [product?.images[0] || "", ...previousImages],
    },
  };
}
const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const res = await getProduct(id);
  const product = res.data;
  if (!res && !product) return <SkeletonSection />;

  const discountedPrice = calculateDiscountedPrice(
    product?.price ?? 0,
    product?.discountPercentage ?? undefined,
    product?.discountStart ? new Date(product.discountStart) : undefined,
    product?.discountEnd ? new Date(product.discountEnd) : undefined,
  );
  return (
    <section className="py-6 transition-all duration-300 ease-in-out">
      <BreadcrumbSection end={product?.title} />
      <MaxWidthWrapper>
        <div className="grid gap-12 py-8 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.02]">
            <ImageSlider images={product?.images ?? []} />
          </div>
          {/* Product Details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="hover:text-primary/90 text-4xl font-bold tracking-tight transition-colors">
                {product?.title}
              </h1>
              <p className="text-lg text-gray-600">{product?.description}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
              {product?.discountPercentage ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-3xl font-bold">
                      ${discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                    Save {product.discountPercentage}%
                  </span>
                </div>
              ) : (
                <span className="text-primary text-3xl font-bold">
                  ${product?.price.toFixed(2)}
                </span>
              )}
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${product?.quantity === 0 ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"}`}
                >
                  {product?.quantity === 0 ? "Out of Stock" : "In Stock"}
                </span>
                {(product?.quantity ?? 0) > 0 && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {product?.quantity} units available
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <h5 className="text-lg font-medium uppercase">Colors</h5>
                <div className="flex flex-wrap gap-2">
                  {product?.color.map((item) => (
                    <span
                      key={item}
                      className="hover:bg-primary/10 hover:text-primary rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 transition-colors dark:bg-gray-800 dark:text-gray-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h5 className="text-lg font-medium uppercase">Sizes</h5>
                <div className="flex flex-wrap gap-2">
                  {product?.size.map((item) => (
                    <span
                      key={item}
                      className="hover:bg-primary/10 hover:text-primary rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 transition-colors dark:bg-gray-800 dark:text-gray-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <Client product={product} />
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default page;
