import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function monetaryToString(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
}

export function initialsName(name: string) {
  const names = name.split(" ");
  const firstName = names[0];
  const lastName = names[names.length - 1];

  if (names.length === 1) return firstName[0];
  if (names.length > 1) return `${firstName[0]}${lastName[0]}`;
  return "U";
}
