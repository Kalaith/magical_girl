import { create } from "zustand";
import type { Achievement } from "../types/achievements";
import { initialAchievements, achievementRarities } from "../data/achievements";

interface AchievementStore {
  achievements: Achievement[];
  unlockedCount: number;
  totalPoints: number;

  // Actions
  unlockAchievement: (id: string) => void;
  updateProgress: (id: string, progress: number) => void;
  checkAllAchievements: () => void;
  getAchievementById: (id: string) => Achievement | undefined;
  getUnlockedAchievements: () => Achievement[];
  getProgressAchievements: () => Achievement[];
}

export const useAchievementStore = create<AchievementStore>((set, get) => ({
  achievements: initialAchievements,
  unlockedCount: 0,
  totalPoints: 0,

  unlockAchievement: (id: string) => {
    set((state) => ({
      achievements: state.achievements.map(achievement =>
        achievement.id === id
          ? { ...achievement, unlocked: true, progress: achievement.maxProgress, unlockedAt: Date.now() }
          : achievement
      )
    }));

    // Update counts
    const state = get();
    const unlockedCount = state.achievements.filter(a => a.unlocked).length;
    const totalPoints = state.achievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => {
        const rarityConfig = achievementRarities[a.rarity as keyof typeof achievementRarities];
        return sum + (rarityConfig?.points || 10);
      }, 0);

    set({ unlockedCount, totalPoints });
  },

  updateProgress: (id: string, progress: number) => {
    set((state) => ({
      achievements: state.achievements.map(achievement =>
        achievement.id === id
          ? { ...achievement, progress: Math.min(progress, achievement.maxProgress) }
          : achievement
      )
    }));
  },

  checkAllAchievements: () => {
    // This will be called to check against game state
    // For now, just update counts
    const state = get();
    const unlockedCount = state.achievements.filter(a => a.unlocked).length;
    const totalPoints = state.achievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => {
        const rarityConfig = achievementRarities[a.rarity as keyof typeof achievementRarities];
        return sum + (rarityConfig?.points || 10);
      }, 0);

    set({ unlockedCount, totalPoints });
  },

  getAchievementById: (id: string) => {
    return get().achievements.find(a => a.id === id);
  },

  getUnlockedAchievements: () => {
    return get().achievements.filter(a => a.unlocked);
  },

  getProgressAchievements: () => {
    return get().achievements.filter(a => !a.unlocked && a.progress > 0);
  }
}));