import { redirect } from "next/navigation";

export default function NotFound() {
  redirect("/system/parties");
  return null;
}
