import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

export async function saveReferralLog(referrerId: string, inviteeId: string | null, event: string) {
    try {
        return await client.referralLog.create({
            data: {
                referrerId: referrerId,
                inviteeId: inviteeId,
                event: event
            }
        });
    } catch(error) {
        console.error('Error saving referer log:', error);
        return null;
    }
}

export async function findReferrerIdByCode(referralCode: string) {
    try {
        const referrer = await client.referralCode.findUnique({
            where: {
                referralCode: referralCode
            }
        });

        return referrer?.referrerId;
    } catch(error) {
        console.error('Error finding referrer id by code:', error);
        return null;
    }
}