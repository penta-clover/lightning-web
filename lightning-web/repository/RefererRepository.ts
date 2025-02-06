import { PrismaClient } from '@prisma/client';
import { db } from '../external/firebase/FirebaseApp';
import { findInfluencerSettingByMemberId } from './InfluencerRepository';
import { findMemberById } from './MemberRepository';

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

export async function notifyReferralJoin(referrerId: string, inviteeId: string) {
    try {
        const ref = db.collection(process.env.NEXT_PUBLIC_FIRESTORE_JOIN_NOTIFICATION_COLLECTION!);

        const [setting, referrer, invitee] = await Promise.all([
            findInfluencerSettingByMemberId(referrerId),
            findMemberById(referrerId),
            findMemberById(inviteeId)
        ]);

        if (!setting || !referrer || !invitee) {
            return null;
        }

        // 메시지 추가
        return await ref.add({
            referrer_id: referrerId,
            referrer_profile_image_url: referrer.profileImageUrl,
            channel_name: setting!.channelName,
            channel_url: setting!.channelUrl,
            invitee_id: inviteeId,
            invitee_nickname: invitee!.nickname,
            created_at: new Date()
        });
    } catch(error) {
        console.error('Error notifying referral join:', error);
        return null;
    }
}