import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { findLightningBySender } from '@/repository/ChatRepository';

async function postHandler() {
    try {
        const session = await getServerSession(authOptions);
        const memberId = session!.memberId;

        const lightnings = await findLightningBySender(memberId!);;
        return new Response(JSON.stringify({ lightnings: lightnings }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });  
    }
}

export { postHandler as POST };