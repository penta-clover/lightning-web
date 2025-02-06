import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    id?: string;
    role?: string;
    socialType?: string;
    socialId?: string;
    user: {
      email: string;
      name?: string;
      gender?: string;
      birthYear?: string;
      phoneNumber?: string;
    };
  }

  interface User {
    gender?: string;
    birthYear?: string;
    phoneNumber?: string;
  }

}