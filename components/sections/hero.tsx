import Image from "next/image";
import Link from "next/link";

import { prisma } from "@/lib/db";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carosuel";

import BlurImage from "../shared/blur-image";
import MaxWidthWrapper from "../shared/max-width-wrapper";

async function getData() {
  const data = await prisma.banner.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export async function Hero() {
  const data = await getData();

  return (
    <section className="py-2">
      <MaxWidthWrapper>
        <Carousel opts={{ align: "start", loop: true }}>
          <CarouselContent>
            {data?.map((item) => (
              <CarouselItem key={item.id}>
                <div className="relative h-[60vh] lg:h-[80vh]">
                  <BlurImage
                    alt="Banner Image"
                    src={item.imageString}
                    fill
                    className="h-full w-full rounded-xl object-cover"
                  />
                  <div className="bg-opacity-75 absolute bottom-10 left-6 rounded-xl p-4 text-black shadow-lg transition-transform hover:scale-105">
                    <Link href="/products" className="block overflow-hidden">
                      {/* <h1 className="text-lg font-bold lg:text-4xl">
                        {item.title}
                      </h1> */}
                      Shop Now
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-16" />
          <CarouselNext className="mr-16" />
        </Carousel>
      </MaxWidthWrapper>
    </section>
  );
}
