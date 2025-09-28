// Recruitment and gacha system configuration
import type {
  RecruitmentBanner,
  BannerType,
  BannerRarity,
  GachaRates,
  RecruitmentCost,
  BannerCosts,
  PitySystemConfig,
} from "../types/recruitment";
import type { MagicalGirl, Rarity } from "../types/magicalGirl";

export const RECRUITMENT_CONFIG = {
  // Standard gacha rates
  standardRates: {
    Common: 40,
    Uncommon: 35,
    Rare: 15,
    Epic: 7,
    Legendary: 2.5,
    Mythical: 0.5,
  } as GachaRates,

  // Enhanced rates for limited banners
  limitedRates: {
    Common: 30,
    Uncommon: 30,
    Rare: 20,
    Epic: 12,
    Legendary: 6,
    Mythical: 2,
  } as GachaRates,

  // Event banner rates
  eventRates: {
    Common: 25,
    Uncommon: 25,
    Rare: 25,
    Epic: 15,
    Legendary: 8,
    Mythical: 2,
  } as GachaRates,

  // Standard pity system
  standardPity: {
    enabled: true,
    maxCounter: 90,
    targetRarity: "Legendary" as Rarity,
    carryOver: true,
    resetOnPull: true,
    softPity: {
      startAt: 75,
      rateIncrease: 6,
      maxIncrease: 100,
    },
  } as PitySystemConfig,

  // Limited banner pity (more generous)
  limitedPity: {
    enabled: true,
    maxCounter: 80,
    targetRarity: "Legendary" as Rarity,
    carryOver: false,
    resetOnPull: true,
    softPity: {
      startAt: 65,
      rateIncrease: 8,
      maxIncrease: 100,
    },
  } as PitySystemConfig,

  // Standard costs
  standardCosts: {
    single: {
      primary: {
        currency: "friendshipPoints" as const,
        amount: 300,
        displayName: "Friendship Points",
      },
      alternatives: [
        {
          currency: "summonTickets" as const,
          amount: 1,
          displayName: "Summon Ticket",
        },
      ],
    },
    ten: {
      primary: {
        currency: "friendshipPoints" as const,
        amount: 2700, // 10% discount
        displayName: "Friendship Points",
      },
      alternatives: [
        {
          currency: "summonTickets" as const,
          amount: 10,
          displayName: "Summon Tickets",
        },
      ],
    },
  } as BannerCosts,

  // Premium costs
  premiumCosts: {
    single: {
      primary: {
        currency: "premiumGems" as const,
        amount: 160,
        displayName: "Premium Gems",
      },
      alternatives: [
        {
          currency: "rareTickets" as const,
          amount: 1,
          displayName: "Rare Ticket",
        },
      ],
    },
    ten: {
      primary: {
        currency: "premiumGems" as const,
        amount: 1440, // 10% discount
        displayName: "Premium Gems",
      },
      alternatives: [
        {
          currency: "rareTickets" as const,
          amount: 10,
          displayName: "Rare Tickets",
        },
      ],
    },
  } as BannerCosts,

  // Available banners
  banners: [
    {
      id: "standard_permanent",
      name: "Eternal Dreams",
      description:
        "The standard recruitment banner featuring all available magical girls with balanced rates.",
      type: "Standard" as BannerType,
      rarity: "Common" as BannerRarity,
      startDate: 0, // Always available
      isActive: true,
      featuredGirls: [],
      rates: {
        Common: 40,
        Uncommon: 35,
        Rare: 15,
        Epic: 7,
        Legendary: 2.5,
        Mythical: 0.5,
      } as GachaRates,
      costs: {
        single: {
          primary: {
            currency: "friendshipPoints" as const,
            amount: 300,
            displayName: "Friendship Points",
          },
          alternatives: [
            {
              currency: "summonTickets" as const,
              amount: 1,
              displayName: "Summon Ticket",
            },
          ],
        },
        ten: {
          primary: {
            currency: "friendshipPoints" as const,
            amount: 2700,
            displayName: "Friendship Points",
          },
          alternatives: [
            {
              currency: "summonTickets" as const,
              amount: 10,
              displayName: "Summon Tickets",
            },
          ],
        },
      },
      pitySystem: {
        enabled: true,
        maxCounter: 90,
        targetRarity: "Legendary" as Rarity,
        carryOver: true,
        resetOnPull: true,
        softPity: {
          startAt: 75,
          rateIncrease: 6,
          maxIncrease: 100,
        },
      },
      guarantees: [
        {
          type: "minimum_rarity" as const,
          condition: {
            type: "pulls_count",
            value: 10,
            resetType: "banner",
          },
          reward: {
            type: "rarity_minimum",
            value: "Rare",
            description: "Guaranteed Rare or higher in every 10-pull",
          },
          currentTriggers: 0,
        },
      ],
      rewards: [
        {
          type: "milestone",
          requirement: 50,
          reward: {
            type: "currency",
            id: "premiumGems",
            amount: 500,
            description: "500 Premium Gems",
          },
          claimed: false,
        },
        {
          type: "milestone",
          requirement: 100,
          reward: {
            type: "currency",
            id: "rareTickets",
            amount: 5,
            description: "5 Rare Tickets",
          },
          claimed: false,
        },
      ],
      artwork: {
        background: "/images/banners/standard_bg.jpg",
        colors: {
          primary: "#4F46E5",
          secondary: "#7C3AED",
          accent: "#F59E0B",
        },
      },
      animation: {
        summonSequence: {
          type: "standard",
          duration: 3000,
          effects: [
            {
              type: "particle",
              name: "sparkles",
              intensity: 0.5,
              duration: 2000,
            },
            {
              type: "light",
              name: "shine",
              intensity: 0.3,
              duration: 1000,
              delay: 1000,
            },
          ],
        },
        revealSequence: {
          cardFlip: true,
          sparkleEffect: true,
          lightRays: false,
          colorScheme: {
            Common: "#9CA3AF",
            Uncommon: "#10B981",
            Rare: "#3B82F6",
            Epic: "#8B5CF6",
            Legendary: "#F59E0B",
            Mythical: "#EF4444",
          },
          duration: 2000,
        },
      },
    },

    {
      id: "limited_elemental_masters",
      name: "Elemental Masters",
      description:
        "Limited banner featuring powerful elemental magical girls with increased rates!",
      type: "Limited" as BannerType,
      rarity: "Premium" as BannerRarity,
      startDate: Date.now(),
      endDate: Date.now() + 14 * 24 * 60 * 60 * 1000, // 14 days
      isActive: true,
      featuredGirls: [
        "sakura_fire",
        "marina_water",
        "terra_earth",
        "zephyr_air",
      ],
      rates: {
        Common: 30,
        Uncommon: 30,
        Rare: 20,
        Epic: 12,
        Legendary: 6,
        Mythical: 2,
      } as GachaRates,
      costs: {
        single: {
          primary: {
            currency: "premiumGems" as const,
            amount: 160,
            displayName: "Premium Gems",
          },
          alternatives: [
            {
              currency: "rareTickets" as const,
              amount: 1,
              displayName: "Rare Ticket",
            },
          ],
        },
        ten: {
          primary: {
            currency: "premiumGems" as const,
            amount: 1440,
            displayName: "Premium Gems",
          },
          alternatives: [
            {
              currency: "rareTickets" as const,
              amount: 10,
              displayName: "Rare Tickets",
            },
          ],
        },
      },
      pitySystem: {
        enabled: true,
        maxCounter: 80,
        targetRarity: "Legendary" as Rarity,
        carryOver: false,
        resetOnPull: true,
        softPity: {
          startAt: 65,
          rateIncrease: 8,
          maxIncrease: 100,
        },
      },
      guarantees: [
        {
          type: "minimum_rarity" as const,
          condition: {
            type: "pulls_count",
            value: 10,
            resetType: "banner",
          },
          reward: {
            type: "rarity_minimum",
            value: "Epic",
            description: "Guaranteed Epic or higher in every 10-pull",
          },
          currentTriggers: 0,
        },
        {
          type: "featured_character" as const,
          condition: {
            type: "consecutive_misses",
            value: 2,
            resetType: "banner",
          },
          reward: {
            type: "specific_character",
            value: "featured",
            description: "Guaranteed featured character every 2nd Legendary",
          },
          currentTriggers: 0,
        },
      ],
      rewards: [
        {
          type: "milestone",
          requirement: 20,
          reward: {
            type: "currency",
            id: "eventTokens",
            amount: 200,
            description: "200 Event Tokens",
          },
          claimed: false,
        },
        {
          type: "milestone",
          requirement: 50,
          reward: {
            type: "character",
            id: "selector_4star",
            description: "Choose any 4-star character",
          },
          claimed: false,
        },
      ],
      artwork: {
        background: "/images/banners/elemental_masters_bg.jpg",
        foreground: "/images/banners/elemental_masters_fg.png",
        featuredCharacter: "/images/characters/sakura_fire_featured.jpg",
        effects: [
          "fire_particles",
          "water_ripples",
          "earth_crystals",
          "wind_swirls",
        ],
        colors: {
          primary: "#EF4444",
          secondary: "#3B82F6",
          accent: "#F59E0B",
        },
      },
      animation: {
        summonSequence: {
          type: "special",
          duration: 4000,
          effects: [
            {
              type: "particle",
              name: "elemental_burst",
              intensity: 0.8,
              duration: 3000,
            },
            {
              type: "screen",
              name: "flash",
              intensity: 0.6,
              duration: 500,
              delay: 2000,
            },
          ],
          music: "elemental_summon.mp3",
        },
        revealSequence: {
          cardFlip: true,
          sparkleEffect: true,
          lightRays: true,
          colorScheme: {
            Common: "#9CA3AF",
            Uncommon: "#10B981",
            Rare: "#3B82F6",
            Epic: "#8B5CF6",
            Legendary: "#F59E0B",
            Mythical: "#EF4444",
          },
          duration: 2500,
        },
        rareSequence: {
          cardFlip: true,
          sparkleEffect: true,
          lightRays: true,
          colorScheme: {
            Common: "#9CA3AF",
            Uncommon: "#10B981",
            Rare: "#3B82F6",
            Epic: "#8B5CF6",
            Legendary: "#F59E0B",
            Mythical: "#EF4444",
          },
          duration: 2500,
          specialEffects: ["rainbow_burst", "screen_shake", "confetti"],
          extendedDuration: 4000,
          screenShake: true,
          fireworks: true,
          customMusic: "legendary_reveal.mp3",
        },
      },
    },

    {
      id: "newcomer_welcome",
      name: "Newcomer Welcome",
      description:
        "Special banner for new players with guaranteed high-rarity pulls!",
      type: "Newcomer" as BannerType,
      rarity: "Special" as BannerRarity,
      startDate: 0,
      maxSummons: 20,
      isActive: true,
      featuredGirls: ["luna_light", "stella_star", "aurora_dawn"],
      rates: {
        Common: 20,
        Uncommon: 25,
        Rare: 25,
        Epic: 20,
        Legendary: 8,
        Mythical: 2,
      } as GachaRates,
      costs: {
        single: {
          primary: {
            currency: "friendshipPoints" as const,
            amount: 150, // 50% discount
            displayName: "Friendship Points",
          },
          discount: {
            type: "percentage",
            value: 50,
            condition: "newcomer_bonus",
          },
        },
        ten: {
          primary: {
            currency: "friendshipPoints" as const,
            amount: 1350, // 50% discount
            displayName: "Friendship Points",
          },
          discount: {
            type: "percentage",
            value: 50,
            condition: "newcomer_bonus",
          },
        },
      },
      pitySystem: {
        enabled: true,
        maxCounter: 10,
        targetRarity: "Epic" as Rarity,
        carryOver: false,
        resetOnPull: false,
      },
      guarantees: [
        {
          type: "minimum_rarity" as const,
          condition: {
            type: "pulls_count",
            value: 1,
            resetType: "never",
          },
          reward: {
            type: "rarity_minimum",
            value: "Rare",
            description: "First pull guaranteed Rare or higher",
          },
          maxTriggers: 1,
          currentTriggers: 0,
        },
        {
          type: "featured_character" as const,
          condition: {
            type: "pulls_count",
            value: 10,
            resetType: "never",
          },
          reward: {
            type: "specific_character",
            value: "featured",
            description: "10th pull guaranteed featured character",
          },
          maxTriggers: 1,
          currentTriggers: 0,
        },
      ],
      requirements: [
        {
          type: "level",
          value: 1,
          description: "Available for new players",
        },
      ],
      rewards: [],
      artwork: {
        background: "/images/banners/newcomer_bg.jpg",
        featuredCharacter: "/images/characters/luna_light_welcome.jpg",
        colors: {
          primary: "#06B6D4",
          secondary: "#8B5CF6",
          accent: "#F59E0B",
        },
      },
      animation: {
        summonSequence: {
          type: "standard",
          duration: 3000,
          effects: [
            {
              type: "particle",
              name: "welcome_stars",
              intensity: 0.7,
              duration: 2500,
            },
          ],
        },
        revealSequence: {
          cardFlip: true,
          sparkleEffect: true,
          lightRays: false,
          colorScheme: {
            Common: "#9CA3AF",
            Uncommon: "#10B981",
            Rare: "#3B82F6",
            Epic: "#8B5CF6",
            Legendary: "#F59E0B",
            Mythical: "#EF4444",
          },
          duration: 2000,
        },
      },
    },
  ] as RecruitmentBanner[],

  // Character pool for recruitment (simplified - in real app would be larger)
  characterPool: [
    // Common characters
    {
      id: "mina_common",
      name: "Mina Sparkle",
      element: "Light" as const,
      rarity: "Common" as Rarity,
      specialization: "Support" as const,
      stats: {
        power: 120,
        defense: 110,
        speed: 100,
        magic: 140,
        wisdom: 130,
        charm: 160,
        courage: 100,
        luck: 110,
        endurance: 120,
        focus: 130,
      },
      abilities: [],
      equipment: {
        weapon: undefined,
        accessory: undefined,
        outfit: undefined,
        charm: undefined,
      },
      transformation: {
        id: "basic_light",
        name: "Radiant Form",
        level: 1,
        maxLevel: 5,
        isUnlocked: true,
        requirements: [],
        forms: [],
        currentForm: 0,
        experience: 0,
        experienceToNext: 100,
        mastery: {
          level: 1,
          experience: 0,
          bonuses: [],
        },
      },
      personality: {
        traits: [],
        mood: "Happy" as const,
        relationships: [],
        preferences: {
          favoriteActivity: "Training" as const,
          favoriteMission: "Protection" as const,
          favoriteTime: "Morning" as const,
          favoriteLocation: "City" as const,
          specialInterests: ["friendship", "helping others"],
        },
        dialogues: {
          greetings: ["Hello! Ready to make the world brighter?"],
          training: ["Let's work together!"],
          missions: ["I'll protect everyone!"],
          idle: ["Humming a cheerful tune..."],
          levelUp: ["I feel stronger!"],
          transformation: ["Light of hope, shine bright!"],
          victory: ["We did it together!"],
          defeat: ["Next time, we'll be stronger..."],
          special: [],
        },
      },
      backstory:
        "A cheerful magical girl who believes in the power of friendship and hope.",
      avatar: {
        base: {
          hair: {
            style: "twin_tails",
            color: "#FFD700",
            length: "shoulder",
            texture: "wavy",
          },
          eyes: {
            shape: "round",
            color: "#87CEEB",
            expression: "cheerful",
          },
          outfit: {
            base: "school_uniform",
            colors: ["#FFFFFF", "#FFB6C1"],
            pattern: "solid",
            accessories: ["ribbon"],
          },
          accessories: [],
          pose: "cheerful_wave",
          background: "city_park",
          effects: [],
        },
        expressions: {},
        outfits: {},
        accessories: {},
        current: {
          expression: "happy",
          outfit: "default",
          accessories: [],
          pose: "default",
          effects: [],
        },
      },
    } as BannerCosts,

    // Rare character example
    {
      id: "sakura_fire",
      name: "Sakura Flameheart",
      element: "Fire" as const,
      rarity: "Legendary" as Rarity,
      specialization: "Combat" as const,
      stats: {
        power: 200,
        defense: 150,
        speed: 180,
        magic: 220,
        wisdom: 160,
        charm: 140,
        courage: 200,
        luck: 120,
        endurance: 170,
        focus: 180,
      },
      abilities: [],
      equipment: {
        weapon: undefined,
        accessory: undefined,
        outfit: undefined,
        charm: undefined,
      },
      transformation: {
        id: "phoenix_flame",
        name: "Phoenix Flame Form",
        level: 1,
        maxLevel: 10,
        isUnlocked: true,
        requirements: [],
        forms: [],
        currentForm: 0,
        experience: 0,
        experienceToNext: 300,
        mastery: {
          level: 1,
          experience: 0,
          bonuses: [],
        },
      },
      personality: {
        traits: [],
        mood: "Determined" as const,
        relationships: [],
        preferences: {
          favoriteActivity: "Training" as const,
          favoriteMission: "Combat" as const,
          favoriteTime: "Afternoon" as const,
          favoriteLocation: "Mountains" as const,
          specialInterests: ["martial arts", "fire magic"],
        },
        dialogues: {
          greetings: ["The flames of determination burn within me!"],
          training: ["Let's push our limits!"],
          missions: ["I'll burn away all evil!"],
          idle: ["Practicing fire techniques..."],
          levelUp: ["My flames grow stronger!"],
          transformation: ["Phoenix of justice, rise!"],
          victory: ["Evil cannot withstand righteous fire!"],
          defeat: ["I need to train harder..."],
          special: [],
        },
      },
      backstory:
        "A powerful fire magical girl with an unbreakable spirit and burning determination.",
      avatar: {
        base: {
          hair: {
            style: "long_flowing",
            color: "#DC143C",
            length: "long",
            texture: "straight",
          },
          eyes: {
            shape: "determined",
            color: "#FF4500",
            expression: "fierce",
          },
          outfit: {
            base: "battle_dress",
            colors: ["#DC143C", "#FFD700"],
            pattern: "flame",
            accessories: ["fire_emblem"],
          },
          accessories: [],
          pose: "battle_ready",
          background: "volcano",
          effects: ["fire_aura"],
        },
        expressions: {},
        outfits: {},
        accessories: {},
        current: {
          expression: "determined",
          outfit: "battle",
          accessories: ["fire_emblem"],
          pose: "ready",
          effects: ["flame_aura"],
        },
      },
    } as BannerCosts,
  ],
};

// Helper functions for recruitment calculations
export const RECRUITMENT_HELPERS = {
  calculatePityBonus: (
    counter: number,
    softPityStart: number,
    rateIncrease: number,
    maxIncrease: number,
  ): number => {
    if (counter < softPityStart) return 0;
    return Math.min((counter - softPityStart) * rateIncrease, maxIncrease);
  },

  getRarityColor: (rarity: Rarity): string => {
    const colors = {
      Common: "#9CA3AF",
      Uncommon: "#10B981",
      Rare: "#3B82F6",
      Epic: "#8B5CF6",
      Legendary: "#F59E0B",
      Mythical: "#EF4444",
    };
    return colors[rarity];
  },

  getRarityWeight: (rarity: Rarity): number => {
    const weights = {
      Common: 1,
      Uncommon: 2,
      Rare: 4,
      Epic: 8,
      Legendary: 16,
      Mythical: 32,
    };
    return weights[rarity];
  },

  calculateAverageCost: (
    targetRarity: Rarity,
    rates: GachaRates,
    cost: number,
  ): number => {
    const rate = rates[targetRarity] / 100;
    return cost / rate;
  },

  simulatePulls: (
    bannerId: string,
    targetRarity: Rarity,
    maxPulls: number = 1000,
  ): number => {
    // Simplified simulation - in real app would use actual banner config
    const baseRate = RECRUITMENT_CONFIG.standardRates[targetRarity] / 100;

    for (let i = 1; i <= maxPulls; i++) {
      if (Math.random() < baseRate) {
        return i;
      }
    }

    return maxPulls;
  },
};
