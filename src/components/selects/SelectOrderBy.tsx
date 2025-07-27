"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type SelectOrderByProps = { searchParamKey: string; orders: { label: string; value: string }[] };

export default function SelectOrderBy({ orders, searchParamKey }: SelectOrderByProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderBy = searchParams.get(searchParamKey);

  const handleOnSelect = useCallback(
    (value: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(searchParamKey, value);
      router.push("/system/tickets" + "?" + newSearchParams.toString());
    },
    [searchParams, router, searchParamKey]
  );

  return (
    <Select value={orderBy ?? undefined} onValueChange={handleOnSelect}>
      <SelectTrigger>
        Ordenar por: <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {orders.map((order) => (
            <SelectItem key={order.value} value={order.value}>
              {order.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
