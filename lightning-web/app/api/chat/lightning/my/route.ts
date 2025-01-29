import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { findLightningsBySender } from '@/repository/ChatRepository';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const memberId = session!.id;

        const lightnings = await findLightningsBySender(memberId!);;
        return new Response(JSON.stringify({ lightnings: lightnings }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });  
    }
}