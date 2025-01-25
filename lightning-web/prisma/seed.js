import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 더미 사용자 데이터 생성
  await prisma.member.create({
    data: {
        nickname: '관리자',
        socialType: 'LOCAL',
        socialId: '1',
        email: 'chj7239@gmail.com',
        profileImageUrl: '/profile/default.png',
        alarmAllowed: true,
        role: 'DUMMY'
    }
  });

  console.log('Seed data added!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });