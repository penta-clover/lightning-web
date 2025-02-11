-- AddForeignKey
ALTER TABLE "AchievementLog" ADD CONSTRAINT "AchievementLog_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
