import { findMembersByRoles } from "@/repository/MemberRepository";
import { Role } from "@prisma/client";

// GET endpoint for query members by its fields
export async function GET() {
  try {
    const result = await findMembersByRoles("DUMMY" as Role);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
