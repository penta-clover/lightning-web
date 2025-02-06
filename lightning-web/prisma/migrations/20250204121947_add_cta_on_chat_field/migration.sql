/*
  Warnings:

  - Added the required column `ctaOnChat` to the `InfluencerSetting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InfluencerSetting" ADD COLUMN     "ctaOnChat" VARCHAR(150) NOT NULL;
