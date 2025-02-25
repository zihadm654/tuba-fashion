import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Tuba Fasion",
  description:
    "Tuba Fasion is a fashion store that sells clothes, tshirt, pants, and more.And it includes kids sections",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://twitter.com/zihadm654",
    github: "https://github.com/zihadm654/zihadm654",
  },
  mailSupport: "support@saas-starter.com",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "/about" },
      { title: "Enterprise", href: "#" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
      { title: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Policies",
    items: [
      { title: "Mission & Vision", href: "#" },
      { title: "Return/Exchange & Refund", href: "#" },
      { title: "Shopping Policy", href: "#" },
    ],
  },
  {
    title: "Others",
    items: [
      { title: "My Profile", href: "#" },
      { title: "Sitemap", href: "/sitemap.xml" },
      { title: "Blog Post", href: "/blogs" },
      { title: "How to order & Get offer", href: "#" },
    ],
  },
];
