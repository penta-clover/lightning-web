import { updateIsBlocked } from '@/repository/MemberRepository';

export async function POST(req: Request) {
  try {
    const { memberId, isBlind } = await req.json();

    if (!memberId) {
      return new Response(JSON.stringify({ message: 'invalid body' }), { status: 400 });
    }

    const result = await updateIsBlocked(memberId, isBlind);

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