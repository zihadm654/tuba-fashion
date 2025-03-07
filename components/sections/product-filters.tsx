"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Check,
  ListFilter,
  PlusCircle,
  Tag,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { nanoid } from "nanoid";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { AnimateChangeInHeight } from "../ui/filters";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

// Define filter types
export enum FilterType {
  CATEGORY = "Category",
  PRICE_RANGE = "Price Range",
  SORT_BY = "Sort By",
}

export enum FilterOperator {
  IS = "is",
  IS_NOT = "is not",
}

export type FilterOption = {
  name: string;
  value: string;
  icon?: React.ReactNode;
  label?: string;
};

export type Filter = {
  id: string;
  type: FilterType;
  operator: FilterOperator;
  value: string[];
};

// Define filter options
const categoryOptions: FilterOption[] = [
  { name: "All", value: "all", icon: <Tag className="size-3.5" /> },
  { name: "Men", value: "men", icon: <Tag className="size-3.5" /> },
  { name: "Women", value: "women", icon: <Tag className="size-3.5" /> },
  { name: "Kids", value: "kids", icon: <Tag className="size-3.5" /> },
];

const priceRangeOptions: FilterOption[] = [
  { name: "All Prices", value: "all" },
  { name: "Under ৳250", value: "0-250" },
  { name: "৳250 - ৳500", value: "250-500" },
  { name: "৳500 - ৳1000", value: "500-1000" },
  { name: "Over ৳1000", value: "1000-above" },
];

const sortOptions: FilterOption[] = [
  {
    name: "Newest",
    value: "newest",
    icon: <ArrowDownAZ className="size-3.5" />,
  },
  {
    name: "Price: Low to High",
    value: "price_asc",
    icon: <ArrowUpAZ className="size-3.5" />,
  },
  {
    name: "Price: High to Low",
    value: "price_desc",
    icon: <ArrowDownAZ className="size-3.5" />,
  },
];

const filterViewToFilterOptions: Record<FilterType, FilterOption[]> = {
  [FilterType.CATEGORY]: categoryOptions,
  [FilterType.PRICE_RANGE]: priceRangeOptions,
  [FilterType.SORT_BY]: sortOptions,
};

// Filter Icon component
const FilterIcon = ({ type, value }: { type: FilterType; value?: string }) => {
  switch (type) {
    case FilterType.CATEGORY:
      return <Tag className="size-3.5" />;
    case FilterType.PRICE_RANGE:
      return <Tag className="size-3.5" />;
    case FilterType.SORT_BY:
      return value === "price_asc" ? (
        <ArrowUpAZ className="size-3.5" />
      ) : (
        <ArrowDownAZ className="size-3.5" />
      );
    default:
      return <Tag className="size-3.5" />;
  }
};

// Filter Operator Dropdown component
const FilterOperatorDropdown = ({
  filterType,
  operator,
  setOperator,
}: {
  filterType: FilterType;
  operator: FilterOperator;
  setOperator: (operator: FilterOperator) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border-border shrink-0 border-x px-1.5 py-1 transition">
        {operator}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit min-w-fit">
        <DropdownMenuItem onClick={() => setOperator(FilterOperator.IS)}>
          {FilterOperator.IS}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setOperator(FilterOperator.IS_NOT)}>
          {FilterOperator.IS_NOT}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Filter Value Combobox component
const FilterValueCombobox = ({
  filterType,
  filterValues,
  setFilterValues,
}: {
  filterType: FilterType;
  filterValues: string[];
  setFilterValues: (filterValues: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [commandInput, setCommandInput] = useState("");
  const commandInputRef = useRef<HTMLInputElement>(null);
  const options = filterViewToFilterOptions[filterType];
  const nonSelectedFilterValues = options.filter(
    (filter) => !filterValues.includes(filter.value),
  );

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setTimeout(() => {
            setCommandInput("");
          }, 200);
        }
      }}
    >
      <PopoverTrigger className="bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border-border shrink-0 rounded-none border-r px-1.5 py-1 transition">
        <div className="flex items-center gap-1.5">
          <div className="flex flex-row items-center -space-x-1.5">
            <AnimatePresence mode="popLayout">
              {filterValues?.slice(0, 1).map((value) => (
                <motion.div
                  key={value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <FilterIcon type={filterType} value={value} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {filterValues?.length === 1
            ? options.find((opt) => opt.value === filterValues[0])?.name ||
              filterValues[0]
            : `${filterValues?.length} selected`}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <AnimateChangeInHeight>
          <Command>
            <CommandInput
              placeholder={filterType}
              className="h-9"
              value={commandInput}
              onInputCapture={(e) => {
                setCommandInput(e.currentTarget.value);
              }}
              ref={commandInputRef}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {filterValues.map((value) => {
                  const option = options.find((opt) => opt.value === value);
                  return (
                    <CommandItem
                      key={value}
                      className="group flex items-center gap-2"
                      onSelect={() => {
                        setFilterValues(
                          filterValues.filter((v) => v !== value),
                        );
                        setTimeout(() => {
                          setCommandInput("");
                        }, 200);
                        setOpen(false);
                      }}
                    >
                      <Checkbox checked={true} />
                      {option?.icon}
                      <span className="text-accent-foreground">
                        {option?.name || value}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {nonSelectedFilterValues?.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    {nonSelectedFilterValues.map((filter: FilterOption) => (
                      <CommandItem
                        className="group flex items-center gap-2"
                        key={filter.value}
                        value={filter.name}
                        onSelect={() => {
                          setFilterValues([...filterValues, filter.value]);
                          setTimeout(() => {
                            setCommandInput("");
                          }, 200);
                          setOpen(false);
                        }}
                      >
                        <Checkbox
                          checked={false}
                          className="opacity-0 group-data-[selected=true]:opacity-100"
                        />
                        {filter.icon}
                        <span className="text-accent-foreground">
                          {filter.name}
                        </span>
                        {filter.label && (
                          <span className="text-muted-foreground ml-auto text-xs">
                            {filter.label}
                          </span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </AnimateChangeInHeight>
      </PopoverContent>
    </Popover>
  );
};

// Add Filter Dropdown component
const AddFilterDropdown = ({
  onAddFilter,
  existingFilterTypes,
}: {
  onAddFilter: (type: FilterType) => void;
  existingFilterTypes: FilterType[];
}) => {
  const availableFilterTypes = Object.values(FilterType).filter(
    (type) => !existingFilterTypes.includes(type),
  );

  if (availableFilterTypes.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
          <PlusCircle className="h-3.5 w-3.5" />
          Add Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[180px]">
        {availableFilterTypes.map((type) => (
          <DropdownMenuItem
            key={type}
            onClick={() => onAddFilter(type)}
            className="flex items-center gap-2"
          >
            <FilterIcon type={type} />
            {type}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface ProductFiltersProps {
  onFiltersChange?: (filters: {
    category: string;
    priceRange: string;
    sortBy: string;
  }) => void;
}

const ProductFilters = ({ onFiltersChange }: ProductFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use useRef to store the previous URL to avoid unnecessary navigation
  const previousUrlRef = useRef<string>("");

  // Only create initial filters for values that exist in the URL
  const initialFilters: Filter[] = [];

  const category = searchParams.get("category");
  if (category) {
    initialFilters.push({
      id: nanoid(),
      type: FilterType.CATEGORY,
      operator: FilterOperator.IS,
      value: [category],
    });
  }

  const priceRange = searchParams.get("priceRange");
  if (priceRange) {
    initialFilters.push({
      id: nanoid(),
      type: FilterType.PRICE_RANGE,
      operator: FilterOperator.IS,
      value: [priceRange],
    });
  }

  const sortBy = searchParams.get("sortBy");
  if (sortBy) {
    initialFilters.push({
      id: nanoid(),
      type: FilterType.SORT_BY,
      operator: FilterOperator.IS,
      value: [sortBy],
    });
  }

  const [filters, setFilters] = useState<Filter[]>(initialFilters);

  // Memoize the filter change handler to prevent unnecessary re-renders
  const handleFiltersChange = useCallback(() => {
    if (!onFiltersChange) return;

    const categoryFilter = filters.find((f) => f.type === FilterType.CATEGORY);
    const priceRangeFilter = filters.find(
      (f) => f.type === FilterType.PRICE_RANGE,
    );
    const sortByFilter = filters.find((f) => f.type === FilterType.SORT_BY);

    onFiltersChange({
      category: categoryFilter?.value[0] || "all",
      priceRange: priceRangeFilter?.value[0] || "all",
      sortBy: sortByFilter?.value[0] || "newest",
    });
  }, [filters, onFiltersChange]);

  // Use a debounced effect to update the URL and call onFiltersChange
  useEffect(() => {
    const params = new URLSearchParams();

    filters.forEach((filter) => {
      if (filter.value.length > 0 && filter.value[0] !== "all") {
        switch (filter.type) {
          case FilterType.CATEGORY:
            params.set("category", filter.value[0]);
            break;
          case FilterType.PRICE_RANGE:
            params.set("priceRange", filter.value[0]);
            break;
          case FilterType.SORT_BY:
            params.set("sortBy", filter.value[0]);
            break;
        }
      }
    });

    const url = `/products${params.toString() ? `?${params.toString()}` : ""}`;

    // Only update URL if it has changed
    if (url !== previousUrlRef.current) {
      previousUrlRef.current = url;
      router.push(url, { scroll: false });

      // Call the filter change handler
      handleFiltersChange();
    }
  }, [filters, router, handleFiltersChange]);

  // Memoize the add filter handler
  const handleAddFilter = useCallback((type: FilterType) => {
    const defaultValue = type === FilterType.SORT_BY ? "newest" : "all";
    setFilters((prev) => [
      ...prev,
      {
        id: nanoid(),
        type,
        operator: FilterOperator.IS,
        value: [defaultValue],
      },
    ]);
  }, []);

  // Memoize the clear filters handler
  const handleClearFilters = useCallback(() => {
    setFilters([]);
    router.push("/products", { scroll: false });

    if (onFiltersChange) {
      onFiltersChange({ category: "all", priceRange: "all", sortBy: "newest" });
    }
  }, [router, onFiltersChange]);

  // Memoize the existing filter types
  const existingFilterTypes = useMemo(
    () => filters.map((filter) => filter.type),
    [filters],
  );

  // Memoize the filter update handlers
  const updateOperator = useCallback((id: string, operator: FilterOperator) => {
    setFilters((prev) =>
      prev.map((f) => (f.id === id ? { ...f, operator } : f)),
    );
  }, []);

  const updateFilterValues = useCallback(
    (id: string, filterValues: string[]) => {
      setFilters((prev) =>
        prev.map((f) => (f.id === id ? { ...f, value: filterValues } : f)),
      );
    },
    [],
  );

  const removeFilter = useCallback((id: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return (
    <div className="mb-6">
      <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
        {filters.map((filter) => (
          <div
            key={filter.id}
            className="border-border bg-card flex items-center gap-[1px] overflow-hidden rounded border text-xs shadow-sm"
          >
            <div className="bg-muted text-foreground/80 flex shrink-0 items-center gap-1.5 px-1.5 py-1">
              <FilterIcon type={filter.type} />
              {filter.type}
            </div>
            <FilterOperatorDropdown
              filterType={filter.type}
              operator={filter.operator}
              setOperator={(operator) => updateOperator(filter.id, operator)}
            />
            <FilterValueCombobox
              filterType={filter.type}
              filterValues={filter.value}
              setFilterValues={(filterValues) =>
                updateFilterValues(filter.id, filterValues)
              }
            />
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-destructive/10 hover:text-destructive h-7 w-7 rounded-none p-0"
              onClick={() => removeFilter(filter.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-card hover:bg-muted/80 h-7 gap-1 text-xs shadow-sm"
            >
              <ListFilter className="size-6" />
              Add Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[180px]">
            {Object.values(FilterType).map((type) => {
              const alreadyExists = filters.some((f) => f.type === type);
              if (alreadyExists) return null;

              return (
                <DropdownMenuItem
                  key={type}
                  onClick={() => handleAddFilter(type)}
                  className="flex items-center gap-2"
                >
                  <FilterIcon type={type} />
                  {type}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filters.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="bg-card hover:bg-muted/80 text-xs shadow-sm"
          onClick={handleClearFilters}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default ProductFilters;
