import "server-only";

import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "@/lib/prisma/prisma";

import { PrismaAdapter } from "@auth/prisma-adapter";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: {
    ...PrismaAdapter(prisma),
  },

  pages: {
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-in",
    error: "/auth/sign-in",
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
});
