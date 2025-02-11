import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

export async function findAchievementByMemberIdAndName(memberId: string, achievementName: string) {
  try {
    return await client.achievementLog.findFirst({
      where: {
        memberId,
        achievement: {
          name: achievementName,
        },
      },
      include: {
        achievement: true, // 관련 업적 정보를 함께 가져옴
      },

    });
  } catch (error) {
    console.error('Error finding influencer setting:', error);
    return null;
  }
}

export async function addAchievementLog(memberId: string, achievementName: string) {
  try {
    const achievement = await client.achievement.findFirst({
      where: {
        name: achievementName,
      },
    });

    if (!achievement) {
      console.error('Achievement not found:', achievementName);
      return null;
    }

    return await client.achievementLog.create({
      data: {
        memberId,
        achievementId: achievement.id,
      },
    });
  } catch (error) {
    console.error('Error adding achievement log:', error);
    return null;
  }
}