import type { RecruitmentBanner } from "../types/recruitment";
import { gameConfig } from "../config/gameConfig";

export const defaultBanners: RecruitmentBanner[] = [
  {
    id: "basic-standard",
    name: "Standard Banner",
    description: "The standard recruitment banner with balanced rates",
    type: "Standard",
    rarity: "Common",
    startDate: Date.now(),
    isActive: true,
    featuredGirls: [], // All girls are available
    rates: {
      Common: gameConfig.RECRUITMENT.RATES.BASIC.COMMON,
      Uncommon: 0, // Not used in basic banner
      Rare: gameConfig.RECRUITMENT.RATES.BASIC.RARE,
      Epic: gameConfig.RECRUITMENT.RATES.BASIC.EPIC,
      Legendary: gameConfig.RECRUITMENT.RATES.BASIC.LEGENDARY,
      Mythical: 0, // Not used in basic banner
    },
    costs: {
      single: {
        primary: { currency: "friendshipPoints", amount: gameConfig.RECRUITMENT.BASIC_COST, displayName: "Friendship Points" },
      },
      ten: {
        primary: { currency: "friendshipPoints", amount: Math.floor(gameConfig.RECRUITMENT.BASIC_COST * 10 * gameConfig.RECRUITMENT.MULTI_PULL_DISCOUNT), displayName: "Friendship Points" },
      },
    },
    pitySystem: {
      enabled: true,
      maxCounter: gameConfig.RECRUITMENT.PITY.BASIC.HARD_PITY,
      targetRarity: "Legendary",
      carryOver: false,
      resetOnPull: true,
      softPity: {
        startAt: gameConfig.RECRUITMENT.PITY.BASIC.SOFT_PITY_START,
        rateIncrease: gameConfig.RECRUITMENT.PITY.BASIC.SOFT_PITY_MULTIPLIER,
        maxIncrease: 10.0,
      },
    },
    guarantees: [],
    rewards: [],
    artwork: {
      background: "/banners/standard-bg.jpg",
      colors: {
        primary: "#8B5CF6",
        secondary: "#A855F7",
        accent: "#C084FC",
      },
    },
    animation: {
      summonSequence: {
        type: "standard",
        duration: 2000,
        effects: [
          { type: "particle", name: "sparkle", intensity: 0.8, duration: 1500, delay: 0 },
          { type: "light", name: "glow", intensity: 0.6, duration: 2000, delay: 0 },
        ],
      },
      revealSequence: {
        cardFlip: true,
        sparkleEffect: true,
        lightRays: true,
        colorScheme: {
          Common: "#6B7280",
          Uncommon: "#6B7280",
          Rare: "#3B82F6",
          Epic: "#9333EA",
          Legendary: "#FFD700",
          Mythical: "#FFD700",
        },
        duration: 1000,
      },
    },
  },
  {
    id: "premium-limited",
    name: "Premium Limited Banner",
    description: "Limited time banner with increased rates for rare characters",
    type: "Limited",
    rarity: "Premium",
    startDate: Date.now(),
    endDate: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
    isActive: true,
    featuredGirls: ["girl-legendary-1", "girl-epic-1"], // Example featured girls
    rates: {
      Common: gameConfig.RECRUITMENT.RATES.LIMITED.COMMON,
      Uncommon: 0,
      Rare: gameConfig.RECRUITMENT.RATES.LIMITED.RARE,
      Epic: gameConfig.RECRUITMENT.RATES.LIMITED.EPIC,
      Legendary: gameConfig.RECRUITMENT.RATES.LIMITED.LEGENDARY,
      Mythical: 0,
    },
    costs: {
      single: {
        primary: { currency: "premiumGems", amount: gameConfig.RECRUITMENT.PREMIUM_COST, displayName: "Premium Gems" },
      },
      ten: {
        primary: { currency: "premiumGems", amount: Math.floor(gameConfig.RECRUITMENT.PREMIUM_COST * 10 * gameConfig.RECRUITMENT.MULTI_PULL_DISCOUNT), displayName: "Premium Gems" },
      },
    },
    pitySystem: {
      enabled: true,
      maxCounter: gameConfig.RECRUITMENT.PITY.LIMITED.HARD_PITY,
      targetRarity: "Legendary",
      carryOver: false,
      resetOnPull: true,
      softPity: {
        startAt: gameConfig.RECRUITMENT.PITY.LIMITED.SOFT_PITY_START,
        rateIncrease: gameConfig.RECRUITMENT.PITY.LIMITED.SOFT_PITY_MULTIPLIER,
        maxIncrease: 15.0,
      },
    },
    guarantees: [
      {
        type: "featured_character",
        condition: { type: "pulls_count", value: 40, resetType: "banner" },
        reward: { type: "specific_character", value: 0, description: "Guaranteed featured Legendary character" },
        maxTriggers: 1,
        currentTriggers: 0,
      },
    ],
    rewards: [
      {
        type: "milestone",
        requirement: 10,
        reward: { type: "currency", id: "premiumGems", amount: 50, description: "50 Premium Gems" },
        claimed: false,
      },
      {
        type: "milestone",
        requirement: 25,
        reward: { type: "currency", id: "summonTickets", amount: 5, description: "5 Summon Tickets" },
        claimed: false,
      },
    ],
    artwork: {
      background: "/banners/limited-bg.jpg",
      featuredCharacter: "/characters/girl-legendary-1.jpg",
      colors: {
        primary: "#DC2626",
        secondary: "#EF4444",
        accent: "#F87171",
      },
    },
    animation: {
      summonSequence: {
        type: "special",
        duration: 3000,
        effects: [
          { type: "particle", name: "firework", intensity: 1.0, duration: 2500, delay: 0 },
          { type: "light", name: "spotlight", intensity: 0.9, duration: 3000, delay: 0 },
          { type: "screen", name: "shake", intensity: 0.3, duration: 500, delay: 500 },
        ],
        music: "limited-summon-bgm.mp3",
      },
      revealSequence: {
        cardFlip: true,
        sparkleEffect: true,
        lightRays: true,
        colorScheme: {
          Common: "#6B7280",
          Uncommon: "#6B7280",
          Rare: "#3B82F6",
          Epic: "#9333EA",
          Legendary: "#FFD700",
          Mythical: "#FFD700",
        },
        duration: 1200,
      },
      rareSequence: {
        cardFlip: true,
        sparkleEffect: true,
        lightRays: true,
        specialEffects: ["golden_particles", "celebration_burst"],
        extendedDuration: 2000,
        screenShake: true,
        fireworks: true,
        colorScheme: {
          Common: "#6B7280",
          Uncommon: "#6B7280",
          Rare: "#3B82F6",
          Epic: "#9333EA",
          Legendary: "#FFD700",
          Mythical: "#FFD700",
        },
        duration: 1200,
      },
    },
  },
];