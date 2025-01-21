import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    memberId?: string;
    socialType?: string;
    socialId?: string;
  }
}