/*
  Warnings:

  - The values [INFLUENCER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'USER', 'DUMMY', 'DISABLED_DUMMY');
ALTER TABLE "Member" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- CreateTable
CREATE TABLE "InfluencerSetting" (
    "id" TEXT NOT NULL,
    "memberId" VARCHAR(50) NOT NULL,
    "channelName" VARCHAR(150) NOT NULL,
    "channelUrl" VARCHAR(200) NOT NULL,
    "introductionOnChat" VARCHAR(150) NOT NULL,

    CONSTRAINT "InfluencerSetting_pkey" PRIMARY KEY ("id")
);
