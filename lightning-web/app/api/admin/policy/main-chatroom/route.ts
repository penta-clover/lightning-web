import { changeMainRoomPolicy } from "@/repository/RoomRepository";

export async function POST(req: Request) {
  try {
    const { roomId, status } = await req.json();

    if (!roomId || !status) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    changeMainRoomPolicy(roomId, status);
    return new Response(JSON.stringify({ message: "Main chatroom policy updated" }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}