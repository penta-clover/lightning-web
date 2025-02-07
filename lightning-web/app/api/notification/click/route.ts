import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth-options";
import { getCount, saveNotificationClick } from "@/repository/NotificationRepository";

export async function GET() {
    try {
        let count = await getCount();

        if (count === null) {
            return new Response(JSON.stringify({ message: "Server Error" }), { status: 500 });
        }
        
        return new Response(JSON.stringify({ message: "Success", content: { count: count } }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}


export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        const memberId = session!.id;

        if (!memberId) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const notification = await saveNotificationClick(memberId!);
        return new Response(JSON.stringify({ message: "notification added successfully" }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}