import prisma from "@/lib/prisma/prisma";
import { Session as NextAuthSession } from "next-auth";

import { redirect } from "next/navigation";
import { auth } from "./handlers";
import { Role } from "@prisma/client";

export default class Session {
  public static get(): Promise<NextAuthSession | null> {
    return auth();
  }

  public static async getOrRedirect(): Promise<NextAuthSession & { userRole: Role }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const session = await this.get();
    if (!session) redirect("/auth/sign-in");

    const userRole = await prisma.userRole.findUnique({ where: { userId: session.user.id } });
    if (!userRole) redirect("/auth/awaiting-approval");

    return { ...session, userRole: userRole as unknown as Role };
  }
}
