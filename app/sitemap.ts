import type { MetadataRoute } from "next";
import { getProducts } from "@/actions/product";

import { env } from "@/env.mjs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const res = await getProducts();
  const products = res?.data?.map(({ id, createdAt }) => ({
    url: `${env.NEXT_PUBLIC_APP_URL}/products/${id}`,
    lastModified: new Date(createdAt).toISOString().split("T")[0],
  }));
  const routes = [
    {
      url: `${env.NEXT_PUBLIC_APP_URL}`,
      lastModified: new Date(),
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/products`,
      lastModified: new Date(),
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/about`,
      lastModified: new Date(),
      changefreq: "yearly",
      priority: 0.5,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/blog`,
      lastModified: new Date(),
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/search`,
      lastModified: new Date(),
      changefreq: "weekly",
      priority: 0.5,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/contact`,
      lastModified: new Date(),
      changefreq: "yearly",
      priority: 1,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/login`,
      lastModified: new Date(),
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/register`,
      lastModified: new Date(),
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/cart`,
      lastModified: new Date(),
      changefreq: "weekly",
      priority: 0.5,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/admin`,
      lastModified: new Date(),
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/admin/products`,
      lastModified: new Date(),
      changefreq: "weekly",
      priority: 0.5,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/admin/orders`,
      lastModified: new Date(),
      changefreq: "weekly",
      priority: 0.5,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/dashboard`,
      lastModified: new Date(),
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/dashboard/products`,
      lastModified: new Date(),
      changefreq: "weekly",
      priority: 0.5,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
      lastModified: new Date(),
      changefreq: "yearly",
      priority: 1,
    },
  ];

  return [...routes, ...(products ?? [])];
}
