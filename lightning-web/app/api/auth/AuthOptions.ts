import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { JWT } from "next-auth/jwt"

import { findMemberBySocial } from "@/repository/MemberRepository";
import { SocialType } from "@prisma/client";

function isValidSocialType(value: unknown): value is SocialType {
    return typeof value === 'string' && ['LOCAL', 'GOOGLE', 'KAKAO', 'APPLE'].includes(value);
  }

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      console.log(`account: ${JSON.stringify(account)}`);
      console.log(`profile: ${JSON.stringify(profile)}`);

      if (!account) {
        return false;
      }

      const provider = account.provider.toUpperCase() as SocialType;
      const providerAccountId = account.providerAccountId;
      // const email = profile?.email ?? '';

      if (!isValidSocialType(provider)) {
        return false;
      }

      // DB에서 사용자 정보를 조회
      const member = await findMemberBySocial(provider, providerAccountId);

      if (member) {
        console.log(`member: ${JSON.stringify(member)}`);
        // 사용자가 있다면, 홈 페이지로 리다이렉트
        return true;
      } else {
        // 사용자가 없으면, 사용자 회원가입 페이지로 리다이렉트
        const params = new URLSearchParams();
        params.append("socialType", provider);
        params.append("socialId", providerAccountId);
        params.append("email", profile?.email ?? "");

        return `/join/step1?${params.toString()}`;
      }
    },

    async jwt({ token, user }: { token: JWT; user?: any; profile?: any }) {
      if (user) {
        const member = await findMemberBySocial(
          user.provider.toUpperCase(),
          user.providerAccountId
        );

        if (member) {
          token.id = member.id;
        }

        token.socialType = user.provider;
        token.socialId = user.providerAccountId;
      }

      return token;
    },

    async session({ session, token }: { session: any; token: JWT }) {
      session.id = token.id;
      session.socialType = token.socialType;
      session.socialId = token.socialId;

      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};
