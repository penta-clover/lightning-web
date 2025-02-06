import { join } from "@/repository/MemberRepository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { stringToSocialType } from "@/repository/dto/SocialType";
import { cookies } from "next/headers";
import { decode, encode } from "next-auth/jwt";
import {
  findReferrerIdByCode,
  notifyReferralJoin,
  saveReferralLog,
} from "@/repository/RefererRepository";

async function handler(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const {
      nickname,
      socialType,
      socialId,
      email,
      alarmAllowed,
      name,
      gender,
      birthYear,
      phoneNumber,
    } = body;

    if (
      !nickname ||
      !socialType ||
      !socialId ||
      !email ||
      alarmAllowed === undefined
    ) {
      return new Response(JSON.stringify({ message: "invalid body" }), {
        status: 400,
      });
    }

    // check session has same social Type and Id
    if (session!.socialType !== socialType || session!.socialId !== socialId) {
      return new Response(JSON.stringify({ message: "Session not matched" }), {
        status: 400,
      });
    }

    // check if member already exists
    const result = await join({
      nickname: nickname,
      socialType: stringToSocialType(socialType),
      socialId: socialId,
      email: email,
      profileImageUrl: "/profile/default.svg",
      alarmAllowed: alarmAllowed,
      role: "USER",
      name,
      gender,
      birthYear,
      phoneNumber,
    });

    // return 400 if join failed
    if (!result) {
      return new Response(JSON.stringify({ message: "Join failed" }), {
        status: 400,
      });
    }

    // 가입 성공 후 DB의 memberId가 포함된 JWT 토큰 재서명
    const secret = process.env.JWT_SECRET!;

    const cookieStore = await cookies();
    const existingToken =
      cookieStore.get("next-auth.session-token")?.value ||
      cookieStore.get("__Secure-next-auth.session-token")?.value;

    if (existingToken) {
      // decode
      const decoded = await decode({ token: existingToken, secret });
      decoded!.id = result.id;
      decoded!.role = result.role;

      // encode
      const newToken = await encode({ token: decoded!, secret });

      // (재서명된 JWT를 Set-Cookie로 실어 보내기
      const cookieName =
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token";
      cookieStore.set(cookieName, newToken, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    // 레퍼럴 관련 로직
    const referralCode = cookieStore.get("referralCode")?.value;

    if (referralCode) {
      const referrerId = await findReferrerIdByCode(referralCode);

      if (referrerId) {
        // 레퍼럴 등록
        saveReferralLog(referrerId, result.id, "join");
        // 레퍼럴 알림
        notifyReferralJoin(referrerId, result.id);
      }
    }

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}

export { handler as POST };
