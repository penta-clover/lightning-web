import { PrismaClient, SocialType, Role, BlockLevel } from '@prisma/client';
import { JoinForm } from './dto/JoinForm';
import { create } from 'domain';

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
    console.log(error);
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

export async function findMembersByRoles(...roles: Role[]) {
  return await client.member.findMany({
    where: {
      OR: roles.map((role) => ({role: role}))
    },
    take: 200,
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function updateRole(memberId: string, role: Role) {
  return await client.member.update({
    where: {
      id: memberId,
    },
    data: {
      role: role,
    },
  });
}

export async function updateBlockLevel(memberId: string, blockLevel: BlockLevel) {
  return await client.member.update({
    where: {
      id: memberId,
    },
    data: {
      blockLevel: blockLevel,
    },
  });
}