"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type SelectOrderTypeProps = { searchParamKey: string; orders: { label: string; value: string }[] };

export default function SelectOrderType({ orders, searchParamKey }: SelectOrderTypeProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderType = searchParams.get(searchParamKey);

  const handleOnSelect = useCallback(
    (value: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(searchParamKey, value);
      router.push("/system/tickets" + "?" + newSearchParams.toString());
    },
    [searchParams, router, searchParamKey]
  );

  return (
    <Select value={orderType ?? undefined} onValueChange={handleOnSelect}>
      <SelectTrigger>
        Modo: <SelectValue />
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
