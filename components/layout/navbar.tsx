"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import useCartStore from "@/utils/cart";
import { ShoppingBagIcon } from "lucide-react";
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

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "../ui/command";
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

export function NavBar({ scroll = false }: NavBarProps) {
  const scrolled = useScroll(50);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
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
  const items = useCartStore((state) => state.items);

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

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
          <Link href="/" className="flex items-center space-x-2.5">
            <Icons.logo />
            <span className="font-urban text-xl font-bold">
              {siteConfig.name}
            </span>
          </Link>
          {links && links.length > 0 ? (
            <NavigationMenu className="hidden md:flex">
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
        <div className="flex w-full items-center justify-center max-md:ml-2">
          <Button
            variant="outline"
            className="text-muted-foreground relative h-9 w-full justify-start rounded-[0.5rem] text-sm sm:pr-12 md:w-40 lg:w-64"
            onClick={() => setOpen(true)}
          >
            <span className="hidden lg:inline-flex">Search products...</span>
            <span className="inline-flex lg:hidden">Search...</span>
            <kbd className="bg-muted pointer-events-none absolute top-2 right-1.5 hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder="Type to search..."
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {/* Add CommandGroup and CommandItem here for search results */}
            </CommandList>
          </CommandDialog>
        </div>
        <div className="flex items-center space-x-6">
          <Link
            href="/cart"
            className="group mr-2 flex items-center p-2 max-md:mr-6"
          >
            <ShoppingBagIcon className="h-6 w-6 text-gray-400 group-hover:text-gray-500" />
            <span className="ml-0.5 text-sm font-medium text-gray-700 group-hover:text-gray-800 dark:text-white">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </Link>
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
    </header>
  );
}
