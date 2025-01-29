/*
  Warnings:

  - You are about to drop the column `isBlocked` on the `Member` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BlockLevel" AS ENUM ('DISABLED', 'INVISIBLE', 'BLOCKED', 'TRANSPARENT', 'NONE');

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "isBlocked",
ADD COLUMN     "blockLevel" "BlockLevel" NOT NULL DEFAULT 'NONE';
