import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { saveChatMessage } from '@/repository/ChatRepository';
import { findMemberById } from '@/repository/MemberRepository';

async function postHandler(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();

        const roomId = body.roomId;
        const content = body.content;
        const memberId = session!.id;

        if (!roomId || !content || !memberId) {
            return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
        }
        
        const member = await findMemberById(memberId);

        if (!member) {
            return new Response(JSON.stringify({ message: 'Member not found' }), { status: 400 });
        }

        const transparency = member.blockLevel === "TRANSPARENT" ? 85 : 0;
        
        await saveChatMessage(roomId, memberId, member.profileImageUrl, member.nickname, content, transparency, member.blockLevel);
        return new Response(JSON.stringify({ message: 'Message sent successfully' }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });  
    }
}

export { postHandler as POST };