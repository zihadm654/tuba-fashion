import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Tuba_Fashion",
  description:
    "Tuba Fasion is a fashion store that sells clothes, tshirt, pants, and more.And it includes kids sections",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  logo: `/_static/logo.PNG`,
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
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
      { title: "Sitemap", href: "/sitemap.xml" },
    ],
  },
  {
    title: "Policies",
    items: [
      { title: "Mission & Vision", href: "#" },
      { title: "Return/Exchange & Refund", href: "#" },
      { title: "Shopping Policy", href: "#" },
      { title: "How to order & Get offer", href: "#" },
    ],
  },
  {
    title: "Contacts",
    items: [
      {
        title: "Facebook",
        href: "https://www.facebook.com/share/1ADEp6tVr7/?mibextid=wwXIfr",
      },
      { title: "Instagram", href: "https://www.instagram.com/tubafashion2025" },
      {
        title: "Tiktok",
        href: "https://www.tiktok.com/@tuba.fashion.hous?_t=ZS-8uRRCQeEp3x&_r=1",
      },
      {
        title: "Whatsapp",
        href: "https://wa.me/88001776708038?text=Hey+there,+I+have+a+question!",
      },
    ],
  },
];
