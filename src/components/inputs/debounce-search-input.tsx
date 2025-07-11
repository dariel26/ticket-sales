"use client";

import DebounceInput from "../ui/debounce-input";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconSearch } from "../ui/icon";
import { useCallback } from "react";

const SEARCH_KEY = "search";

export default function DebounceSearchInput({ ...props }: { placeholder?: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const initialSearch = searchParams.get(SEARCH_KEY) ?? "";

  const handleOnSearch = useCallback(
    (search: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      if (search === "") newSearchParams.delete(SEARCH_KEY);
      else newSearchParams.set(SEARCH_KEY, search);

      router.push(pathname + "?" + newSearchParams.toString());
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="relative flex h-[max-content] w-full items-center">
      <IconSearch className="text-muted-foreground absolute ms-2 size-4" />
      <DebounceInput className="ps-7" onChangeValue={handleOnSearch} defaultValue={initialSearch} {...props} />
    </div>
  );
}
