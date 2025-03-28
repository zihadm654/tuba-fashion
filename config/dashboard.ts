import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      {
        href: "/admin",
        icon: "laptop",
        title: "Admin Panel",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/dashboard",
        icon: "dashboard",
        title: "Dashboard",
        authorizeOnly: UserRole.USER,
      },
      // {
      //   href: "/dashboard/billing",
      //   icon: "billing",
      //   title: "Billing",
      //   authorizeOnly: UserRole.USER,
      // },
      // { href: "/dashboard/charts", icon: "lineChart", title: "Charts" },
      {
        href: "/dashboard/orders",
        icon: "package",
        title: "Orders",
        badge: 2,
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/admin/orders",
        icon: "package",
        title: "Orders",
        badge: 2,
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/products",
        icon: "post",
        title: "Admin Products",
        authorizeOnly: UserRole.ADMIN,
        // disabled: true,
      },
      {
        href: "/admin/banner",
        icon: "post",
        title: "Admin Banners",
        authorizeOnly: UserRole.ADMIN,
        // disabled: true,
      },
      {
        href: "/admin/brands",
        icon: "post",
        title: "Admin Brands",
        authorizeOnly: UserRole.ADMIN,
        // disabled: true,
      },
      {
        href: "/admin/categories",
        icon: "post",
        title: "Admin Categories",
        authorizeOnly: UserRole.ADMIN,
        // disabled: true,
      },
    ],
  },
  {
    title: "OPTIONS",
    items: [
      { href: "/dashboard/settings", icon: "settings", title: "Settings" },
      { href: "/", icon: "home", title: "Homepage" },
      // { href: "/docs", icon: "bookOpen", title: "Documentation" },
      {
        href: "#",
        icon: "messages",
        title: "Support",
        authorizeOnly: UserRole.USER,
        disabled: true,
      },
    ],
  },
];
