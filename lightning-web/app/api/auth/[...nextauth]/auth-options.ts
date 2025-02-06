import { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";

import { findMemberBySocial } from "@/repository/MemberRepository";
import { SocialType } from "@/repository/dto/SocialType";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.properties.nickname, // 이름 추가
          email: profile.kakao_account.email,
          gender: profile.kakao_account.gender,         // 성별
          birthYear: profile.kakao_account.birthyear,       // 출생 연도
          phoneNumber: profile.kakao_account.phone_number, // 전화번호
        };
      }
    })
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async signIn({ account }) {
      return account ? true : false;
    },

    async jwt({ token, account, user }) {
      token = token ?? {};

      if (account) {
        const member = await findMemberBySocial(
          (account.provider.toUpperCase() as SocialType),
          account.providerAccountId
        );

        token.id = member?.id;
        token.role = member?.role;

        token.socialType = account.provider;
        token.socialId = account.providerAccountId;

        if (account.provider === "kakao" && user) {
          token.name = user.name;           // 이름
          token.gender = user.gender;       // 성별
          token.birthYear = user.birthYear; // 출생 연도
          token.phoneNumber = user.phoneNumber; // 전화번호
          // 만약 image가 필요하고 권한도 요청했다면 token.image에 추가할 수 있음
        }
      }
      return token;
    },

    async session({ session, token }: { session: Session, token: JWT }) {
      session.id = token.id as string | undefined;
      session.role = token.role as string | undefined;

      session.socialType = token.socialType as string;
      session.socialId = token.socialId as string;

      // 추가한 사용자 정보 전달
      session.user.name = token.name ? token.name as string : undefined;
      session.user.gender = token.gender ? token.gender as string : undefined;
      session.user.birthYear = token.birthYear ? token.birthYear as string : undefined;
      session.user.phoneNumber = token.phoneNumber ? token.phoneNumber as string : undefined;

      return session;
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/join/entry`;
    }
  },
  pages: {
    signIn: '/',
  }
}