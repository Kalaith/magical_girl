import { create } from "zustand";
import type { Player, Notification, Resources, SaveData } from "../types/game";
import type { MagicalGirl } from "../types/magicalGirl";
import type { Mission } from "../types/missions";
import type { RecruitmentSystem, SummonResult, SummonRecord } from "../types/recruitment";
import type { CombatSystem, CombatBattle, CombatParticipant, CombatAction, CombatLogEntry, BattleEndReason } from "../types/combat";

import { GAME_CONFIG } from "../config/gameConfig";
import { initialMagicalGirls } from "../data/magicalGirls";
import { initialMissions } from "../data/missions";
import { useAchievementStore } from "./achievementStore";

const PERSISTENCE_VERSION = "1.0.0";

const createInitialResources = (): Resources => ({
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
  friendshipPoints: 100,
  premiumGems: 0,
  eventTokens: 0,
  summonTickets: 0,
  rareTickets: 0,
  legendaryTickets: 0,
  dreamshards: 0,
});

const syncPlayerResources = (player: Player, resources: Resources): Player => ({
  ...player,
  resources: { ...resources },
});

const isBrowser = typeof window !== "undefined";

let autoSaveTimer: number | null = null;
let gameTickTimer: number | null = null;
let persistenceInitialized = false;
let persistenceSubscribers = 0;

const clearPersistenceTimers = () => {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer);
    autoSaveTimer = null;
  }
  if (gameTickTimer) {
    clearInterval(gameTickTimer);
    gameTickTimer = null;
  }
};

const initialState = {
  notifications: [] as Notification[],
  resources: createInitialResources(),
  magicalGirls: [] as MagicalGirl[],
  gameProgress: { level: 1, experience: 0 },
  trainingData: { sessions: [] as unknown[] },
  settings: { soundEnabled: true, musicEnabled: true, masterVolume: 0.5 },
  transformationData: { unlocked: [] as unknown[] },
  formationData: { activeFormation: [] as unknown[] },
  prestigeData: { level: 0, points: 0 },
  saveSystemData: { lastSave: Date.now() },
  tutorialData: { completed: false, step: 0 },
  recruitmentSystem: {
    currencies: {
      friendshipPoints: 100,
      premiumGems: 0,
      eventTokens: 0,
      summonTickets: 0,
      rareTickets: 0,
      legendaryTickets: 0,
      dreamshards: 0,
    },
    banners: [],
    activeBanners: [],
    pityCounters: {},
    summonHistory: [],
    guaranteedCounter: {},
  } as RecruitmentSystem,
  combatSystem: {
    battles: [],
    activeBattle: null,
    formations: [
      {
        id: "default",
        name: "Standard Formation",
        description: "Basic 3x3 formation with balanced positioning",
        positions: [
          { row: 1, column: 1, role: "Tank", modifiers: [], restrictions: [] },
          { row: 1, column: 2, role: "Damage", modifiers: [], restrictions: [] },
          { row: 1, column: 3, role: "Support", modifiers: [], restrictions: [] },
          { row: 2, column: 1, role: "Damage", modifiers: [], restrictions: [] },
          { row: 2, column: 2, role: "Flexible", modifiers: [], restrictions: [] },
          { row: 2, column: 3, role: "Healer", modifiers: [], restrictions: [] },
          { row: 3, column: 1, role: "Support", modifiers: [], restrictions: [] },
          { row: 3, column: 2, role: "Buffer", modifiers: [], restrictions: [] },
          { row: 3, column: 3, role: "Debuffer", modifiers: [], restrictions: [] },
        ],
        bonuses: [],
        requirements: [],
        isDefault: true,
        isUnlocked: true,
        category: "Balanced",
      },
    ],
    activeFormation: "default",
    combatHistory: [],
    combatSettings: {
      autoMode: false,
      animationSpeed: 1.0,
      skipAnimations: false,
      pauseOnPlayerTurn: true,
      showDamageNumbers: true,
      showStatusEffects: true,
      combatLog: true,
      tutorialMode: false,
      difficulty: "Normal",
      aiDelay: 1000,
      confirmActions: true,
      quickCombat: false,
    },
  } as CombatSystem,
  player: {
    id: "player-1",
    name: "Player",
    resources: createInitialResources(),
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
      totalScore: 0,
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
  activeMission: null as { mission: Mission; teamIds: string[] } | null,
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
  performGachaSummon: (bannerId: string, pullCount: number) => Promise<SummonResult[]>;
  startMission: (missionId: string, teamIds: string[]) => boolean;
  completeMission: (missionId: string, success: boolean, score?: number) => void;
  resetGame: () => void;
  updateGameTime?: () => void;
  saveGame: () => void;
  loadGame: () => boolean;
  updateMissions: () => void;
  serializeGameState: () => SaveData;
  importGameState: (gameState: SaveData["gameState"], timestamp?: number) => void;
  initializePersistence: () => () => void;
  // Combat methods
  startCombatBattle: (battle: Omit<CombatBattle, "id" | "status" | "startTime" | "combatLog">) => void;
  executeCombatAction: (participantId: string, action: CombatAction, targets?: CombatParticipant[]) => void;
  endCombatBattle: (battleId: string, winner: "player" | "enemy" | "draw", reason: BattleEndReason) => void;

  // Helper methods
  initializeCombatTurnOrder: (battleId: string) => void;
  nextCombatTurn: () => void;
  processCombatActionEffects: (participantId: string, action: CombatAction, targets?: CombatParticipant[]) => void;
  updateCombatParticipant: (battleId: string, participantId: string, updates: Partial<CombatParticipant>) => void;
  addCombatLogEntry: (battleId: string, entryData: Omit<CombatLogEntry, "id" | "timestamp">) => void;
  createCombatRecord: (battle: CombatBattle) => void;
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
    set((state) => {
      const updatedResources: Resources = { ...state.resources };

      Object.entries(resources).forEach(([key, value]) => {
        if (typeof value === "number" && Number.isFinite(value)) {
          const resourceKey = key as keyof Resources;
          const currentValue = updatedResources[resourceKey] ?? 0;
          updatedResources[resourceKey] = currentValue + value;
        }
      });

      return {
        resources: updatedResources,
        player: syncPlayerResources(state.player, updatedResources),
      };
    });
  },

  spendResources: (resources: Partial<Resources>) => {
    const state = get();
    const canAfford = Object.entries(resources).every(([key, cost]) => {
      if (typeof cost !== "number" || !Number.isFinite(cost)) {
        return true;
      }
      const resourceKey = key as keyof Resources;
      const currentValue = state.resources[resourceKey] ?? 0;
      return currentValue >= cost;
    });

    if (!canAfford) {
      return false;
    }

    set((currentState) => {
      const updatedResources: Resources = { ...currentState.resources };

      Object.entries(resources).forEach(([key, cost]) => {
        if (typeof cost === "number" && Number.isFinite(cost)) {
          const resourceKey = key as keyof Resources;
          const currentValue = updatedResources[resourceKey] ?? 0;
          updatedResources[resourceKey] = Math.max(0, currentValue - cost);
        }
      });

      return {
        resources: updatedResources,
        player: syncPlayerResources(currentState.player, updatedResources),
      };
    });

    return true;
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

    // Save game after starting training
    get().saveGame();

    return true;
  },

  completeActiveSession: (sessionId: string) => {
    set((state) => ({
      activeSessions: state.activeSessions.filter(
        (session) => session.id !== sessionId
      ),
    }));

    // Save game after training completion
    get().saveGame();
  },

  updateActiveSessions: () => {
    // Update active sessions logic
  },

  recruitMagicalGirl: async () => {
    const state = get();
    
    // Check if player has enough friendship points
    if (state.resources.friendshipPoints < GAME_CONFIG.RECRUITMENT.BASIC_COST) {
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
    state.spendResources({ friendshipPoints: GAME_CONFIG.RECRUITMENT.BASIC_COST });
    
    set((currentState) => ({
      magicalGirls: [...currentState.magicalGirls, { ...randomGirl, isUnlocked: true, unlockedAt: Date.now() }],
    }));

    // Trigger achievement checks
    const achievementStore = useAchievementStore.getState();
    achievementStore.updateProgress("summon_first_girl", 1);
    achievementStore.updateProgress("first_girl", 1);
    achievementStore.checkAllAchievements();

    // Save game after recruitment
    get().saveGame();

    return true;
  },

  performGachaSummon: async (bannerId: string, pullCount: number): Promise<SummonResult[]> => {
    const state = get();
    const banner = state.recruitmentSystem.banners.find(b => b.id === bannerId);
    
    if (!banner || !banner.isActive) {
      throw new Error("Banner not found or not active");
    }

    // Check costs
    const cost = pullCount === 1 ? banner.costs.single : banner.costs.ten;
    const totalCost = {
      [cost.primary.currency]: cost.primary.amount * (pullCount === 10 ? GAME_CONFIG.RECRUITMENT.MULTI_PULL_DISCOUNT : 1)
    };

    if (!state.spendResources(totalCost)) {
      throw new Error("Insufficient currency");
    }

    const results: SummonResult[] = [];
    const ownedGirlIds = state.magicalGirls.map(g => g.id);

    for (let i = 0; i < pullCount; i++) {
      // Apply pity system
      const pityCounter = state.recruitmentSystem.pityCounters[bannerId]?.current || 0;
      const pityConfig = banner.pitySystem;
      const rates = { ...banner.rates };

      if (pityConfig.enabled && pityConfig.softPity && pityCounter >= pityConfig.softPity.startAt) {
        // Apply soft pity multiplier
        const pityMultiplier = pityConfig.softPity.rateIncrease || 1;
        rates[pityConfig.targetRarity] = Math.min(
          rates[pityConfig.targetRarity] * pityMultiplier,
          pityConfig.softPity.maxIncrease || rates[pityConfig.targetRarity] * 2
        );
      }

      // Perform weighted random selection
      const random = Math.random() * 100;
      let cumulative = 0;
      let selectedRarity: MagicalGirl["rarity"] = "Common";

      for (const [rarity, rate] of Object.entries(rates) as [MagicalGirl["rarity"], number][]) {
        cumulative += rate;
        if (random <= cumulative) {
          selectedRarity = rarity;
          break;
        }
      }

      // Get available girls of selected rarity
      const availableGirls = initialMagicalGirls.filter(
        girl => girl.rarity === selectedRarity && !ownedGirlIds.includes(girl.id)
      );

      let selectedGirl: MagicalGirl;
      if (availableGirls.length > 0) {
        selectedGirl = availableGirls[Math.floor(Math.random() * availableGirls.length)];
      } else {
        // Fallback to any girl of that rarity (including duplicates)
        const rarityGirls = initialMagicalGirls.filter(girl => girl.rarity === selectedRarity);
        selectedGirl = rarityGirls[Math.floor(Math.random() * rarityGirls.length)];
      }

      const isNew = !ownedGirlIds.includes(selectedGirl.id);
      const isDuplicate = ownedGirlIds.includes(selectedGirl.id);

      results.push({
        characterId: selectedGirl.id,
        character: selectedGirl,
        rarity: selectedRarity,
        isNew,
        isDuplicate,
        wasFeatured: banner.featuredGirls.includes(selectedGirl.id),
        wasGuaranteed: pityCounter >= (pityConfig.maxCounter || 100),
        rarityAnimation: selectedRarity === "Legendary" || selectedRarity === "Epic",
        position: i + 1,
      });

      // Update pity counter
      set((currentState) => ({
        recruitmentSystem: {
          ...currentState.recruitmentSystem,
          pityCounters: {
            ...currentState.recruitmentSystem.pityCounters,
            [bannerId]: {
              current: pityCounter + 1,
              max: pityConfig.maxCounter,
              lastReset: Date.now(),
            },
          },
        },
      }));

      // Reset pity if target rarity was pulled
      if (selectedRarity === pityConfig.targetRarity) {
        set((currentState) => ({
          recruitmentSystem: {
            ...currentState.recruitmentSystem,
            pityCounters: {
              ...currentState.recruitmentSystem.pityCounters,
              [bannerId]: {
                current: 0,
                max: pityConfig.maxCounter,
                lastReset: Date.now(),
              },
            },
          },
        }));
      }
    }

    // Add new girls to collection
    const newGirls = results.filter(r => r.isNew).map(r => ({
      ...r.character,
      isUnlocked: true,
      unlockedAt: Date.now(),
    }));

    if (newGirls.length > 0) {
      set((currentState) => ({
        magicalGirls: [...currentState.magicalGirls, ...newGirls],
      }));
    }

    // Record summon history
    const summonRecord: SummonRecord = {
      id: Math.random().toString(36),
      bannerId,
      timestamp: Date.now(),
      results,
      cost,
      pityCounter: state.recruitmentSystem.pityCounters[bannerId]?.current || 0,
      wasGuaranteed: results.some(r => r.wasGuaranteed),
      eventContext: banner.type === "Event" ? banner.name : undefined,
    };

    set((currentState) => ({
      recruitmentSystem: {
        ...currentState.recruitmentSystem,
        summonHistory: [summonRecord, ...currentState.recruitmentSystem.summonHistory].slice(0, 100),
      },
    }));

    // Trigger achievements
    const achievementStore = useAchievementStore.getState();
    achievementStore.updateProgress("summon_first_girl", results.filter(r => r.isNew).length);
    achievementStore.updateProgress("first_girl", results.filter(r => r.isNew).length);
    achievementStore.checkAllAchievements();

    // Save game
    get().saveGame();

    return results;
  },

  startMission: (missionId: string, teamIds: string[]) => {
    const state = get();
    const mission = state.missions.find(m => m.id === missionId);
    
    if (!mission || !mission.isUnlocked || !mission.isAvailable || state.activeMission) {
      return false;
    }

    // Check if player has enough magical energy (skip for tutorials)
    if (mission.type !== "Tutorial" && state.resources.magicalEnergy < GAME_CONFIG.MISSION_ENERGY_COST) {
      return false;
    }

    // Spend magical energy (skip for tutorials)
    if (mission.type !== "Tutorial") {
      state.spendResources({ magicalEnergy: GAME_CONFIG.MISSION_ENERGY_COST });
    }

    // Auto-complete tutorial missions
    if (mission.type === "Tutorial") {
      // Award rewards immediately for tutorial missions
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
          m.id === missionId ? { 
            ...m, 
            isCompleted: true, 
            completedAt: Date.now(),
            objectives: m.objectives.map(obj => ({ ...obj, isCompleted: true, progress: obj.maxProgress }))
          } : m
        ),
        player: {
          ...currentState.player,
          statistics: {
            ...currentState.player.statistics,
            missionsCompleted: currentState.player.statistics.missionsCompleted + 1,
          },
        },
      }));

      // Save game after tutorial mission completion
      get().saveGame();

      return true;
    }

    // Use first available girl if no team specified
    const selectedTeam = teamIds.length > 0 ? teamIds : [state.magicalGirls[0]?.id].filter(Boolean);

    // Set mission as active for non-tutorial missions
    set({ activeMission: { mission: { ...mission, attempts: mission.attempts + 1 }, teamIds: selectedTeam } });

    // Start combat battle for combat missions
    if (mission.category === "Combat") {
      const playerTeam = selectedTeam.map((girlId): CombatParticipant | null => {
        const girl = state.magicalGirls.find(g => g.id === girlId);
        if (!girl) return null;
        
        return {
          id: girl.id,
          source: "player" as const,
          character: girl,
          position: { row: 1, column: 1, team: "player" as const, modifiers: [] },
          currentStats: {
            health: 100, // Base health
            mana: 50, // Base mana
            attack: girl.stats.power,
            defense: girl.stats.defense,
            speed: girl.stats.speed,
            accuracy: 80,
            evasion: 10,
            criticalRate: 5,
            criticalDamage: 150,
            elementalPower: girl.stats.magic,
            elementalResistance: { Light: 0, Darkness: 0, Fire: 0, Water: 0, Earth: 0, Air: 0, Ice: 0, Lightning: 0, Nature: 0, Celestial: 0, Void: 0, Crystal: 0 },
          },
          maxStats: {
            health: 100,
            mana: 50,
            attack: girl.stats.power,
            defense: girl.stats.defense,
            speed: girl.stats.speed,
            accuracy: 80,
            evasion: 10,
            criticalRate: 5,
            criticalDamage: 150,
            elementalPower: girl.stats.magic,
            elementalResistance: { Light: 0, Darkness: 0, Fire: 0, Water: 0, Earth: 0, Air: 0, Ice: 0, Lightning: 0, Nature: 0, Celestial: 0, Void: 0, Crystal: 0 },
          },
          statusEffects: [],
          equipment: {},
          availableActions: [
            {
              id: "attack",
              name: "Attack",
              type: "Attack",
              category: "Physical",
              description: "Basic physical attack",
              icon: "⚔️",
              costs: [{ resource: "mana", amount: 0 }],
              requirements: [],
              effects: [{
                type: "Damage",
                target: "Target",
                timing: "Instant",
                calculation: { baseValue: 20, scalingStat: "attack", scalingPercentage: 1 },
                modifiers: [],
                conditions: []
              }],
              targeting: { type: "Single", restrictions: [] },
              animation: { type: "Melee", duration: 500, effects: [] },
              cooldown: 0,
              currentCooldown: 0,
              uses: -1,
              maxUses: undefined,
              castTime: 0,
              range: 1,
              priority: 1,
              interruptible: false,
              channeled: false,
            }
          ],
          actionQueue: [],
          ai: undefined,
          isTransformed: false,
          transformationCharges: 3,
          maxTransformationCharges: 3,
          shields: [],
          barriers: [],
        };
      }).filter((participant): participant is CombatParticipant => participant !== null);

      const enemyTeam = [
        {
          id: "enemy-1",
          source: "ai" as const,
          character: {
            id: "enemy-1",
            name: "Mysterious Monster",
            element: "Darkness" as const,
            rarity: "Common" as const,
            level: 1,
            experience: 0,
            experienceToNext: 100,
            stats: { power: 15, defense: 10, speed: 8, magic: 5, wisdom: 5, charm: 5, courage: 10, luck: 5, endurance: 12, focus: 5 },
            abilities: [],
            equipment: { weapon: undefined, armor: undefined, accessories: [], temporaryItems: [] },
            transformation: { id: "none", name: "None", level: 1, maxLevel: 1, isUnlocked: false, requirements: [], forms: [], currentForm: 0, experience: 0, experienceToNext: 0, mastery: { level: 1, experience: 0, bonuses: [] } },
            personality: { traits: [], mood: "Calm" as const, relationships: [], preferences: { favoriteActivity: "Missions", favoriteMission: "Combat", favoriteTime: "Night", favoriteLocation: "City", specialInterests: [] }, dialogues: { greetings: [], training: [], missions: [], idle: [], levelUp: [], transformation: [], victory: [], defeat: [], special: [] } },
            backstory: "A mysterious monster attacking the city",
            avatar: { base: { hair: { style: "none", color: "black", length: "none", texture: "none" }, eyes: { shape: "glowing", color: "red", expression: "menacing" }, outfit: { base: "monster", colors: ["black", "red"], pattern: "scales", accessories: [] }, accessories: [], pose: "aggressive", background: "dark", effects: [] }, expressions: {}, outfits: {}, accessories: {}, current: { expression: "menacing", outfit: "default", accessories: [], pose: "aggressive", effects: [] } },
            isUnlocked: true,
            unlockedAt: Date.now(),
            favoriteLevel: 0,
            totalMissionsCompleted: 0,
            specialization: "Combat" as const,
            bondLevel: 1,
            bondExperience: 0,
          } as MagicalGirl,
          position: { row: 3, column: 2, team: "enemy" as const, modifiers: [] },
          currentStats: {
            health: 80,
            mana: 30,
            attack: 15,
            defense: 10,
            speed: 8,
            accuracy: 70,
            evasion: 5,
            criticalRate: 3,
            criticalDamage: 130,
            elementalPower: 5,
            elementalResistance: { Light: -20, Darkness: 20, Fire: 0, Water: 0, Earth: 0, Air: 0, Ice: 0, Lightning: 0, Nature: 0, Celestial: 0, Void: 0, Crystal: 0 },
          },
          maxStats: {
            health: 80,
            mana: 30,
            attack: 15,
            defense: 10,
            speed: 8,
            accuracy: 70,
            evasion: 5,
            criticalRate: 3,
            criticalDamage: 130,
            elementalPower: 5,
            elementalResistance: { Light: -20, Darkness: 20, Fire: 0, Water: 0, Earth: 0, Air: 0, Ice: 0, Lightning: 0, Nature: 0, Celestial: 0, Void: 0, Crystal: 0 },
          },
          statusEffects: [],
          equipment: { weapon: undefined, armor: undefined, accessories: [], temporaryItems: [] },
          availableActions: [
            {
              id: "enemy-attack",
              name: "Monster Attack",
              type: "Attack" as const,
              category: "Physical" as const,
              description: "Basic monster attack",
              icon: "🦹",
              costs: [{ resource: "mana" as const, amount: 0 }],
              requirements: [],
              effects: [{
                type: "Damage" as const,
                target: "Target" as const,
                timing: "Instant" as const,
                calculation: { baseValue: 15, scalingStat: "attack" as const, scalingPercentage: 1 },
                modifiers: [],
                conditions: []
              }],
              targeting: { type: "Single", restrictions: [] },
              animation: { type: "Melee", duration: 500, effects: [] },
              cooldown: 0,
              currentCooldown: 0,
              uses: -1,
              maxUses: undefined,
              castTime: 0,
              range: 1,
              priority: 1,
              interruptible: false,
              channeled: false,
            }
          ],
          actionQueue: [],
          ai: {
            type: "Aggressive",
            difficulty: "Easy",
            personality: { aggression: 80, caution: 20, cooperation: 0, adaptability: 30, focus: 70 },
            priorities: [{ condition: "always", weight: 100, actions: ["enemy-attack"] }],
            behaviors: [{ trigger: "health_low", probability: 50, actions: ["enemy-attack"], cooldown: 2 }],
            reactions: [{ event: "damaged", condition: "health < 50%", response: ["enemy-attack"], probability: 80 }],
            knowledge: { playerPatterns: [], effectiveStrategies: [], threats: [], opportunities: [] },
          },
          isTransformed: false,
          transformationCharges: 0,
          maxTransformationCharges: 0,
          shields: [],
          barriers: [],
        }
      ] as CombatParticipant[];

      const battleData = {
        name: mission.name,
        type: "Mission" as const,
        playerTeam,
        enemyTeam,
        environment: {
          id: "city",
          name: "City Streets",
          description: "Urban battlefield with buildings and civilians",
          type: "City" as const,
          weather: { type: "Clear" as const, intensity: 0, effects: [] },
          terrain: "Flat" as const,
          lighting: "Normal" as const,
          magicalField: "Neutral" as const,
          effects: [],
          hazards: [],
          bonuses: [],
          background: "city-bg.jpg",
        },
        turnOrder: {
          participants: [],
          currentIndex: 0,
          phase: "Start" as const,
          speedTiebreaker: "random" as const,
        },
        currentTurn: 1,
        maxTurns: 50,
        turnTimer: 30000,
        maxTurnTimer: 30000,
        conditions: [],
        rewards: mission.rewards.map(reward => ({
          type: reward.type === "experience" ? "Experience" as const : reward.type === "sparkles" ? "Currency" as const : "Item" as const,
          amount: reward.quantity,
          item: reward.item,
          rarity: undefined,
          condition: undefined,
          bonus: undefined,
          description: `${reward.quantity} ${reward.type}`,
        })),
        penalties: [],
      };

      get().startCombatBattle(battleData);
    }

    // Save game after starting mission
    get().saveGame();

    return true;
  },

  completeMission: (missionId: string, success: boolean, score?: number) => {
    const state = get();
    const mission = state.missions.find(m => m.id === missionId);
    
    if (!mission || !state.activeMission || state.activeMission.mission.id !== missionId) {
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
            totalScore: currentState.player.statistics.totalScore + (score || 0),
          },
        },
      }));

      // Save game after mission completion
      get().saveGame();
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

  updateMissions: () => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    set((currentState) => ({
      missions: currentState.missions.map(mission => {
        // Reset daily missions after 24 hours
        if (mission.type === "Daily" && mission.isCompleted && mission.completedAt) {
          const timeSinceCompletion = now - mission.completedAt;
          if (timeSinceCompletion >= oneDay) {
            return {
              ...mission,
              isCompleted: false,
              completedAt: undefined,
              attempts: 0,
              objectives: mission.objectives.map(obj => ({
                ...obj,
                isCompleted: false,
                progress: 0
              }))
            };
          }
        }

        // Update mission availability based on requirements
        let isAvailable = mission.isAvailable;
        let isUnlocked = mission.isUnlocked;

        // Check unlock conditions based on requirements
        if (mission.requirements && mission.requirements.length > 0) {
          isUnlocked = mission.requirements.every(requirement => {
            switch (requirement.type) {
              case 'level': {
                return currentState.gameProgress.level >= (requirement.value as number);
              }
              case 'mission_completed': {
                // Check if required mission is completed
                const requiredMission = currentState.missions.find(m => m.id === requirement.value);
                return requiredMission?.isCompleted || false;
              }
              case 'achievement': {
                // Check if achievement is unlocked
                const achievementStore = useAchievementStore.getState();
                const achievement = achievementStore.achievements.find(a => a.id === requirement.value);
                return achievement?.unlocked || false;
              }
              case 'magical_girl': {
                return currentState.magicalGirls.length >= (requirement.value as number);
              }
              default:
                return true;
            }
          });
        }

        // Mission is available if unlocked and not completed (or reset)
        isAvailable = isUnlocked && !mission.isCompleted;

        return {
          ...mission,
          isUnlocked,
          isAvailable
        };
      })
    }));
  },

  serializeGameState: () => {
    const state = get();
    const timestamp = Date.now();

    return {
      version: PERSISTENCE_VERSION,
      timestamp,
      gameState: {
        notifications: state.notifications,
        resources: { ...state.resources },
        magicalGirls: state.magicalGirls,
        gameProgress: state.gameProgress,
        trainingData: state.trainingData,
        settings: state.settings,
        transformationData: state.transformationData,
        formationData: state.formationData,
        prestigeData: state.prestigeData,
        saveSystemData: { lastSave: timestamp },
        tutorialData: state.tutorialData,
        player: syncPlayerResources(state.player, state.resources),
        missions: state.missions,
        activeMission: state.activeMission,
        activeSessions: state.activeSessions,
        recruitmentSystem: state.recruitmentSystem,
      },
    };
  },

  importGameState: (persistedState, timestamp) => {
    const normalizedResources = persistedState.resources
      ? { ...persistedState.resources }
      : createInitialResources();
    const activeMission = persistedState.activeMission
      ? persistedState.activeMission
      : null;

    set(() => ({
      notifications: persistedState.notifications ?? [],
      resources: normalizedResources,
      magicalGirls: persistedState.magicalGirls ?? [],
      gameProgress: persistedState.gameProgress ?? initialState.gameProgress,
      trainingData: persistedState.trainingData ?? initialState.trainingData,
      settings: persistedState.settings ?? initialState.settings,
      transformationData: persistedState.transformationData ?? initialState.transformationData,
      formationData: persistedState.formationData ?? initialState.formationData,
      prestigeData: persistedState.prestigeData ?? initialState.prestigeData,
      saveSystemData: { lastSave: timestamp ?? persistedState.saveSystemData?.lastSave ?? Date.now() },
      tutorialData: persistedState.tutorialData ?? initialState.tutorialData,
      player: syncPlayerResources(persistedState.player ?? initialState.player, normalizedResources),
      missions: initialMissions,
      activeMission,
      activeSessions: persistedState.activeSessions ?? [],
      recruitmentSystem: persistedState.recruitmentSystem ?? initialState.recruitmentSystem,
    }));

    const state = get();

    if (state.activeMission && state.activeMission.mission.type === "Tutorial") {
      const rewards = { experience: 0, sparkles: 0, stardust: 0 };
      state.activeMission.mission.rewards.forEach((reward) => {
        if (reward.type === "experience") rewards.experience += reward.quantity;
        if (reward.type === "sparkles") rewards.sparkles += reward.quantity;
        if (reward.type === "stardust") rewards.stardust += reward.quantity;
      });

      state.addResources(rewards);

      set((currentState) => ({
        activeMission: null,
        missions: currentState.missions.map((mission) =>
          mission.id === state.activeMission!.mission.id
            ? {
                ...mission,
                isCompleted: true,
                completedAt: Date.now(),
                objectives: mission.objectives.map((objective) => ({
                  ...objective,
                  isCompleted: true,
                  progress: objective.maxProgress,
                })),
              }
            : mission
        ),
        player: {
          ...currentState.player,
          statistics: {
            ...currentState.player.statistics,
            missionsCompleted: currentState.player.statistics.missionsCompleted + 1,
          },
        },
      }));
    }

    get().updateMissions();
  },

  saveGame: () => {
    if (!isBrowser) {
      return;
    }

    try {
      const saveData = get().serializeGameState();
      localStorage.setItem("magicalGirlSave", JSON.stringify(saveData));
      set((state) => ({
        saveSystemData: { lastSave: saveData.timestamp },
        player: syncPlayerResources(state.player, state.resources),
      }));
    } catch {
      // Handle save error silently or log to external service
    }
  },

  loadGame: () => {
    if (!isBrowser) {
      return false;
    }

    try {
      const rawSave = localStorage.getItem("magicalGirlSave");
      if (!rawSave) {
        return false;
      }

      const parsed: SaveData = JSON.parse(rawSave);
      if (parsed.version !== PERSISTENCE_VERSION) {
        return false;
      }

      get().importGameState(parsed.gameState, parsed.timestamp);
      return true;
    } catch {
      // Handle load error silently
      return false;
    }
  },

  initializePersistence: () => {
    if (!isBrowser) {
      return () => {};
    }

    persistenceSubscribers += 1;

    if (!persistenceInitialized) {
      persistenceInitialized = true;
      get().loadGame();

      autoSaveTimer = window.setInterval(() => {
        get().saveGame();
      }, GAME_CONFIG.UI.AUTO_SAVE_INTERVAL);

      gameTickTimer = window.setInterval(() => {
        const state = get();
        if (state.updateGameTime) {
          state.updateGameTime();
        }
        state.updateMissions();
      }, GAME_CONFIG.TIMERS.GAME_TICK_INTERVAL_MS);
    }

    return () => {
      persistenceSubscribers = Math.max(0, persistenceSubscribers - 1);
      if (persistenceSubscribers === 0) {
        clearPersistenceTimers();
        persistenceInitialized = false;
      }
    };
  },

  // Combat methods
  startCombatBattle: (battleData) => {
    const battle: CombatBattle = {
      ...battleData,
      id: `battle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: "Active",
      startTime: Date.now(),
      combatLog: [],
    };

    set((state) => ({
      combatSystem: {
        ...state.combatSystem,
        battles: [...state.combatSystem.battles, battle],
        activeBattle: battle,
      },
    }));

    // Initialize turn order
    get().initializeCombatTurnOrder(battle.id);
  },

  executeCombatAction: (participantId, action, targets) => {
    const { activeBattle } = get().combatSystem;
    if (!activeBattle) return;

    // Add action to combat log
    get().addCombatLogEntry(activeBattle.id, {
      turn: activeBattle.currentTurn,
      phase: activeBattle.turnOrder.phase,
      type: "Action",
      actor: participantId,
      action: action.name,
      description: `${participantId} used ${action.name}`,
    });

    // Process action effects
    get().processCombatActionEffects(participantId, action, targets);

    // Move to next turn after action
    setTimeout(() => get().nextCombatTurn(), 1000);
  },

  endCombatBattle: (battleId, winner, reason) => {
    set((state) => ({
      combatSystem: {
        ...state.combatSystem,
        battles: state.combatSystem.battles.map((battle) =>
          battle.id === battleId
            ? {
                ...battle,
                status: "Completed" as const,
                endTime: Date.now(),
                winner,
                reason,
              }
            : battle
        ),
        activeBattle: state.combatSystem.activeBattle?.id === battleId ? null : state.combatSystem.activeBattle,
      },
    }));

    // Create combat record
    const battle = get().combatSystem.battles.find((b) => b.id === battleId);
    if (battle) {
      get().createCombatRecord(battle);
    }
  },

  // Helper methods
  initializeCombatTurnOrder: (battleId: string) => {
    const battle = get().combatSystem.battles.find((b) => b.id === battleId);
    if (!battle) return;

    const allParticipants = [...battle.playerTeam, ...battle.enemyTeam];
    const turnOrder = {
      participants: allParticipants
        .map((p) => ({
          participantId: p.id,
          speed: p.currentStats.speed,
          initiative: Math.random(),
          delayedTurns: 0,
          hasActed: false,
          canAct: true,
        }))
        .sort((a, b) => b.speed - a.speed || b.initiative - a.initiative),
      currentIndex: 0,
      phase: "Action" as const,
      speedTiebreaker: "random" as const,
    };

    set((state) => ({
      combatSystem: {
        ...state.combatSystem,
        battles: state.combatSystem.battles.map((b) =>
          b.id === battleId ? { ...b, turnOrder } : b
        ),
      },
    }));
  },

  nextCombatTurn: () => {
    const { activeBattle } = get().combatSystem;
    if (!activeBattle || activeBattle.status !== "Active") return;

    const turnOrder = activeBattle.turnOrder;
    const nextIndex = (turnOrder.currentIndex + 1) % turnOrder.participants.length;

    set((state) => ({
      combatSystem: {
        ...state.combatSystem,
        activeBattle: state.combatSystem.activeBattle
          ? {
              ...state.combatSystem.activeBattle,
              turnOrder: {
                ...state.combatSystem.activeBattle.turnOrder,
                currentIndex: nextIndex,
                phase: "Action" as const,
              },
              currentTurn: state.combatSystem.activeBattle.currentTurn + 1,
            }
          : null,
      },
    }));
  },

  processCombatActionEffects: (participantId: string, action: CombatAction, targets?: CombatParticipant[]) => {
    // Basic action processing - in a real implementation this would be much more complex
    if (!targets || targets.length === 0) return;

    targets.forEach((target) => {
      action.effects.forEach((effect) => {
        if (effect.type === "Damage") {
          const damage = Math.floor(Math.random() * 50) + 10; // Placeholder damage calculation
          get().updateCombatParticipant("", target.id, {
            currentStats: {
              ...target.currentStats,
              health: Math.max(0, target.currentStats.health - damage),
            },
          });

          // Add damage log entry
          get().addCombatLogEntry(get().combatSystem.activeBattle!.id, {
            turn: get().combatSystem.activeBattle!.currentTurn,
            phase: get().combatSystem.activeBattle!.turnOrder.phase,
            type: "Damage",
            actor: participantId,
            target: [target.id],
            value: damage,
            description: `${participantId} dealt ${damage} damage to ${target.id}`,
          });
        }
      });
    });
  },

  updateCombatParticipant: (_battleId: string, participantId: string, updates: Partial<CombatParticipant>) => {
    set((state) => ({
      combatSystem: {
        ...state.combatSystem,
        battles: state.combatSystem.battles.map((battle) => ({
          ...battle,
          playerTeam: battle.playerTeam.map((p) =>
            p.id === participantId ? { ...p, ...updates } : p
          ),
          enemyTeam: battle.enemyTeam.map((p) =>
            p.id === participantId ? { ...p, ...updates } : p
          ),
        })),
      },
    }));
  },

  addCombatLogEntry: (battleId: string, entryData: Omit<CombatLogEntry, "id" | "timestamp">) => {
    const entry = {
      ...entryData,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    set((state) => ({
      combatSystem: {
        ...state.combatSystem,
        battles: state.combatSystem.battles.map((battle) =>
          battle.id === battleId
            ? { ...battle, combatLog: [...battle.combatLog, entry] }
            : battle
        ),
      },
    }));
  },

  createCombatRecord: (battle: CombatBattle) => {
    const record = {
      id: `record-${battle.id}`,
      battleId: battle.id,
      timestamp: battle.endTime || Date.now(),
      duration: (battle.endTime || Date.now()) - battle.startTime,
      type: battle.type,
      playerTeam: battle.playerTeam.map((p) => p.id),
      enemyTeam: battle.enemyTeam.map((p) => p.id),
      result: battle.winner === "player" ? "Victory" as const : battle.winner === "enemy" ? "Defeat" as const : "Draw" as const,
      turns: battle.currentTurn,
      damageDealt: 0, // Would calculate from log
      damageReceived: 0, // Would calculate from log
      healingDone: 0, // Would calculate from log
      criticalHits: 0, // Would calculate from log
      abilitiesUsed: 0, // Would calculate from log
      itemsUsed: 0, // Would calculate from log
      transformations: 0, // Would calculate from log
      mvp: battle.playerTeam[0]?.id || "", // Would determine from performance
      rewards: battle.rewards,
      experience: 100, // Base experience
      rating: 1200, // Would calculate based on difficulty and performance
    };

    set((state) => ({
      combatSystem: {
        ...state.combatSystem,
        combatHistory: [record, ...state.combatSystem.combatHistory].slice(0, 100),
      },
    }));
  },
}));

