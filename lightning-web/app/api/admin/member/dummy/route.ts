import { findMembersByRoles, updateMember } from "@/repository/MemberRepository";
import { Role } from "@prisma/client";

// GET endpoint for query members by its fields
export async function GET() {
  try {
    const result = await findMembersByRoles("DUMMY" as Role, "DISABLED_DUMMY" as Role);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function PUT(req: Request) {
  try {
    const { memberId, data } = await req.json();

    if (!memberId || !data) {
      return new Response(JSON.stringify({ message: 'invalid body' }), { status: 400 });
    }

    const result = await updateMember(memberId, data);

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