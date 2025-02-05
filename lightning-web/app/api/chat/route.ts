import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { saveChatMessage } from '@/repository/ChatRepository';
import { findMemberById } from '@/repository/MemberRepository';
import { findInfluencerSettingByMemberId } from '@/repository/InfluencerRepository';

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
        let chatType = "NORMAL";
        let optional = {};

        if (member.role === "INFLUENCER") {
            chatType = "INFLUENCER";

            const setting = await findInfluencerSettingByMemberId(memberId);

            if (!setting) {
                return new Response(JSON.stringify({ message: 'Influencer setting not found' }), { status: 400 });
            }

            optional = {
                channel_name: setting.channelName,
                channel_url: setting.channelUrl,
                introduction_on_chat: setting.introductionOnChat,
                cta_on_chat: setting.ctaOnChat
            }
        }
        
        await saveChatMessage(roomId, memberId, member.profileImageUrl, member.nickname, content, transparency, member.blockLevel, chatType, optional);
        return new Response(JSON.stringify({ message: 'Message sent successfully' }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });  
    }
}

export { postHandler as POST }; 