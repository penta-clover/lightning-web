import { createRoom } from "@/repository/RoomRepository";

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    createRoom(name);

    return new Response(JSON.stringify({ message: "Chatroom created" }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}