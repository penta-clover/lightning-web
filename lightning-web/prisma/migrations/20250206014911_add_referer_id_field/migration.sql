/*
  Warnings:

  - You are about to drop the column `memberId` on the `RefererLog` table. All the data in the column will be lost.
  - Added the required column `refereeId` to the `RefererLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refererId` to the `RefererLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RefererLog" DROP COLUMN "memberId",
ADD COLUMN     "refereeId" VARCHAR(50) NOT NULL,
ADD COLUMN     "refererId" VARCHAR(50) NOT NULL;
