import { updateBlockType } from '@/repository/ChatRepository';

export async function POST(req: Request) {
  try {
    const { chatId, blockType } = await req.json();

    if (!chatId || !blockType) {
      return new Response(JSON.stringify({ message: 'invalid body' }), { status: 400 });
    }

    const result = await updateBlockType(chatId, blockType);

    if (!result) {
        return new Response(JSON.stringify({ message: 'Blind failed' }), { status: 400 });
    }

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}