import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import React from "react";

export function MainLayout({ className, ...props }: React.ComponentProps<"div">) {
  return <div {...props} className={cn("flex size-full shrink-0 flex-col overflow-hidden", className)} />;
}

export function MainLayoutHeader({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div {...props} className={cn("flex h-[max-content] w-full shrink-0 items-center gap-2 px-3 py-3", className)}>
      <SidebarTrigger />
      <Separator orientation="vertical" />
      {children}
    </div>
  );
}

export function MainLayoutContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div {...props} className={cn("flex size-full flex-col gap-6 overflow-auto p-6", className)} />;
}

export function MainLayoutTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return <h1 {...props} className={cn("ms-2 text-2xl font-bold", className)} />;
}
