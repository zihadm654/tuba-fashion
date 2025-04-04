"use client";

import Link from "next/link";
import kids from "@/public/_static/assets/home-page/collections/th-1400123638.jpg";
import { CategoriWithIncludes } from "@/types";

import BlurImage from "../shared/blur-image";
import MaxWidthWrapper from "../shared/max-width-wrapper";

interface CategoryProps {
  categories: CategoriWithIncludes[];
}
export function CategoriesSelection({ categories }: CategoryProps) {
  console.log(categories, "categories");
  return (
    <section className="py-16 sm:py-24">
      <MaxWidthWrapper>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="relative text-3xl font-bold tracking-tight">
            <span className="relative inline-block">
              Shop by Category
              <span className="bg-primary absolute -bottom-1 left-0 h-1 w-1/3 rounded-full"></span>
            </span>
          </h2>

          <Link
            className="text-primary hover:text-primary/80 group flex items-center gap-1 text-sm font-semibold transition-colors duration-200"
            href="/products"
          >
            All Products{" "}
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              &rarr;
            </span>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-8 lg:gap-10">
          {categories?.map((category) => (
            <div
              key={category.id}
              className="group aspect-w-2 aspect-h-1 sm:aspect-w-1 relative cursor-pointer overflow-hidden rounded-2xl shadow-lg sm:relative sm:row-span-2"
            >
              <BlurImage
                src={category.banners[0]?.imageString}
                height={400}
                width={600}
                alt="All Products Image"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70 transition-opacity duration-300 group-hover:via-black/40 group-hover:to-black/80" />
              <div className="absolute inset-0 flex items-end p-8">
                <Link
                  href={`/collections/${category.title}`}
                  className="w-full"
                >
                  <div className="transform text-white transition-transform duration-300 group-hover:translate-y-[-8px]">
                    <h3 className="text-xl font-bold drop-shadow-md md:text-2xl">
                      {category.title}
                    </h3>
                    <div className="mt-2 flex items-center">
                      <p className="mr-2 text-sm">Shop Now</p>
                      <span className="inline-block h-px w-5 transition-all duration-300 group-hover:w-8"></span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
          {/* 
          <div className="group aspect-w-2 aspect-h-1 sm:aspect-none relative cursor-pointer overflow-hidden rounded-2xl shadow-lg sm:relative sm:h-full">
            <BlurImage
              src={men}
              height={400}
              width={600}
              alt="Products for men Image"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-110 sm:absolute sm:inset-0 sm:h-full sm:w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70 transition-opacity duration-300 group-hover:via-black/40 group-hover:to-black/80" />
            <div className="absolute inset-0 flex items-end p-8">
              <Link href="/collections/men" className="w-full">
                <div className="transform text-white transition-transform duration-300 group-hover:translate-y-[-8px]">
                  <h3 className="text-xl font-bold drop-shadow-md">
                    Products for Men
                  </h3>
                  <div className="mt-2 flex items-center">
                    <p className="mr-2 text-sm">Shop Now</p>
                    <span className="inline-block h-px w-5 transition-all duration-300 group-hover:w-8"></span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="group aspect-w-2 aspect-h-1 sm:aspect-none relative cursor-pointer overflow-hidden rounded-2xl shadow-lg sm:relative sm:h-full">
            <BlurImage
              src={women}
              height={400}
              width={600}
              alt="Women product image"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-110 sm:absolute sm:inset-0 sm:h-full sm:w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70 transition-opacity duration-300 group-hover:via-black/40 group-hover:to-black/80" />
            <div className="absolute inset-0 flex items-end p-8">
              <Link href="/collections/women" className="w-full">
                <div className="transform text-white transition-transform duration-300 group-hover:translate-y-[-8px]">
                  <h3 className="text-xl font-bold drop-shadow-md">
                    Products for Women
                  </h3>
                  <div className="mt-2 flex items-center">
                    <p className="mr-2 text-sm">Shop Now</p>
                    <span className="inline-block h-px w-5 transition-all duration-300 group-hover:w-8"></span>
                  </div>
                </div>
              </Link>
            </div>
          </div> */}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
