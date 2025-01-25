import { updateRole } from '@/repository/MemberRepository';

export async function POST(req: Request) {
  try {
    const { memberId, role } = await req.json();

    if (!memberId || !role) {
      return new Response(JSON.stringify({ message: 'invalid body' }), { status: 400 });
    }

    const result = await updateRole(memberId, role);

    if (!result) {
        return new Response(JSON.stringify({ message: 'update failed' }), { status: 400 });
    }

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}