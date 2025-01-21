-- CreateEnum
CREATE TYPE "SocialType" AS ENUM ('FACEBOOK', 'GOOGLE', 'KAKAO', 'NAVER');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'BLOCK_USER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nickname" VARCHAR(50) NOT NULL,
    "socialType" "SocialType" NOT NULL,
    "socialId" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "profileImageUrl" VARCHAR(200) NOT NULL DEFAULT 'profile/default.png',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alarmAllowed" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
