"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProducts } from "@/actions/product";
import { Product } from "@prisma/client";

import Products from "@/components/sections/products";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { Loader2 } from "lucide-react";

const SearchPage = () => {
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
            title: searchQuery.split(' ').filter(word => word.length > 2).join(' '),
            category: "all",
            sortBy: "latest",
          })
        ]);

        const combinedResults = new Map<string, Product>();

        if (exactMatch.success && exactMatch.data) {
          exactMatch.data.forEach(product => {
            combinedResults.set(product.id, product);
          });
        }

        if (partialMatch.success && partialMatch.data) {
          partialMatch.data.forEach(product => {
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

  return (
    <div className="pt-4">
      <MaxWidthWrapper>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Products
            products={products}
            title={
              searchQuery
                ? `Search Results for "${searchQuery}" (${products.length})`
                : "Enter a search term in the navigation bar"
            }
          />
        )}
      </MaxWidthWrapper>
    </div>
  );
};

export default SearchPage;
