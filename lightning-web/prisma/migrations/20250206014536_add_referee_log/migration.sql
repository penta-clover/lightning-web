-- CreateTable
CREATE TABLE "RefererLog" (
    "id" TEXT NOT NULL,
    "memberId" VARCHAR(50) NOT NULL,
    "event" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefererLog_pkey" PRIMARY KEY ("id")
);
