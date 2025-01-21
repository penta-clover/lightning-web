-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('RESERVED', 'OPENED', 'CLOSED');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "transparency" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "roomStatus" "RoomStatus" NOT NULL,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatMessage" (
    "id" TEXT NOT NULL,
    "roomId" VARCHAR(50) NOT NULL,
    "senderId" VARCHAR(50) NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lightned" (
    "id" TEXT NOT NULL,
    "messageId" VARCHAR(50) NOT NULL,
    "senderId" VARCHAR(50) NOT NULL,
    "lightnedBy" VARCHAR(50) NOT NULL,
    "lightnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lightned_pkey" PRIMARY KEY ("id")
);
