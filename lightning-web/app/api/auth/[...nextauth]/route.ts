/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { JWT } from "next-auth/jwt"

import { findMemberBySocial } from "@/repository/MemberRepository";
import { SocialType } from "@/repository/dto/SocialType";


function isValidSocialType(value: unknown): value is SocialType {
  return typeof value === 'string' && ['LOCAL', 'GOOGLE', 'KAKAO', 'APPLE'].includes(value);
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async signIn({ account, user }) {
      // console.log(`account: ${JSON.stringify(account)}`);
      // console.log(`profile: ${JSON.stringify(profile)}`);
      console.log(`user: ${JSON.stringify(user)}`);

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
        
      return true;

      // if (member) {
      //   console.log(`member: ${JSON.stringify(member)}`);
      //   // 사용자가 있다면, 홈 페이지로 리다이렉트
      //   return true;
      // } else {
      //   // 사용자가 없으면, 사용자 회원가입 페이지로 리다이렉트
      
      //   return true;
      // }
    },

    async jwt({ token, account }) {
      // early return if no account
      if (!account) {
        return token;
      }

      const member = await findMemberBySocial(
        (account.provider.toUpperCase() as SocialType), 
        account.providerAccountId
      );

      if (member) {
        token.memberId = member.id;
      }

      token.socialType = account.provider;
      token.socialId = account.providerAccountId;

      return token;
    },

    async session({ session, token }: { session: any; token: JWT}) {
      if (token.memberId) {
        session.memberId = token.memberId;
      }

      session.socialType = token.socialType;
      session.socialId = token.socialId;

      return session;
    },

    async redirect({ url, baseUrl }) {
      return `${baseUrl}/join/entry`;
    }
  },
  pages: {
    signIn: '/signin',
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }