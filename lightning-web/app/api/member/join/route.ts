import { join } from '@/repository/MemberRepository';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { stringToSocialType } from '@/repository/dto/SocialType';

async function handler(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { nickname, socialType, socialId, email, alarmAllowed } = body;

        if (!nickname || !socialType || !socialId || !email || (alarmAllowed === undefined)) {
            return new Response(
                JSON.stringify({ message: 'invalid body' }),
                { status: 400 }
            )
        }

        // check session has same social Type and Id
        if (session.socialType !== socialType || session.socialId !== socialId) {
            return new Response(
                JSON.stringify({ message: 'Session not matched' }),
                { status: 400 }
            )
        }

        console.log(stringToSocialType(socialType))

        const result = await join({
            nickname: nickname,
            socialType: stringToSocialType(socialType),
            socialId: socialId,
            email: email,
            profileImageUrl: "/profile/default.png",
            alarmAllowed: alarmAllowed,
            role: 'USER'
        });

        // return 400 if join failed
        if (!result) {
            return new Response(
                JSON.stringify({ message: 'Join failed' }),
                { status: 400 }
            )
        }

        return new Response(
            JSON.stringify(result),
            { status: 201 }
        )
    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({ message: 'Internal server error' }),
            { status: 500 }
        )
    }
}

export { handler as POST }