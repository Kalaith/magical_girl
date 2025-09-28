import { create } from "zustand";
import type { Player, Notification, Resources } from "../types/game";
import type { MagicalGirl } from "../types/magicalGirl";
import type { Mission } from "../types/missions";
import { initialMagicalGirls } from "../data/magicalGirls";
import { initialMissions } from "../data/missions";

const initialState = {
  notifications: [] as Notification[],
  resources: {
    magicalEnergy: 100,
    maxMagicalEnergy: 100,
    sparkles: 0,
    stardust: 0,
    moonbeams: 0,
    crystals: 0,
    experience: 0,
    level: 1,
    gold: 0,
    magicalCrystals: 0,
    friendshipPoints: 0,
    premiumGems: 0,
    eventTokens: 0,
    summonTickets: 0,
    rareTickets: 0,
    legendaryTickets: 0,
    dreamshards: 0,
  } as Resources,
  magicalGirls: [] as MagicalGirl[],
  gameProgress: { level: 1, experience: 0 },
  trainingData: { sessions: [] },
  settings: { soundEnabled: true, musicEnabled: true, masterVolume: 0.5 },
  transformationData: { unlocked: [] },
  formationData: { activeFormation: [] },
  prestigeData: { level: 0, points: 0 },
  saveSystemData: { lastSave: Date.now() },
  tutorialData: { completed: false, step: 0 },
  player: {
    id: "player-1",
    name: "Player",
    resources: {
      magicalEnergy: 100,
      maxMagicalEnergy: 100,
      sparkles: 0,
      stardust: 0,
      moonbeams: 0,
      crystals: 0,
      experience: 0,
      level: 1,
      gold: 0,
      magicalCrystals: 0,
      friendshipPoints: 0,
      premiumGems: 0,
      eventTokens: 0,
      summonTickets: 0,
      rareTickets: 0,
      legendaryTickets: 0,
      dreamshards: 0,
    } as Resources,
    unlockedFeatures: {
      training: true,
      missions: false,
      advancedTraining: false,
      teamMissions: false,
      transformation: false,
      specialPowers: false,
      craftingWorkshop: false,
      magicalGarden: false,
    },
    achievements: [],
    statistics: {
      totalPlayTime: 0,
      missionsCompleted: 0,
      trainingSessionsCompleted: 0,
      totalMagicalEnergySpent: 0,
      totalSparklesEarned: 0,
      transformationsPerformed: 0,
      criticalSuccesses: 0,
      perfectMissions: 0,
    },
    preferences: {
      autoSave: true,
      soundEnabled: true,
      animationsEnabled: true,
      notificationsEnabled: true,
      theme: "light" as const,
      language: "en",
    },
  } as Player,
  missions: initialMissions as Mission[],
  activeMission: null as Mission | null,
  activeSessions: [] as Array<{
    id: string;
    name: string;
    description: string;
    type: string;
    category: string;
    difficulty: string;
    duration: number;
    cost: { magicalEnergy: number; time: number };
    requirements: never[];
    effects: never[];
    rewards: never[];
    unlockConditions: never[];
    isUnlocked: boolean;
    isCompleted: boolean;
    completionCount: number;
    tags: never[];
    girlId: string;
    startTime: number;
    endTime: number;
    trainingName: string;
    girlName: string;
  }>,
};

export const useGameStore = create<typeof initialState & {
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  addResources: (resources: Partial<Resources>) => void;
  spendResources: (resources: Partial<Resources>) => boolean;
  levelUpMagicalGirl: (id: string) => boolean;
  updateSettings: (newSettings: Partial<typeof initialState.settings>) => void;
  setMasterVolume: (volume: number) => void;
  resetSettings: () => void;
  startTraining: (girlId: string, type: string) => boolean;
  completeActiveSession: (sessionId: string) => void;
  updateActiveSessions: () => void;
  recruitMagicalGirl: () => Promise<boolean>;
  startMission: (missionId: string, teamIds: string[]) => boolean;
  completeMission: (missionId: string, success: boolean, score?: number) => void;
  resetGame: () => void;
  updateGameTime?: () => void;
}>((set, get) => ({
  ...initialState,

  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36),
      timestamp: Date.now(),
      read: false,
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 50),
    }));
  },

  markNotificationRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  addResources: (resources: Partial<Resources>) => {
    set((state) => ({
      resources: {
        ...state.resources,
        ...Object.fromEntries(
          Object.entries(resources).map(([key, value]) => [
            key,
            (state.resources[key as keyof Resources] || 0) + (value || 0),
          ])
        ),
      } as Resources,
    }));
  },

  spendResources: (resources: Partial<Resources>) => {
    const state = get();
    const canAfford = Object.entries(resources).every(
      ([key, cost]) => (state.resources[key as keyof Resources] || 0) >= (cost || 0)
    );

    if (canAfford) {
      set((state) => ({
        resources: {
          ...state.resources,
          ...Object.fromEntries(
            Object.entries(resources).map(([key, cost]) => [
              key,
              Math.max(0, (state.resources[key as keyof Resources] || 0) - (cost || 0)),
            ])
          ),
        } as Resources,
      }));
      return true;
    }
    return false;
  },

  levelUpMagicalGirl: (id: string) => {
    const girl = get().magicalGirls.find(g => g.id === id);
    if (!girl) return false;

    set((state) => ({
      magicalGirls: state.magicalGirls.map((girl) =>
        girl.id === id ? { ...girl, level: girl.level + 1 } : girl
      ),
    }));
    return true;
  },

  updateSettings: (newSettings: Partial<typeof initialState.settings>) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },

  setMasterVolume: (volume: number) => {
    set((state) => ({
      settings: { ...state.settings, masterVolume: volume },
    }));
  },

  resetSettings: () => {
    set(() => ({
      settings: { soundEnabled: true, musicEnabled: true, masterVolume: 0.5 },
    }));
  },

  startTraining: (girlId: string, type: string) => {
    const girl = get().magicalGirls.find((g: MagicalGirl) => g.id === girlId);
    if (!girl) return false;

    const startTime = Date.now();
    const duration = 3600000;
    const newSession = {
      id: Math.random().toString(36),
      name: type + " Training",
      description: `Training session for ${type}`,
      type: type,
      category: "Stat_Boost",
      difficulty: "Beginner",
      duration: 3600,
      cost: { magicalEnergy: 10, time: 60 },
      requirements: [],
      effects: [],
      rewards: [],
      unlockConditions: [],
      isUnlocked: true,
      isCompleted: false,
      completionCount: 0,
      tags: [],
      girlId,
      startTime,
      endTime: startTime + duration,
      trainingName: type + " Training",
      girlName: girl.name,
    };
    set((state) => ({
      activeSessions: [...state.activeSessions, newSession],
    }));
    return true;
  },

  completeActiveSession: (sessionId: string) => {
    set((state) => ({
      activeSessions: state.activeSessions.filter(
        (session) => session.id !== sessionId
      ),
    }));
  },

  updateActiveSessions: () => {
    // Update active sessions logic
  },

  recruitMagicalGirl: async () => {
    const state = get();
    
    // Check if player has enough friendship points
    if (state.resources.friendshipPoints < 100) {
      return false;
    }

    // Get available girls (not already recruited)
    const availableGirls = initialMagicalGirls.filter(
      (girl: MagicalGirl) => !state.magicalGirls.some((owned) => owned.id === girl.id)
    );

    if (availableGirls.length === 0) {
      return false;
    }

    // Randomly select a girl
    const randomGirl = availableGirls[Math.floor(Math.random() * availableGirls.length)];

    // Spend resources and add girl
    state.spendResources({ friendshipPoints: 100 });
    
    set((currentState) => ({
      magicalGirls: [...currentState.magicalGirls, { ...randomGirl }],
    }));

    return true;
  },

  startMission: (missionId: string, _teamIds: string[]) => {
    const state = get();
    const mission = state.missions.find(m => m.id === missionId);
    
    if (!mission || !mission.isUnlocked || !mission.isAvailable || state.activeMission) {
      return false;
    }

    // Check if player has enough magical energy
    if (state.resources.magicalEnergy < 30) {
      return false;
    }

    // Spend magical energy
    state.spendResources({ magicalEnergy: 30 });

    // Set mission as active
    set({ activeMission: { ...mission, attempts: mission.attempts + 1 } });

    return true;
  },

  completeMission: (missionId: string, success: boolean, _score?: number) => {
    const state = get();
    const mission = state.missions.find(m => m.id === missionId);
    
    if (!mission || !state.activeMission || state.activeMission.id !== missionId) {
      return;
    }

    if (success) {
      // Award rewards
      const rewards = { experience: 0, sparkles: 0, stardust: 0 };
      mission.rewards.forEach(reward => {
        if (reward.type === 'experience') rewards.experience += reward.quantity;
        if (reward.type === 'sparkles') rewards.sparkles += reward.quantity;
        if (reward.type === 'stardust') rewards.stardust += reward.quantity;
      });

      state.addResources(rewards);

      // Mark mission as completed
      set((currentState) => ({
        missions: currentState.missions.map(m => 
          m.id === missionId ? { ...m, isCompleted: true, completedAt: Date.now() } : m
        ),
        activeMission: null,
        player: {
          ...currentState.player,
          statistics: {
            ...currentState.player.statistics,
            missionsCompleted: currentState.player.statistics.missionsCompleted + 1,
          },
        },
      }));
    } else {
      // Handle failure penalties
      set({ activeMission: null });
    }
  },

  resetGame: () => {
    set({ ...initialState, resetGame: get().resetGame });
    setTimeout(() => {
      get().addNotification({
        type: "info",
        title: "Game Reset",
        message: "Started a new game!",
      });
    }, 100);
  },

  updateGameTime: () => {
    // Game time updates handled here
  },
}));

setInterval(() => {
  const state = useGameStore.getState();
  if (state.updateGameTime) {
    state.updateGameTime();
  }
}, 1000);