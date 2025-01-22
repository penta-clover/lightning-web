// import { PrismaClient } from '@prisma/client';
import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { AdminConfig } from "@/config/AdminConfig";

const app = initializeApp({
    credential: cert(AdminConfig as ServiceAccount)
});
const db = getFirestore(app);
// const client = new PrismaClient();

export async function saveChatMessage(roomId: string, senderId: string, content: string, transparency: number) {
    try {
        const roomRef = db.collection('chatrooms').doc(roomId);
        
        // 'chats' 서브컬렉션 참조
        const chatsRef = roomRef.collection('chats');

        // 메시지 추가
        await chatsRef.add({
            sender_id: senderId,
            content: content,
            created_at: new Date(),
            transparency: transparency,
        });
    } catch(error) {
        console.error('Error saving chat message:', error);
        return null;
    }
}