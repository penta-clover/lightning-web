-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AchievementLog" (
    "id" TEXT NOT NULL,
    "memberId" VARCHAR(50) NOT NULL,
    "achievementId" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AchievementLog_pkey" PRIMARY KEY ("id")
);
