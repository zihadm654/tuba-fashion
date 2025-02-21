import { getProduct } from "@/actions/product";

import BreadcrumbSection from "@/components/layout/breadcrumb-section";
import { ImageSlider } from "@/components/shared/image-slider";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

import Client from "./Client";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const res = await getProduct(id);
  const product = res.data;
  if (!res && product) return <div>Loading...</div>;
  return (
    <section className="py-10">
      <MaxWidthWrapper>
        <BreadcrumbSection end={product?.title} />
        <div className="grid gap-8 md:grid-cols-2">
          <ImageSlider images={product?.images ?? []} />
          {/* Product Details */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">
              {product?.title}
            </h1>
            <p className="text-primary text-2xl font-semibold">
              ${product?.price.toFixed(2)}
            </p>
            <div className="flex items-center gap-2">
              {/* <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(product?.rating.rate)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                ({product?.rating.count} reviews)
              </span>
            </div> */}
            </div>
            <p className="text-gray-600">{product?.description}</p>
            <Client product={product} />
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default page;
