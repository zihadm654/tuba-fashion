"use client";

import { useContext } from "react";
import Link from "next/link";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import useCartStore from "@/utilities/cart";
import { ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";

import { docsConfig } from "@/config/docs";
import { marketingConfig } from "@/config/marketing";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { DocsSearch } from "@/components/docs/search";
import { ModalContext } from "@/components/modals/providers";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

import { Input } from "../ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

interface NavBarProps {
  scroll?: boolean;
  large?: boolean;
}

const AnnouncementBar = () => {
  return (
    <div className="w-full bg-black py-2">
      <div className="container mx-auto flex items-center justify-center px-8">
        <span className="text-center text-sm font-medium tracking-wide text-white">
          FREE SHIPPING ON ORDERS OVER $15.00 • FREE RETURNS
        </span>
      </div>
    </div>
  );
};

export function NavBar({ scroll = false }: NavBarProps) {
  const scrolled = useScroll(50);
  const { data: session, status } = useSession();
  const { setShowSignInModal } = useContext(ModalContext);

  const selectedLayout = useSelectedLayoutSegment();
  const documentation = selectedLayout === "docs";

  const configMap = {
    docs: docsConfig.mainNav,
  } as const;

  const links =
    (selectedLayout && selectedLayout === "docs"
      ? configMap[selectedLayout]
      : null) || marketingConfig.mainNav;
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  return (
    <header
      className={`bg-background/60 sticky top-0 z-40 flex w-full flex-col justify-center backdrop-blur-xl transition-all ${
        scroll ? (scrolled ? "border-b" : "bg-transparent") : "border-b"
      }`}
    >
      <MaxWidthWrapper
        className="flex h-14 items-center justify-between py-4"
        large={documentation}
      >
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-1.5">
            <Icons.logo />
            <span className="font-urban text-xl font-bold">
              {siteConfig.name}
            </span>
          </Link>

          {links && links.length > 0 ? (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Men</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[300px] lg:w-[400px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        {links.map((item: any) => (
                          <Link
                            legacyBehavior
                            passHref
                            key={item.href}
                            href={item.disabled ? "#" : item.href}
                            prefetch={true}
                            className={cn(
                              "hover:text-foreground/80 flex items-center text-lg font-medium transition-colors sm:text-sm",
                              item.href.startsWith(`/${selectedLayout}`)
                                ? "text-foreground"
                                : "text-foreground/60",
                              item.disabled && "cursor-not-allowed opacity-80",
                            )}
                          >
                            <NavigationMenuLink
                              className={navigationMenuTriggerStyle()}
                            >
                              {item.title}
                            </NavigationMenuLink>
                          </Link>
                        ))}
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Women</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[300px] lg:w-[400px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        {links.map((item: any) => (
                          <Link
                            legacyBehavior
                            passHref
                            key={item.href}
                            href={item.disabled ? "#" : item.href}
                            prefetch={true}
                            className={cn(
                              "hover:text-foreground/80 flex items-center text-lg font-medium transition-colors sm:text-sm",
                              item.href.startsWith(`/${selectedLayout}`)
                                ? "text-foreground"
                                : "text-foreground/60",
                              item.disabled && "cursor-not-allowed opacity-80",
                            )}
                          >
                            <NavigationMenuLink
                              className={navigationMenuTriggerStyle()}
                            >
                              {item.title}
                            </NavigationMenuLink>
                          </Link>
                        ))}
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          ) : null}
        </div>
        <div className="relative mx-8 hidden cursor-pointer items-center overflow-hidden md:flex md:grow-1">
          <Input className="h-full" placeholder="search product" />
          <Icons.search className="text-muted-foreground absolute top-0 right-0 mt-1.5 mr-1.5 size-8" />
        </div>
        <div className="flex items-center space-x-6">
          {/* right header for docs */}
          <div
            onClick={() => router.push("/cart")}
            className="relative cursor-pointer max-md:mr-8"
          >
            <ShoppingCart className="size-6" />
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          {documentation ? (
            <div className="hidden flex-1 items-center space-x-4 sm:justify-end lg:flex">
              <div className="hidden lg:flex lg:grow-0">
                <DocsSearch />
              </div>
              <div className="flex lg:hidden">
                <Icons.search className="text-muted-foreground size-6" />
              </div>
              <div className="flex space-x-4">
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icons.gitHub className="size-7" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </div>
            </div>
          ) : null}

          {session ? (
            <Link
              href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
              className="hidden md:block"
            >
              <Button
                className="gap-2 px-5"
                variant="default"
                size="sm"
                rounded="full"
              >
                <span>Dashboard</span>
              </Button>
            </Link>
          ) : status === "unauthenticated" ? (
            <Button
              className="hidden gap-2 px-5 md:flex"
              variant="default"
              size="sm"
              rounded="full"
              onClick={() => setShowSignInModal(true)}
            >
              <span>Sign In</span>
              <Icons.arrowRight className="size-4" />
            </Button>
          ) : (
            <Skeleton className="hidden h-9 w-28 rounded-full lg:flex" />
          )}
        </div>
      </MaxWidthWrapper>
      <AnnouncementBar />
    </header>
  );
}
