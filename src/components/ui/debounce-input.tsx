"use client";

import { useEffect, useState } from "react";
import { Input } from "./input";

const DEBOUNCE_TIME_MS = 500;

type DebounceInputProps = Omit<React.ComponentProps<typeof Input>, "onChange" | "defaultValue"> & {
  onChangeValue?: (value: string) => void;
  defaultValue?: string;
};

export default function DebounceInput({ defaultValue, value, onChangeValue, ...props }: DebounceInputProps) {
  const [internalValue, setInternalValue] = useState<string>(defaultValue ?? "");

  useEffect(() => {
    const timeout = setTimeout(() => onChangeValue?.(internalValue), DEBOUNCE_TIME_MS);

    return () => clearTimeout(timeout);
  }, [internalValue, onChangeValue]);

  return <Input value={value ?? internalValue} onChange={(e) => setInternalValue(e.target.value)} {...props} />;
}
