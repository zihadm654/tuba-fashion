"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProducts } from "@/actions/product";
import { Product } from "@prisma/client";

import Products from "@/components/sections/products";
import { SkeletonSection } from "@/components/shared/section-skeleton";

const SearchResults = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("title") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!searchQuery) {
        setProducts([]);
        return;
      }

      setLoading(true);
      try {
        const [exactMatch, partialMatch] = await Promise.all([
          getProducts({
            title: searchQuery,
            category: "all",
            sortBy: "latest",
          }),
          getProducts({
            title: searchQuery
              .split(" ")
              .filter((word) => word.length > 2)
              .join(" "),
            category: "all",
            sortBy: "latest",
          }),
        ]);

        const combinedResults = new Map<string, Product>();

        if (exactMatch.success && exactMatch.data) {
          exactMatch.data.forEach((product) => {
            combinedResults.set(product.id, product);
          });
        }

        if (partialMatch.success && partialMatch.data) {
          partialMatch.data.forEach((product) => {
            if (!combinedResults.has(product.id)) {
              combinedResults.set(product.id, product);
            }
          });
        }

        setProducts(Array.from(combinedResults.values()));
      } catch (error) {
        console.error("Error searching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  if (loading) {
    return <SkeletonSection />;
  }

  return (
    <Products
      products={products}
      title={
        searchQuery
          ? `Search Results for "${searchQuery}" (${products.length})`
          : "Enter a search term in the navigation bar"
      }
    />
  );
};

export default SearchResults;
