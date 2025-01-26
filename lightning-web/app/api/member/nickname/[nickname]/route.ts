import { NextRequest } from "next/server";

import { findMemberByNickname } from "@/repository/MemberRepository";


export async function GET(request: NextRequest, { params } : { params: Promise<{nickname:string}> }) {
    const { nickname } = await params;

    if (!nickname) {
        return new Response('nickname is required', { status: 400 });
    }

    const member = await findMemberByNickname(nickname);

    if (member) {
        return new Response(JSON.stringify({ "isFound": true }), { status: 200 });
    } else {
        return new Response(JSON.stringify({ "isFound": false }), { status: 404 });
    }
}