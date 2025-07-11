import Session from "@/auth/session";
import MainSidebar from "@/components/sidebars/main-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import prisma from "@/lib/prisma/prisma";
import { SessionProvider } from "next-auth/react";
import { cookies } from "next/headers";

export default async function SystemLayout({ children }: { children: React.ReactNode }) {
  const storedCookies = await cookies();
  const isOpen = storedCookies.get("sidebar_state")?.value === "true";

  const session = await Session.get();
  const userRole = session ? await prisma.userRole.findUnique({ where: { userId: session.user.id } }) : null;

  return (
    <SessionProvider>
      <SidebarProvider defaultOpen={isOpen}>
        <MainSidebar userRole={userRole} />
        <div className="flex h-[100svh] w-full">{children}</div>
      </SidebarProvider>
    </SessionProvider>
  );
}
