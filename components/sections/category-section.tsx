import Image from "next/image";
import Link from "next/link";
import men from "@/public/_static/assets/home-page/collections/hockerty_man_in_a_posh_polo_shirt_beige_outfit_in_front_of_a_lu_26e738f1_1604_4ca4_9a20_63a68575ac6f__1_-2234696957.jpg";
import kids from "@/public/_static/assets/home-page/collections/th-1400123638.jpg";
import women from "@/public/_static/assets/home-page/collections/th-1878564434.jpg";

import BlurImage from "../shared/blur-image";
import MaxWidthWrapper from "../shared/max-width-wrapper";

export function CategoriesSelection() {
  return (
    <div className="py-24 sm:py-32">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight">
            Shop by Category
          </h2>

          <Link
            className="text-primary hover:text-primary/80 text-sm font-semibold"
            href="/products"
          >
            Browse all Products &rarr;
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8">
          <div className="group aspect-w-2 aspect-h-1 sm:aspect-w-1 overflow-hidden rounded-xl sm:row-span-2">
            <BlurImage
              src={kids}
              height={400}
              width={600}
              alt="All Products Image"
              className="object-cover object-center"
            />
            <div className="bg-gradient-to-b from-transparent to-black opacity-55" />
            <div className="flex items-end p-6">
              <Link href="/products">
                <h3 className="font-semibold text-white">All Products</h3>
                <p className="mt-1 text-sm text-white">Shop Now</p>
              </Link>
            </div>
          </div>

          <div className="group aspect-w-2 aspect-h-1 sm:aspect-none overflow-hidden rounded-lg sm:relative sm:h-full">
            <BlurImage
              src={men}
              height={400}
              width={600}
              alt="Products for men Image"
              className="object-cover object-bottom sm:absolute sm:inset-0 sm:h-full sm:w-full"
            />
            <div className="bg-gradient-to-b from-transparent to-black opacity-55 sm:absolute sm:inset-0" />
            <div className="flex items-end p-6 sm:absolute sm:inset-0">
              <Link href="/collections/men">
                <h3 className="font-semibold text-white">Products for Men</h3>
                <p className="mt-1 text-sm text-white">Shop Now</p>
              </Link>
            </div>
          </div>

          <div className="group aspect-w-2 aspect-h-1 sm:aspect-none overflow-hidden rounded-lg sm:relative sm:h-full">
            <BlurImage
              src={women}
              height={400}
              width={600}
              alt="Women product image"
              className="object-cover object-bottom sm:absolute sm:inset-0 sm:h-full sm:w-full"
            />
            <div className="bg-gradient-to-b from-transparent to-black opacity-55 sm:absolute sm:inset-0" />
            <div className="flex items-end p-6 sm:absolute sm:inset-0">
              <Link href="/collections/women">
                <h3 className="font-semibold text-white">Products for Women</h3>
                <p className="mt-1 text-sm text-white">Shop Now</p>
              </Link>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
