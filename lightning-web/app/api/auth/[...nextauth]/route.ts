import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import KakaoProvider from "next-auth/providers/kakao";

import { findMemberBySocial } from "@/repository/MemberRepository";
import { SocialType } from "@/repository/dto/SocialType";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!
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
        
      return true;
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

    async session({ session, token }) {
      if (token.memberId) {
        session.memberId = token.memberId;
      }

      session.socialType = token.socialType;
      session.socialId = token.socialId;

      return session;
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/join/entry`;
    }
  },
  pages: {
    signIn: '/signin',
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }