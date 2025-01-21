import { NextRequest } from "next/server";

import { findMemberByNickname } from "@/repository/MemberRepository";


export async function GET(request: NextRequest) {
    const pathParams = request.nextUrl.pathname.split('/');
    const nickname = pathParams[pathParams.length - 1];

    if (!nickname) {
        return new Response('nickname is required', { status: 400 });
    }

    const member = await findMemberByNickname(nickname);

    if (member) {
        return new Response(JSON.stringify(member), { status: 200 });
    } else {
        return new Response('not found', { status: 404 });
    }
}