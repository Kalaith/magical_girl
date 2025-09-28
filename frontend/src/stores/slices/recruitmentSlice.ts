// Recruitment system slice - Gacha and summoning functionality
import type { StateCreator } from "zustand";
import type {
  RecruitmentSystem,
  RecruitmentBanner,
  SummonRecord,
  SummonResult,
  SummonSession,
  PityCounter,
  RecruitmentCurrencies,
  GachaRates,
  Rarity,
  RecruitmentStatistics,
} from "../../types/recruitment";
import type { MagicalGirl } from "../../types/magicalGirl";
import type { Notification, Resources } from "../../types";
import { RECRUITMENT_CONFIG } from "../../data/recruitmentConfig";

export interface RecruitmentSlice {
  // State
  recruitmentSystem: RecruitmentSystem;
  currentSession: SummonSession | null;
  isAnimating: boolean;
  animationQueue: SummonResult[];

  // Actions
  initializeRecruitment: () => void;
  performSummon: (bannerId: string, count: number) => Promise<SummonResult[]>;
  performSingleSummon: (bannerId: string) => Promise<SummonResult>;
  startSummonSession: (bannerId: string) => string;
  endSummonSession: (sessionId: string, satisfaction?: number) => void;

  // Pity system
  incrementPity: (bannerId: string) => void;
  resetPity: (bannerId: string) => void;
  checkPityActivation: (bannerId: string) => boolean;

  // Gacha mechanics
  rollRarity: (bannerId: string, pityCounter: number) => Rarity;
  selectCharacter: (bannerId: string, rarity: Rarity) => MagicalGirl;
  applyGuarantees: (
    bannerId: string,
    results: SummonResult[],
  ) => SummonResult[];

  // Banner management
  activateBanner: (bannerId: string) => void;
  deactivateBanner: (bannerId: string) => void;
  getBanner: (bannerId: string) => RecruitmentBanner | undefined;
  getActiveBanners: () => RecruitmentBanner[];

  // Currency management
  canAffordSummon: (bannerId: string, count: number) => boolean;
  spendSummonCurrency: (bannerId: string, count: number) => boolean;
  addRecruitmentCurrency: (currency: Partial<RecruitmentCurrencies>) => void;

  // Animation system
  startAnimation: (results: SummonResult[]) => void;
  nextAnimation: () => SummonResult | null;
  skipAnimation: () => void;
  clearAnimationQueue: () => void;

  // Statistics and history
  addSummonRecord: (record: SummonRecord) => void;
  getSummonHistory: (bannerId?: string) => SummonRecord[];
  getPlayerStatistics: () => RecruitmentStatistics;

  // Wishlist system
  addToWishlist: (characterId: string) => boolean;
  removeFromWishlist: (characterId: string) => boolean;
  getWishlistBonus: (characterId: string) => number;
}

export const createRecruitmentSlice: StateCreator<
  RecruitmentSlice & {
    addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
    addMagicalGirl: (girl: MagicalGirl) => void;
    getMagicalGirl: (id: string) => MagicalGirl | undefined;
    spendResources: (resources: Partial<Resources>) => boolean;
    addResources: (resources: Partial<Resources>) => void;
  },
  [],
  [],
  RecruitmentSlice
> = (set, get) => ({
  recruitmentSystem: {
    currencies: {
      friendshipPoints: 10000,
      premiumGems: 1000,
      eventTokens: 0,
      summonTickets: 10,
      rareTickets: 1,
      legendaryTickets: 0,
      dreamshards: 500,
    },
    banners: [],
    activeBanners: [],
    pityCounters: {},
    summonHistory: [],
    guaranteedCounter: {},
  },

  currentSession: null,
  isAnimating: false,
  animationQueue: [],

  initializeRecruitment: () =>
    set((state) => {
      const banners = RECRUITMENT_CONFIG.banners.map((banner) => ({
        ...banner,
        isActive:
          banner.startDate <= Date.now() &&
          (!banner.endDate || banner.endDate > Date.now()),
      }));

      const activeBanners = banners.filter((b) => b.isActive).map((b) => b.id);

      const pityCounters: { [bannerId: string]: PityCounter } = {};
      banners.forEach((banner) => {
        if (banner.pitySystem.enabled) {
          pityCounters[banner.id] = {
            current: 0,
            max: banner.pitySystem.maxCounter,
            lastReset: Date.now(),
          };
        }
      });

      return {
        recruitmentSystem: {
          ...state.recruitmentSystem,
          banners,
          activeBanners,
          pityCounters,
        },
      };
    }),

  performSummon: async (bannerId: string, count: number) => {
    const state = get();
    const banner = state.getBanner(bannerId);

    if (!banner || !state.canAffordSummon(bannerId, count)) {
      throw new Error("Cannot perform summon");
    }

    // Start session if not already started
    let sessionId = state.currentSession?.id;
    if (!sessionId) {
      sessionId = state.startSummonSession(bannerId);
    }

    const results: SummonResult[] = [];

    for (let i = 0; i < count; i++) {
      const result = await state.performSingleSummon(bannerId);
      result.position = i;
      results.push(result);
    }

    // Apply guarantees for multi-pull
    const finalResults = state.applyGuarantees(bannerId, results);

    // Spend currency
    state.spendSummonCurrency(bannerId, count);

    // Create summon record
    const record: SummonRecord = {
      id: `summon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      bannerId,
      timestamp: Date.now(),
      results: finalResults,
      cost: banner.costs.single, // TODO: Calculate actual cost
      pityCounter: state.recruitmentSystem.pityCounters[bannerId]?.current || 0,
      wasGuaranteed: finalResults.some((r) => r.wasGuaranteed),
    };

    state.addSummonRecord(record);

    // Add new characters to collection
    finalResults.forEach((result) => {
      if (result.isNew) {
        get().addMagicalGirl(result.character);
      }
    });

    // Start animation
    state.startAnimation(finalResults);

    return finalResults;
  },

  performSingleSummon: async (bannerId: string) => {
    const state = get();
    const banner = state.getBanner(bannerId);

    if (!banner) {
      throw new Error("Banner not found");
    }

    // Check pity activation
    const pityActive = state.checkPityActivation(bannerId);

    // Roll rarity
    const pityCounter =
      state.recruitmentSystem.pityCounters[bannerId]?.current || 0;
    const rarity = pityActive
      ? banner.pitySystem.targetRarity
      : state.rollRarity(bannerId, pityCounter);

    // Select character
    const character = state.selectCharacter(bannerId, rarity);

    // Check if character is new
    const existingCharacter = get().getMagicalGirl(character.id);
    const isNew = !existingCharacter;
    const isDuplicate = !isNew;

    // Check if featured
    const wasFeatured = banner.featuredGirls.includes(character.id);

    // Increment pity counter
    if (banner.pitySystem.enabled) {
      if (
        rarity === banner.pitySystem.targetRarity &&
        banner.pitySystem.resetOnPull
      ) {
        state.resetPity(bannerId);
      } else {
        state.incrementPity(bannerId);
      }
    }

    const result: SummonResult = {
      characterId: character.id,
      character,
      rarity,
      isNew,
      isDuplicate,
      wasFeatured,
      wasGuaranteed: pityActive,
      rarityAnimation: rarity === "Legendary" || rarity === "Mythical",
      position: 0,
    };

    return result;
  },

  startSummonSession: (bannerId: string) => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    set({
      currentSession: {
        id: sessionId,
        bannerId,
        startTime: Date.now(),
        totalPulls: 0,
        results: [],
        totalCost: {} as { [K in keyof RecruitmentCurrencies]: number },
        rarityBreakdown: {} as { [K in Rarity]: number },
        newCharacters: 0,
        duplicates: 0,
        pityActivated: false,
        guaranteesActivated: [],
        satisfaction: 0,
      },
    });

    return sessionId;
  },

  endSummonSession: (sessionId: string, satisfaction = 3) => {
    set((state) => {
      if (state.currentSession?.id === sessionId) {
        return {
          currentSession: {
            ...state.currentSession,
            endTime: Date.now(),
            satisfaction,
          },
        };
      }
      return state;
    });

    // Clear session after a delay
    setTimeout(() => {
      set({ currentSession: null });
    }, 1000);
  },

  incrementPity: (bannerId: string) =>
    set((state) => {
      const pityCounters = { ...state.recruitmentSystem.pityCounters };
      if (pityCounters[bannerId]) {
        pityCounters[bannerId] = {
          ...pityCounters[bannerId],
          current: pityCounters[bannerId].current + 1,
        };
      }

      return {
        recruitmentSystem: {
          ...state.recruitmentSystem,
          pityCounters,
        },
      };
    }),

  resetPity: (bannerId: string) =>
    set((state) => {
      const pityCounters = { ...state.recruitmentSystem.pityCounters };
      if (pityCounters[bannerId]) {
        pityCounters[bannerId] = {
          ...pityCounters[bannerId],
          current: 0,
          lastReset: Date.now(),
        };
      }

      return {
        recruitmentSystem: {
          ...state.recruitmentSystem,
          pityCounters,
        },
      };
    }),

  checkPityActivation: (bannerId: string) => {
    const state = get();
    const pityCounter = state.recruitmentSystem.pityCounters[bannerId];
    const banner = state.getBanner(bannerId);

    if (!pityCounter || !banner?.pitySystem.enabled) {
      return false;
    }

    return pityCounter.current >= pityCounter.max;
  },

  rollRarity: (bannerId: string, pityCounter: number) => {
    const state = get();
    const banner = state.getBanner(bannerId);

    if (!banner) {
      return "Common" as Rarity;
    }

    const rates = { ...banner.rates };

    // Apply soft pity if configured
    if (
      banner.pitySystem.softPity &&
      pityCounter >= banner.pitySystem.softPity.startAt
    ) {
      const softPityBonus = Math.min(
        (pityCounter - banner.pitySystem.softPity.startAt) *
          banner.pitySystem.softPity.rateIncrease,
        banner.pitySystem.softPity.maxIncrease,
      );
      rates[banner.pitySystem.targetRarity] += softPityBonus;
    }

    // Normalize rates
    const totalRate = Object.values(rates).reduce((sum, rate) => sum + rate, 0);
    const normalizedRates = Object.fromEntries(
      Object.entries(rates).map(([rarity, rate]) => [
        rarity,
        (rate / totalRate) * 100,
      ]),
    ) as GachaRates;

    const roll = Math.random() * 100;
    let currentRate = 0;

    const rarities: Rarity[] = [
      "Mythical",
      "Legendary",
      "Epic",
      "Rare",
      "Uncommon",
      "Common",
    ];

    for (const rarity of rarities) {
      currentRate += normalizedRates[rarity];
      if (roll <= currentRate) {
        return rarity;
      }
    }

    return "Common";
  },

  selectCharacter: (bannerId: string, rarity: Rarity) => {
    const state = get();
    const banner = state.getBanner(bannerId);

    if (!banner) {
      throw new Error("Banner not found");
    }

    // Get available characters for this rarity
    const availableCharacters = RECRUITMENT_CONFIG.characterPool.filter(
      (char) => char.rarity === rarity,
    );

    if (availableCharacters.length === 0) {
      throw new Error(`No characters available for rarity: ${rarity}`);
    }

    // Prefer featured characters if available
    const featuredChars = availableCharacters.filter((char) =>
      banner.featuredGirls.includes(char.id),
    );

    const candidates =
      featuredChars.length > 0 && Math.random() < 0.7
        ? featuredChars
        : availableCharacters;

    const selectedTemplate =
      candidates[Math.floor(Math.random() * candidates.length)];

    // Create magical girl instance from template
    const character: MagicalGirl = {
      ...selectedTemplate,
      id: selectedTemplate.id + "_" + Date.now(),
      level: 1,
      experience: 0,
      experienceToNext: 100,
      isUnlocked: true,
      unlockedAt: Date.now(),
      favoriteLevel: 0,
      totalMissionsCompleted: 0,
      bondLevel: 1,
      bondExperience: 0,
    };

    return character;
  },

  applyGuarantees: (bannerId: string, results: SummonResult[]) => {
    const state = get();
    const banner = state.getBanner(bannerId);

    if (!banner) {
      return results;
    }

    const modifiedResults = [...results];

    // Apply banner guarantees
    banner.guarantees.forEach((guarantee) => {
      // Implementation would depend on specific guarantee type
      // This is a simplified version
      if (
        guarantee.type === "minimum_rarity" &&
        guarantee.currentTriggers < (guarantee.maxTriggers || Infinity)
      ) {
        const hasMinimumRarity = results.some((r) =>
          ["Epic", "Legendary", "Mythical"].includes(r.rarity),
        );

        if (!hasMinimumRarity && results.length >= 10) {
          // Upgrade last result to guaranteed rarity
          const lastIndex = results.length - 1;
          modifiedResults[lastIndex] = {
            ...modifiedResults[lastIndex],
            rarity: "Epic",
            wasGuaranteed: true,
            rarityAnimation: true,
          };
        }
      }
    });

    return modifiedResults;
  },

  activateBanner: (bannerId: string) =>
    set((state) => ({
      recruitmentSystem: {
        ...state.recruitmentSystem,
        activeBanners: [...state.recruitmentSystem.activeBanners, bannerId],
      },
    })),

  deactivateBanner: (bannerId: string) =>
    set((state) => ({
      recruitmentSystem: {
        ...state.recruitmentSystem,
        activeBanners: state.recruitmentSystem.activeBanners.filter(
          (id) => id !== bannerId,
        ),
      },
    })),

  getBanner: (bannerId: string) => {
    const state = get();
    return state.recruitmentSystem.banners.find(
      (banner) => banner.id === bannerId,
    );
  },

  getActiveBanners: () => {
    const state = get();
    return state.recruitmentSystem.banners.filter((banner) =>
      state.recruitmentSystem.activeBanners.includes(banner.id),
    );
  },

  canAffordSummon: (bannerId: string, count: number) => {
    const state = get();
    const banner = state.getBanner(bannerId);

    if (!banner) {
      return false;
    }

    const cost = count === 1 ? banner.costs.single : banner.costs.ten;
    const primaryCost = cost.primary;

    const availableAmount =
      state.recruitmentSystem.currencies[primaryCost.currency];
    const totalCost = primaryCost.amount * (count === 10 ? 1 : count);

    return availableAmount >= totalCost;
  },

  spendSummonCurrency: (bannerId: string, count: number) => {
    const state = get();
    const banner = state.getBanner(bannerId);

    if (!banner || !state.canAffordSummon(bannerId, count)) {
      return false;
    }

    const cost = count === 1 ? banner.costs.single : banner.costs.ten;
    const primaryCost = cost.primary;
    const totalCost = primaryCost.amount * (count === 10 ? 1 : count);

    set((currentState) => ({
      recruitmentSystem: {
        ...currentState.recruitmentSystem,
        currencies: {
          ...currentState.recruitmentSystem.currencies,
          [primaryCost.currency]:
            currentState.recruitmentSystem.currencies[primaryCost.currency] -
            totalCost,
        },
      },
    }));

    return true;
  },

  addRecruitmentCurrency: (currency: Partial<RecruitmentCurrencies>) =>
    set((state) => {
      const newCurrencies = { ...state.recruitmentSystem.currencies };

      Object.entries(currency).forEach(([key, value]) => {
        if (value && key in newCurrencies) {
          const currencyKey = key as keyof RecruitmentCurrencies;
          newCurrencies[currencyKey] += value;
        }
      });

      return {
        recruitmentSystem: {
          ...state.recruitmentSystem,
          currencies: newCurrencies,
        },
      };
    }),

  startAnimation: (results: SummonResult[]) =>
    set({
      isAnimating: true,
      animationQueue: [...results],
    }),

  nextAnimation: () => {
    const state = get();
    if (state.animationQueue.length === 0) {
      set({ isAnimating: false });
      return null;
    }

    const [next, ...remaining] = state.animationQueue;
    set({ animationQueue: remaining });

    if (remaining.length === 0) {
      setTimeout(() => set({ isAnimating: false }), 1000);
    }

    return next;
  },

  skipAnimation: () =>
    set({
      isAnimating: false,
      animationQueue: [],
    }),

  clearAnimationQueue: () =>
    set({
      animationQueue: [],
    }),

  addSummonRecord: (record: SummonRecord) =>
    set((state) => ({
      recruitmentSystem: {
        ...state.recruitmentSystem,
        summonHistory: [...state.recruitmentSystem.summonHistory, record].slice(
          -1000,
        ), // Keep last 1000 records
      },
    })),

  getSummonHistory: (bannerId?: string) => {
    const state = get();
    const history = state.recruitmentSystem.summonHistory;

    if (bannerId) {
      return history.filter((record) => record.bannerId === bannerId);
    }

    return history;
  },

  getPlayerStatistics: () => {
    const state = get();
    const history = state.recruitmentSystem.summonHistory;

    // Calculate statistics from summon history
    const totalPulls = history.reduce(
      (sum, record) => sum + record.results.length,
      0,
    );
    const rarityStats = history.reduce(
      (stats, record) => {
        record.results.forEach((result) => {
          stats[result.rarity] = (stats[result.rarity] || 0) + 1;
        });
        return stats;
      },
      {} as Record<Rarity, number>,
    );

    return {
      totalPulls,
      rarityStats,
      totalSessions: history.length,
      averagePulls: history.length > 0 ? totalPulls / history.length : 0,
    };
  },

  addToWishlist: (characterId: string) => {
    // TODO: Implement wishlist system
    return true;
  },

  removeFromWishlist: (characterId: string) => {
    // TODO: Implement wishlist system
    return true;
  },

  getWishlistBonus: (characterId: string) => {
    // TODO: Implement wishlist system
    return 0;
  },
});
