// Achievement business logic hook - Separation of Concerns principle
import { useMemo } from "react";
import { useAchievementStore } from "../stores/achievementStore";
import type { Achievement } from "../types/achievements";

export const useAchievements = () => {
  const {
    achievements,
    unlockedCount,
    totalPoints,
    unlockAchievement,
    updateProgress,
    checkAllAchievements,
    getAchievementById: storeGetAchievementById,
    getUnlockedAchievements,
  } = useAchievementStore();

  // Get achievements by status
  const achievementsByStatus = useMemo(() => {
    const unlocked = achievements.filter((a: Achievement) => a.unlocked);
    const inProgress = achievements.filter(
      (a: Achievement) => !a.unlocked && a.progress > 0,
    );
    const locked = achievements.filter(
      (a: Achievement) => !a.unlocked && a.progress === 0,
    );

    return { unlocked, inProgress, locked };
  }, [achievements]);

  // Get achievement by ID
  const getAchievementById = (id: string) => {
    return storeGetAchievementById(id);
  };

  // Get next achievement to unlock (highest progress)
  const getNextAchievement = () => {
    const inProgress = achievements
      .filter((a: Achievement) => !a.unlocked && a.progress > 0)
      .sort((a: Achievement, b: Achievement) => b.progress / b.maxProgress - a.progress / a.maxProgress);

    return inProgress[0] || null;
  };

  // Get recent achievements (last 5 unlocked)
  const getRecentAchievements = () => {
    return getUnlockedAchievements().slice(-5);
  };

  // Achievement progress formatting
  const formatProgress = (progress: number, maxProgress: number) => {
    if (maxProgress <= 1) {
      return progress >= maxProgress ? "Complete" : "Incomplete";
    }
    return `${progress}/${maxProgress}`;
  };

  const getProgressPercentage = (progress: number, maxProgress: number) => {
    return Math.min((progress / maxProgress) * 100, 100);
  };

  return {
    // Data
    achievements,
    unlockedCount,
    totalPoints,
    achievementsByStatus,

    // Actions
    unlockAchievement,
    updateProgress,
    checkAllAchievements,

    // Utilities
    getAchievementById,
    getNextAchievement,
    getRecentAchievements,
    formatProgress,
    getProgressPercentage,
  };
};
