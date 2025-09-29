// Game configuration constants
export const GAME_CONFIG = {
  // Resource generation rates (per second)
  RESOURCE_RATES: {
    MANA_REGENERATION: 1,
    ENERGY_REGENERATION: 2,
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

  // Recruitment costs
  RECRUITMENT: {
    BASIC_COST: 100,
    PREMIUM_COST: 500,
    LEGENDARY_COST: 1000,
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
