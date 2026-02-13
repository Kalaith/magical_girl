// Game configuration constants
export const gameConfig = {
  // Resource generation rates (per second)
  RESOURCE_RATES: {
    MANA_REGENERATION: 1,
    energyRegeneration: 2,
    EXPERIENCE_MULTIPLIER: 1,
  },

  // Level progression
  LEVEL_PROGRESSION: {
    BASE_EXP: 100,
    EXP_MULTIPLIER: 1.5,
    MAX_LEVEL: 100,
  },

  // Mission timers (in minutes)
  MISSION_DURATION: {
    TUTORIAL: 5,
    EASY: 15,
    MEDIUM: 30,
    HARD: 60,
    BOSS: 90,
  },

  // Training costs and durations
  TRAINING: {
    BASE_COST: 10,
    COST_MULTIPLIER: 1.2,
    BASE_DURATION: 10, // minutes
  },

  // Achievement thresholds
  ACHIEVEMENTS: {
    MISSIONS_COMPLETED: [1, 5, 10, 25, 50, 100],
    LEVEL_REACHED: [5, 10, 20, 30, 50, 75, 100],
    TOTAL_MANA_SPENT: [100, 500, 1000, 5000, 10000],
  },

  // UI Settings
  UI: {
    NOTIFICATION_DURATION: 3000, // ms
    AUTO_SAVE_INTERVAL: 30000, // ms
    ANIMATION_DURATION: 300, // ms
  },

  // Recruitment costs and gacha mechanics
  RECRUITMENT: {
    BASIC_COST: 100,
    PREMIUM_COST: 500,
    LEGENDARY_COST: 1000,
    RECRUITMENT_DELAY_MS: 2000,

    // Gacha rates (in percent)
    RATES: {
      BASIC: {
        LEGENDARY: 0.5,
        EPIC: 3.0,
        RARE: 15.0,
        COMMON: 81.5,
      },
      PREMIUM: {
        LEGENDARY: 2.0,
        EPIC: 8.0,
        RARE: 30.0,
        COMMON: 60.0,
      },
      LIMITED: {
        LEGENDARY: 3.0,
        EPIC: 12.0,
        RARE: 35.0,
        COMMON: 50.0,
      },
    },

    // Pity systems
    PITY: {
      BASIC: {
        SOFT_PITY_START: 50,
        HARD_PITY: 100,
        SOFT_PITY_MULTIPLIER: 1.5,
      },
      PREMIUM: {
        SOFT_PITY_START: 25,
        HARD_PITY: 50,
        SOFT_PITY_MULTIPLIER: 2.0,
      },
      LIMITED: {
        SOFT_PITY_START: 20,
        HARD_PITY: 40,
        SOFT_PITY_MULTIPLIER: 2.5,
      },
    },

    // Pull counts
    SINGLE_PULL: 1,
    MULTI_PULL: 10,
    MULTI_PULL_DISCOUNT: 0.9, // 10% discount for multi pulls
  },

  MISSION_STATS: {
    COMPLETED_REWARD_ESTIMATE: 50,
  },

  TIMERS: {
    GAME_TICK_INTERVAL_MS: 1000,
  },

  // Mission costs
  MISSION_ENERGY_COST: 30,
} as const;

export const VIEWS = {
  DASHBOARD: "dashboard",
  MAGICAL_GIRLS: "collection",
  RECRUITMENT: "recruitment",
  COMBAT: "combat",
  TRAINING: "training",
  MISSIONS: "missions",
  ACHIEVEMENTS: "achievements",
  SKILL_TREE: "skill-tree",
  CUSTOMIZATION: "customization",
  PRESTIGE: "prestige",
  SAVE_SYSTEM: "save-system",
  ENHANCED_SETTINGS: "enhanced-settings",
  SETTINGS: "settings",
} as const;

export type ViewType = (typeof VIEWS)[keyof typeof VIEWS];
