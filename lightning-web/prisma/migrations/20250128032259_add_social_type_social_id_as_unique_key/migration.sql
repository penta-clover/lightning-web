/*
  Warnings:

  - A unique constraint covering the columns `[socialType,socialId]` on the table `Member` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Member_socialType_socialId_key" ON "Member"("socialType", "socialId");
