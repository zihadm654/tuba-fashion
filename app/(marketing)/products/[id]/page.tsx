import type { Metadata, ResolvingMetadata } from "next";
import { getProduct, getProductsByCat } from "@/actions/product";
import {
  calculateDiscountedPrice,
  getRemainingDiscountDays,
  isDiscountActive,
} from "@/utils/calculateDiscount";
import { format } from "date-fns";

import BreadcrumbSection from "@/components/layout/breadcrumb-section";
import Products from "@/components/sections/products";
import { ImageSlider } from "@/components/shared/image-slider";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import ReviewForm from "@/components/shared/review-form";
import ReviewList from "@/components/shared/review-list";
import { SkeletonSection } from "@/components/shared/section-skeleton";

import Client from "./Client";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
export async function generateMetadata(
  { params }: Props,
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
const page = async ({ params, searchParams }: Props) => {
  const id = (await params).id;
  const color = (await searchParams).color;
  const size = (await searchParams).size;
  //product data fetched
  const res = await getProduct(id);
  const product = res.data;
  console.log(product, "product");

  // Get related products only if the product has categories
  let relatedProducts: any[] = [];
  if (product?.categories && product.categories.length > 0) {
    // Use the category title instead of ID for fetching related products
    const productsResponse = await getProductsByCat(
      product.categories[0].title,
    );
    // Filter out the current product from related products
    if (productsResponse.success && productsResponse.data) {
      relatedProducts = productsResponse.data.filter((p) => p.id !== id);
    }
  }
  console.log(relatedProducts, "related products");
  if (!res && !product) return <SkeletonSection />;
  // Calculate discount information
  const discountActive = isDiscountActive(
    product?.discount,
    product?.discountStart ? new Date(product.discountStart) : undefined,
    product?.discountEnd ? new Date(product.discountEnd) : undefined,
  );

  const discountedPrice = calculateDiscountedPrice(
    product?.price ?? 0,
    product?.discount,
    product?.discountStart ? new Date(product.discountStart) : undefined,
    product?.discountEnd ? new Date(product.discountEnd) : undefined,
  );

  // Calculate remaining days
  const remainingDays = getRemainingDiscountDays(
    product?.discountEnd ? new Date(product.discountEnd) : undefined,
  );

  // Format discount period dates
  let discountPeriod = "";
  if (product?.discountStart && product?.discountEnd) {
    const startDate = new Date(product.discountStart);
    const endDate = new Date(product.discountEnd);
    discountPeriod = `${format(startDate, "MMM dd")} - ${format(endDate, "MMM dd, yyyy")}`;
  }

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
              {product?.discount && discountActive ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-3xl font-bold">
                      ৳{discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ৳{product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                      Save {product.discount}%
                    </span>

                    {remainingDays > 0 && (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                        {remainingDays} {remainingDays === 1 ? "day" : "days"}{" "}
                        left
                      </span>
                    )}
                  </div>

                  {discountPeriod && (
                    <p className="mt-1 text-sm text-gray-600">
                      Discount period: {discountPeriod}
                    </p>
                  )}
                </div>
              ) : (
                <span className="text-primary text-3xl font-bold">
                  ৳{product?.price.toFixed(2)}
                </span>
              )}
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${product?.stock === 0 ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"}`}
                >
                  {product?.stock === 0 ? "Out of Stock" : "In Stock"}
                </span>
                {(product?.stock ?? 0) > 0 && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {product?.stock} units available
                  </span>
                )}
              </div>
            </div>
            <Client product={product} color={color} size={size} />
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 max-w-4xl space-y-8">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <ReviewForm productId={id} />
          <ReviewList productId={id} />
        </div>
        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <Products products={relatedProducts} title="Related Products" />
        )}
      </MaxWidthWrapper>
    </section>
  );
};

export default page;
