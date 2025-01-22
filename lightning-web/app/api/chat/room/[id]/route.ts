import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { saveChatMessage } from '@/repository/ChatRepository';
import { findMemberById } from '@/repository/MemberRepository';

async function postHandler(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();

        const roomId = (await params).id;
        const content = body.content;
        const memberId = session!.memberId;

        if (!roomId || !content || !memberId) {
            return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
        }
        
        const member = await findMemberById(memberId);

        if (!member) {
            return new Response(JSON.stringify({ message: 'Member not found' }), { status: 404 });
        }
        
        await saveChatMessage(roomId as string, memberId, content, member.isBlocked ? 100 : 0);
        return new Response(JSON.stringify({ message: 'Message sent successfully' }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });  
    }
}

export { postHandler as POST };