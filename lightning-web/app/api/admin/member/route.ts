import { join } from '@/repository/MemberRepository';

export async function POST(req: Request) {
  try {
    const { nickname, socialType, socialId, email, profileImageUrl, alarmAllowed, role } = await req.json();

    if (!nickname || !socialType || !socialId || !email || !profileImageUrl || (alarmAllowed === undefined) || !role) {
      return new Response(JSON.stringify({ message: 'invalid body' }), { status: 400 });
    }

    const result = await join({
        nickname: nickname,
        socialType: socialType,
        socialId: socialId,
        email: email,
        profileImageUrl: profileImageUrl,
        alarmAllowed: alarmAllowed,
        role: role
    });

    if (!result) {
        return new Response(JSON.stringify({ message: 'Join failed' }), { status: 400 });
    }

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}