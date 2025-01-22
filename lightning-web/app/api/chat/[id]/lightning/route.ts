import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { saveLightning, findChatMessageById } from '@/repository/ChatRepository';

async function postHandler(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);

        const chatId = (await params).id;
        const memberId = session!.memberId;

        if (!chatId || !memberId) {
            return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
        }

        const chatMessage = await findChatMessageById(chatId);
        const authorId = chatMessage?.sender_id;
        
        if (!chatMessage || !authorId) {
            return new Response(JSON.stringify({ message: 'Invalid chat message' }), { status: 400 });
        }
        
        await saveLightning(memberId, authorId, chatId);
        return new Response(JSON.stringify({ message: 'Lightning sent successfully' }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });  
    }
}

export { postHandler as POST };