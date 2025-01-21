/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Member" (
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

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);
