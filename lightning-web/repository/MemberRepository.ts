import { PrismaClient, SocialType, Role } from '@prisma/client';
import { JoinForm } from './dto/JoinForm';

const client = new PrismaClient();


export async function findMemberById(id: string) {
  return await client.member.findUnique({
    where: {
      id: id,
    },
  });
}


export async function findMemberBySocial(socialType: 'LOCAL' | 'GOOGLE' | 'KAKAO' | 'APPLE', socialId: string) {
  try {
    return await client.member.findFirst({
      where: {
        socialType: socialType,
        socialId: socialId,
      },
    });
  } catch (error) {
    console.error('Error finding member by social:', error);
    return null;
  }
}


export async function join(joinForm: JoinForm) {
  try {
    return await client.member.create({
        data: {
            nickname: joinForm.nickname,
            socialType: SocialType[joinForm.socialType],
            socialId: joinForm.socialId,
            email: joinForm.email,
            profileImageUrl: joinForm.profileImageUrl,
            alarmAllowed: joinForm.alarmAllowed,
            role: Role[joinForm.role],
        },
    });
  } catch (error) {
    console.error('Error joining member:', error);
    return null;
  }
}

export async function findMemberByNickname(nickname: string) {
  return await client.member.findFirst({
    where: {
      nickname: nickname,
    },
  });
}


export async function updateLastLogin(memberId: string) {
  return await client.member.update({
    where: {
      id: memberId,
    },
    data: {
      lastLoginAt: new Date(),
    },
  });
}