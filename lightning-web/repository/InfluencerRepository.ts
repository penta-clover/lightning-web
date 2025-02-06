import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

export async function findInfluencerSettingByMemberId(memberId: string) {
  try {
    return await client.influencerSetting.findFirst({
      where: {
        memberId: memberId,
      },
    });
  } catch (error) {
    console.error('Error finding influencer setting:', error);
    return null;
  }
}