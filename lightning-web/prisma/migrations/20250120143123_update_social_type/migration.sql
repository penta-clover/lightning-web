/*
  Warnings:

  - The values [FACEBOOK,NAVER] on the enum `SocialType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SocialType_new" AS ENUM ('LOCAL', 'GOOGLE', 'KAKAO', 'APPLE');
ALTER TABLE "Member" ALTER COLUMN "socialType" TYPE "SocialType_new" USING ("socialType"::text::"SocialType_new");
ALTER TYPE "SocialType" RENAME TO "SocialType_old";
ALTER TYPE "SocialType_new" RENAME TO "SocialType";
DROP TYPE "SocialType_old";
COMMIT;
