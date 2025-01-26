import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    id?: string;
    role?: string;
    socialType?: string;
    socialId?: string;
  }
}