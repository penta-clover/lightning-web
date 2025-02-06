/*
  Warnings:

  - You are about to drop the `RefererCode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RefererLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "RefererCode";

-- DropTable
DROP TABLE "RefererLog";

-- CreateTable
CREATE TABLE "ReferralLog" (
    "id" TEXT NOT NULL,
    "referrerId" VARCHAR(50) NOT NULL,
    "inviteeId" VARCHAR(50),
    "event" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralCode" (
    "id" TEXT NOT NULL,
    "referrerId" VARCHAR(50) NOT NULL,
    "referralCode" VARCHAR(50) NOT NULL,

    CONSTRAINT "ReferralCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReferralCode_referralCode_key" ON "ReferralCode"("referralCode");
