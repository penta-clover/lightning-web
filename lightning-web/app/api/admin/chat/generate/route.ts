import { generateComments } from '@/external/openai/ChatGPT';

async function postHandler(req: Request) {
    try {
        const body = await req.json();

        const messages = body.messages;
        const count = body.count;

        if (!messages) {
            return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
        }
        
        const result = await generateComments(messages, count);

        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });  
    }
}

export { postHandler as POST };