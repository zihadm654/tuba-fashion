"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

const categories = ["all", "men", "women", "kids"];

const priceRanges = [
  { label: "All", value: "all" },
  { label: "Under ৳50", value: "0-50" },
  { label: "৳50 - ৳100", value: "50-100" },
  { label: "৳100 - ৳200", value: "100-200" },
  { label: "Over ৳200", value: "200-above" },
];

interface ProductFiltersProps {
  onFiltersChange: (filters: {
    category: string;
    priceRange: string;
    sortBy: string;
  }) => void;
}

const ProductFilters = ({ onFiltersChange }: ProductFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [priceRange, setPriceRange] = useState(
    searchParams.get("priceRange") || "all",
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");

  const handleFiltersChange = () => {
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (priceRange !== "all") params.set("priceRange", priceRange);
    if (sortBy !== "newest") params.set("sortBy", sortBy);

    router.push(`/products?${params.toString()}`);
    onFiltersChange({ category, priceRange, sortBy });
  };

  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={priceRange} onValueChange={setPriceRange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Price Range" />
        </SelectTrigger>
        <SelectContent>
          {priceRanges.map((range) => (
            <SelectItem key={range.value} value={range.value}>
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={handleFiltersChange}>Apply Filters</Button>
    </div>
  );
};

export default ProductFilters;
