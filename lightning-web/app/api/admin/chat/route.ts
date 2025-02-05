import { saveChatMessage } from '@/repository/ChatRepository';
import { findMemberById } from '@/repository/MemberRepository';

async function postHandler(req: Request) {
    try {
        const body = await req.json();

        const roomId = body.roomId;
        const content = body.content;
        const memberId = body.memberId;

        if (!roomId || !content || !memberId) {
            return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
        }
        
        const member = await findMemberById(memberId);

        if (!member) {
            return new Response(JSON.stringify({ message: 'Member not found' }), { status: 404 });
        }
        
        await saveChatMessage(roomId, memberId, member.profileImageUrl, member.nickname, content, 0, "NONE", "NORMAL", {});
        return new Response(JSON.stringify({ message: 'Message sent successfully' }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });  
    }
}

export { postHandler as POST };