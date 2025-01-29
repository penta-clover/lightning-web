import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

export async function saveNotificationClick(memberId: string) {
    try {
        return await client.notificationClick.create({
            data: {
                memberId: memberId,
            }
        });
    } catch(error) {
        console.error('Error saving notification:', error);
        return null;
    }
}

export async function getCount() {
    try {
        return await client.notificationClick.count();
    } catch(error) {
        console.error('Error getting notification count:', error);
        return null;
    }
}