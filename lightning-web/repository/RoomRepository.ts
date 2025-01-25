import { db } from '@/external/firebase/FirebaseApp';

export type MainRoomPolicy = {
    roomId: string;
    status: string;
}

export type Room = {
    id: string;
    name: string;
    createdAt: string;
}

export async function getMainRoomPolicy() {
    try {
        const mainRoomRef = db.collection('policy').doc('main_room');
        const mainRoomDoc = await mainRoomRef.get();
        const data = mainRoomDoc.data();

        if (!data?.exists) {
            return null;
        }

        const result = {
            roomId: data.room_id,
            status: data.status,
        } as MainRoomPolicy;

        return result;
    } catch(error) {
        console.error('Error getting main room:', error);
        return null;
    }
}

export async function findRoomById(roomId: string) {
    try {
        const roomRef = db.collection('chatrooms').doc(roomId);
        const roomDoc = await roomRef.get();
        const data = roomDoc.data();

        if (!data?.exists) {
            return null;
        }

        const result = {
            id: roomDoc.id,
            ...data
        } as Room;

        return result;
    } catch(error) {
        console.error('Error finding room:', error);
        return null;
    }
}

export async function changeMainRoomPolicy(roomId: string, status: string) {
    try {
        const mainRoomRef = db.collection('policy').doc('main_room');
        return await mainRoomRef.update({
            room_id: roomId,
            status: status,
        });
    } catch(error) {
        console.error('Error changing main room policy:', error);
        return null;
    }
}

export async function createRoom(name: string) {
    try {
        const roomsRef = db.collection('chatrooms');
        return await roomsRef.add({
            name: name,
            created_at: new Date(),
        });
    } catch(error) {
        console.error('Error creating room:', error);
        return null;
    }
}