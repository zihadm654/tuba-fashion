import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

import SearchResults from "./search-results";

const SearchPage = () => {
  return (
    <div className="pt-4">
      <MaxWidthWrapper>
        <Suspense
          fallback={
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          }
        >
          <SearchResults />
        </Suspense>
      </MaxWidthWrapper>
    </div>
  );
};

export default SearchPage;
