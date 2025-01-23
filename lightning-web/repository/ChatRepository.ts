import { PrismaClient } from '@prisma/client';
import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { AdminConfig } from "@/config/AdminConfig";

const app = initializeApp({
    credential: cert(AdminConfig as ServiceAccount)
});
const db = getFirestore(app);
const client = new PrismaClient();

export async function saveChatMessage(roomId: string, senderId: string, profileImageUrl: string, senderNickname: string, content: string, transparency: number) {
    try {
        // 'chats' 서브컬렉션 참조
        const chatsRef = db.collection('chatmessages');

        // 메시지 추가
        await chatsRef.add({
            sender_id: senderId,
            sender_nickname: senderNickname,
            profile_image_url: profileImageUrl,
            room_id: roomId,
            content: content,
            created_at: new Date(),
            transparency: transparency,
        });
    } catch(error) {
        console.error('Error saving chat message:', error);
        return null;
    }
}

export async function findChatMessageById(chatMessageId: string) {
    try {
        const chatsRef = db.collection('chatmessages');
        const chatDoc = await chatsRef.doc(chatMessageId).get();
        return chatDoc.data();
    } catch(error) {
        console.error('Error finding chat message:', error);
        return null;
    }
}

export async function saveLightning(senderId: string, receiverId: string, chatMessageId: string) {
    try {
        await client.lightning.create({
            data: {
                senderId: senderId,
                receiverId: receiverId,
                messageId: chatMessageId
            }
        });
    } catch(error) {
        console.error('Error saving lightning:', error);
        return null;
    }
}

export async function findLightningBySender(senderId: string) {
    try {
        return await client.lightning.findMany({
            where: {
                senderId: senderId
            }
        });
    } catch(error) {
        console.error('Error finding lightning:', error);
        return null;
    }
}