-- CreateTable
CREATE TABLE "NotificationClick" (
    "id" TEXT NOT NULL,
    "memberId" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationClick_pkey" PRIMARY KEY ("id")
);
