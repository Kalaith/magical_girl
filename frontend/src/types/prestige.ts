// Prestige System Types for End-Game Character Development

export interface PrestigeSystem {
  // Character prestige tracking
  characterPrestige: Record<string, CharacterPrestige>;

  // Global prestige metrics
  totalPrestigeLevels: number;
  prestigePoints: number;
  eternityPoints: number;

  // Prestige upgrades and bonuses
  purchasedUpgrades: string[];
  activePerks: PrestigePerk[];

  // Milestone tracking
  prestigeMilestones: PrestigeMilestone[];
  achievedMilestones: string[];

  // Prestige currencies and resources
  prestigeCurrencies: PrestigeCurrency[];

  // Rebirth and transcendence
  rebirthCount: number;
  transcendenceLevel: number;
  lastPrestigeTime: number;

  // Prestige statistics
  prestigeStats: PrestigeStatistics;
}

export interface CharacterPrestige {
  characterId: string;

  // Prestige levels
  currentPrestigeLevel: number;
  maxPrestigeLevel: number;

  // Experience and progression
  prestigeExperience: number;
  totalPrestigeExperience: number;

  // Prestige history
  prestigeHistory: PrestigeEvent[];
  timesPrestigd: number;
  firstPrestigeTime: number;
  lastPrestigeTime: number;

  // Prestige bonuses
  permanentBonuses: PermanentBonus[];
  prestigeMultipliers: PrestigeMultiplier[];

  // Specialization prestige
  specializationMastery: Record<string, SpecializationMastery>;

  // Prestige unlocks
  unlockedFeatures: string[];
  unlockedAbilities: string[];

  // Legacy effects
  legacyPoints: number;
  legacyBonuses: LegacyBonus[];

  // Prestige requirements for next level
  nextPrestigeRequirements: PrestigeRequirement[];
  canPrestige: boolean;
}

export interface PrestigePerk {
  id: string;
  name: string;
  description: string;
  category: PrestigeCategory;
  tier: PrestigeTier;

  // Costs and requirements
  cost: PrestigeCost[];
  requirements: PrestigeRequirement[];

  // Effects
  effects: PrestigeEffect[];
  passiveEffects: PassiveEffect[];

  // Upgrade progression
  currentLevel: number;
  maxLevel: number;
  levelBonuses: LevelBonus[];

  // Rarity and availability
  rarity: PrestigeRarity;
  isLimited: boolean;
  expirationTime?: number;

  // Dependencies
  prerequisites: string[];
  conflictsWith: string[];
  enhances: string[];

  // Visual and metadata
  icon: string;
  color: string;
  tags: PrestigeTag[];
}

export interface PrestigeMilestone {
  id: string;
  name: string;
  description: string;
  category: MilestoneCategory;

  // Achievement conditions
  requirements: MilestoneRequirement[];
  progressTracking: ProgressTracker[];

  // Rewards
  rewards: MilestoneReward[];
  unlocks: string[];

  // Milestone properties
  isRepeatable: boolean;
  maxCompletions?: number;
  currentCompletions: number;

  // Difficulty and prestige
  difficulty: MilestoneDifficulty;
  prestigeValue: number;

  // Time constraints
  timeLimit?: number;
  seasonalEvent?: boolean;
}

export interface PrestigeCurrency {
  id: string;
  name: string;
  description: string;
  icon: string;

  // Current amounts
  current: number;
  lifetime: number;
  maximum?: number;

  // Generation and sources
  generationRate: number;
  sources: CurrencySource[];

  // Exchange rates
  exchangeRates: Record<string, number>;

  // Properties
  isLimited: boolean;
  decaysOverTime: boolean;
  decayRate?: number;
}

export interface PermanentBonus {
  id: string;
  name: string;
  description: string;
  source: BonusSource;

  // Bonus effects
  type: BonusType;
  value: number;
  target: BonusTarget;

  // Bonus properties
  isPercentage: boolean;
  stackable: boolean;
  maxStacks?: number;
  currentStacks: number;

  // Acquisition info
  acquiredAt: number;
  prestigeLevelAcquired: number;
}

export interface PrestigeMultiplier {
  id: string;
  name: string;
  description: string;

  // Multiplier properties
  baseMultiplier: number;
  currentMultiplier: number;
  scalingFactor: number;

  // Application
  appliesTo: MultiplierTarget;
  conditions: MultiplierCondition[];

  // Scaling and limits
  softCap?: number;
  hardCap?: number;
  diminishingReturns: boolean;
}

export interface SpecializationMastery {
  specializationId: string;
  masteryLevel: number;
  masteryPoints: number;

  // Mastery bonuses
  masteryBonuses: MasteryBonus[];
  transcendentAbilities: string[];

  // Mastery progression
  timesMastered: number;
  perfectRuns: number;
  masteryRating: number;

  // Mastery requirements for next level
  nextMasteryRequirements: MasteryRequirement[];
}

export interface LegacyBonus {
  id: string;
  name: string;
  description: string;

  // Legacy properties
  generationObtained: number;
  legacyPower: number;

  // Effects
  effects: LegacyEffect[];
  auraEffects: AuraEffect[];

  // Inheritance
  inheritable: boolean;
  inheritanceConditions: InheritanceCondition[];
}

export interface PrestigeEvent {
  id: string;
  type: PrestigeEventType;
  timestamp: number;

  // Event data
  prestigeLevel: number;
  resourcesGained: Record<string, number>;
  bonusesObtained: string[];

  // Performance metrics
  timeToPrestige: number;
  efficiencyRating: number;
  completionRate: number;

  // Special achievements
  achievements: string[];
  milestones: string[];
}

export interface PrestigeRequirement {
  type: RequirementType;
  value: number | string;
  description: string;

  // Requirement properties
  isMandatory: boolean;
  alternativeRequirements?: PrestigeRequirement[];

  // Progress tracking
  currentProgress?: number;
  isCompleted: boolean;
}

export interface PrestigeEffect {
  id: string;
  type: EffectType;
  target: EffectTarget;
  value: number;

  // Effect properties
  duration: number;
  isTemporary: boolean;
  stackable: boolean;

  // Scaling
  scaling: EffectScaling;
  conditions: EffectCondition[];

  // Application
  applicationMode: ApplicationMode;
  triggerEvents: TriggerEvent[];
}

export interface PassiveEffect {
  id: string;
  name: string;
  description: string;

  // Effect properties
  effectType: PassiveEffectType;
  magnitude: number;
  isPercentage: boolean;

  // Conditions and triggers
  activeConditions: ActiveCondition[];
  passiveTriggers: PassiveTrigger[];

  // Scaling and progression
  scalesWithPrestige: boolean;
  scalingFormula?: string;
}

export interface LevelBonus {
  level: number;
  bonuses: BonusData[];
  specialUnlocks: string[];
  description: string;
}

export interface ProgressTracker {
  metric: string;
  currentValue: number;
  targetValue: number;
  progressPercentage: number;
  isCompleted: boolean;
}

export interface MilestoneReward {
  type: RewardType;
  value: number | string;
  description: string;
  isUnique: boolean;
}

export interface CurrencySource {
  sourceType: SourceType;
  baseAmount: number;
  scalingFactor: number;
  conditions: SourceCondition[];
}

export interface MultiplierCondition {
  type: ConditionType;
  value: number;
  description: string;
}

export interface MasteryBonus {
  id: string;
  name: string;
  description: string;
  effects: MasteryEffect[];
}

export interface MasteryRequirement {
  type: MasteryRequirementType;
  value: number;
  description: string;
}

export interface LegacyEffect {
  type: LegacyEffectType;
  power: number;
  scope: EffectScope;
  description: string;
}

export interface AuraEffect {
  name: string;
  radius: number;
  effects: AreaEffect[];
  visualEffect: string;
}

export interface InheritanceCondition {
  type: InheritanceType;
  requirement: string;
  value: number;
}

export interface PrestigeStatistics {
  // General statistics
  totalPrestigeTime: number;
  averagePrestigeTime: number;
  fastestPrestige: number;
  slowestPrestige: number;

  // Efficiency metrics
  overallEfficiency: number;
  resourceEfficiency: number;
  timeEfficiency: number;

  // Achievement statistics
  uniqueAchievements: number;
  totalMilestones: number;
  perfectRuns: number;

  // Currency statistics
  totalPrestigePointsEarned: number;
  totalEternityPointsEarned: number;
  totalLegacyPointsEarned: number;

  // Progression statistics
  highestPrestigeLevel: number;
  mostMasteredSpecialization: string;
  longestPlaySession: number;
}

// Enums and Type Unions
export type PrestigeCategory =
  | "resource"
  | "combat"
  | "progression"
  | "unlocks"
  | "quality_of_life"
  | "cosmetic"
  | "special"
  | "transcendent";

export type PrestigeTier =
  | "basic"
  | "advanced"
  | "expert"
  | "master"
  | "grandmaster"
  | "transcendent"
  | "eternal"
  | "infinite";

export type PrestigeRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic"
  | "transcendent"
  | "unique";

export type PrestigeTag =
  | "automation"
  | "multiplier"
  | "unlock"
  | "quality_of_life"
  | "power"
  | "efficiency"
  | "bonus"
  | "special"
  | "limited";

export type MilestoneCategory =
  | "progression"
  | "achievement"
  | "collection"
  | "mastery"
  | "speed"
  | "efficiency"
  | "special"
  | "seasonal";

export type MilestoneDifficulty =
  | "trivial"
  | "easy"
  | "moderate"
  | "hard"
  | "extreme"
  | "nightmare"
  | "impossible"
  | "transcendent";

export type BonusSource =
  | "prestige_level"
  | "milestone"
  | "achievement"
  | "purchase"
  | "event"
  | "legacy"
  | "mastery"
  | "special";

export type BonusType =
  | "stat_increase"
  | "multiplier"
  | "unlock"
  | "quality_improvement"
  | "automation"
  | "efficiency"
  | "special_ability"
  | "cosmetic";

export type BonusTarget =
  | "all_stats"
  | "specific_stat"
  | "resource_generation"
  | "experience_gain"
  | "combat_power"
  | "progression_speed"
  | "special_systems"
  | "global";

export type MultiplierTarget =
  | "experience"
  | "resources"
  | "damage"
  | "defense"
  | "speed"
  | "luck"
  | "all_stats"
  | "special_actions";

export type PrestigeEventType =
  | "level_up"
  | "milestone_achieved"
  | "perk_purchased"
  | "mastery_gained"
  | "rebirth"
  | "transcendence"
  | "special_unlock"
  | "legacy_inherited";

export type RequirementType =
  | "level"
  | "total_experience"
  | "resource_amount"
  | "achievement"
  | "time_played"
  | "prestige_count"
  | "mastery_level"
  | "special_condition";

export type EffectType =
  | "stat_bonus"
  | "multiplier"
  | "unlock"
  | "automation"
  | "quality_improvement"
  | "special_ability"
  | "currency_generation";

export type EffectTarget =
  | "self"
  | "all_characters"
  | "specific_character"
  | "party"
  | "global"
  | "system"
  | "environment";

export type EffectScaling =
  | "linear"
  | "exponential"
  | "logarithmic"
  | "polynomial"
  | "custom"
  | "stepped"
  | "diminishing";

export type ApplicationMode =
  | "immediate"
  | "gradual"
  | "triggered"
  | "conditional"
  | "periodic"
  | "permanent"
  | "temporary";

export type TriggerEvent =
  | "prestige"
  | "level_up"
  | "combat_start"
  | "combat_end"
  | "achievement"
  | "milestone"
  | "time_interval"
  | "special_action";

export type PassiveEffectType =
  | "stat_modifier"
  | "resource_generation"
  | "automation"
  | "quality_enhancement"
  | "unlock_condition"
  | "special_ability"
  | "global_modifier";

export type ActiveCondition =
  | "prestige_level"
  | "character_level"
  | "resource_amount"
  | "time_condition"
  | "achievement_status"
  | "mastery_level"
  | "special_state";

export type PassiveTrigger =
  | "always_active"
  | "combat_only"
  | "non_combat"
  | "specific_conditions"
  | "time_based"
  | "event_based"
  | "state_dependent";

export type RewardType =
  | "prestige_points"
  | "eternity_points"
  | "legacy_points"
  | "currency"
  | "unlock"
  | "perk"
  | "bonus"
  | "cosmetic"
  | "special_item";

export type SourceType =
  | "prestige_action"
  | "milestone_completion"
  | "time_played"
  | "achievements"
  | "special_actions"
  | "mastery_progress"
  | "efficiency_bonus";

export type ConditionType =
  | "prestige_level"
  | "character_state"
  | "resource_threshold"
  | "time_condition"
  | "achievement_requirement"
  | "mastery_requirement"
  | "special_condition";

export type MasteryRequirementType =
  | "specialization_completion"
  | "perfect_runs"
  | "time_limit"
  | "efficiency_rating"
  | "special_achievement"
  | "mastery_points"
  | "transcendent_action";

export type LegacyEffectType =
  | "permanent_bonus"
  | "inheritance_multiplier"
  | "special_unlock"
  | "aura_effect"
  | "transcendent_ability"
  | "reality_alteration"
  | "meta_progression";

export type EffectScope =
  | "character"
  | "party"
  | "global"
  | "meta"
  | "transcendent"
  | "infinite";

export type InheritanceType =
  | "automatic"
  | "conditional"
  | "achievement_based"
  | "choice_based"
  | "time_based"
  | "performance_based"
  | "special_unlock";

export type SourceCondition = {
  type: string;
  value: number;
  description: string;
};

export type BonusData = {
  type: string;
  value: number;
  description: string;
};

export type MasteryEffect = {
  type: string;
  value: number;
  description: string;
};

export type AreaEffect = {
  type: string;
  magnitude: number;
  description: string;
};

export type PrestigeCost = {
  currency: string;
  amount: number;
  scaling?: number;
};

export type MilestoneRequirement = {
  type: string;
  value: number;
  description: string;
};

export type EffectCondition = {
  type: string;
  value: number;
  description: string;
};

// Prestige System Actions
export interface PrestigeActions {
  // Core prestige actions
  prestigeCharacter: (characterId: string) => Promise<boolean>;
  rebirthCharacter: (characterId: string) => Promise<boolean>;
  transcendCharacter: (characterId: string) => Promise<boolean>;

  // Perk and upgrade management
  purchasePrestigePerk: (perkId: string, characterId?: string) => boolean;
  upgradePrestigePerk: (perkId: string, levels?: number) => boolean;
  refundPrestigePerk: (perkId: string) => boolean;

  // Milestone and achievement tracking
  checkMilestoneProgress: (milestoneId: string) => ProgressTracker[];
  claimMilestoneReward: (milestoneId: string) => MilestoneReward[];
  trackPrestigeAchievement: (achievementId: string, progress: number) => void;

  // Currency and resource management
  earnPrestigePoints: (amount: number, source: string) => void;
  spendPrestigePoints: (amount: number, purpose: string) => boolean;
  exchangePrestigeCurrency: (
    fromCurrency: string,
    toCurrency: string,
    amount: number,
  ) => boolean;

  // Legacy and inheritance
  createLegacyBonus: (bonusData: Partial<LegacyBonus>) => string;
  inheritLegacyBonuses: (
    characterId: string,
    sourceCharacterId: string,
  ) => void;
  manageLegacyInheritance: (
    characterId: string,
    rules: InheritanceCondition[],
  ) => void;

  // Mastery and specialization
  improveMastery: (
    characterId: string,
    specializationId: string,
    points: number,
  ) => void;
  achievePerfectMastery: (
    characterId: string,
    specializationId: string,
  ) => void;
  unlockTranscendentAbility: (
    characterId: string,
    abilityId: string,
  ) => boolean;

  // Analysis and optimization
  analyzePrestigeEfficiency: (characterId: string) => PrestigeAnalysis;
  recommendPrestigeStrategy: (
    characterId: string,
    goals: PrestigeGoal[],
  ) => PrestigeRecommendation[];
  simulatePrestigeOutcome: (
    characterId: string,
    strategy: PrestigeStrategy,
  ) => PrestigeSimulation;

  // Statistics and tracking
  updatePrestigeStatistics: () => void;
  getPrestigeLeaderboard: (category: string) => PrestigeLeaderboardEntry[];
  exportPrestigeData: (characterId: string) => string;
  importPrestigeData: (characterId: string, data: string) => boolean;

  // Quality of life
  autoPrestigeToggle: (characterId: string, enabled: boolean) => void;
  setPrestigeNotifications: (settings: PrestigeNotificationSettings) => void;
  optimizePrestigePerks: (characterId: string, budget: number) => string[];
}

// Additional interfaces for prestige system
export interface PrestigeAnalysis {
  efficiency: number;
  timeToNextPrestige: number;
  recommendedActions: string[];
  bottlenecks: string[];
  optimization: PrestigeOptimization;
}

export interface PrestigeGoal {
  type: string;
  priority: number;
  target: number;
  description: string;
}

export interface PrestigeRecommendation {
  action: string;
  priority: number;
  expectedBenefit: number;
  description: string;
  requirements: string[];
}

export interface PrestigeStrategy {
  characterId: string;
  actions: PrestigeAction[];
  timeline: number;
  expectedOutcome: PrestigeOutcome;
}

export interface PrestigeAction {
  type: string;
  timing: number;
  parameters: Record<string, any>;
}

export interface PrestigeOutcome {
  prestigePointsGained: number;
  timeRequired: number;
  bonusesObtained: string[];
  milestonesAchieved: string[];
}

export interface PrestigeSimulation {
  iterations: number;
  averageOutcome: PrestigeOutcome;
  bestCase: PrestigeOutcome;
  worstCase: PrestigeOutcome;
  confidence: number;
}

export interface PrestigeLeaderboardEntry {
  characterId: string;
  playerName: string;
  prestigeLevel: number;
  totalPrestigePoints: number;
  achievements: number;
  ranking: number;
}

export interface PrestigeNotificationSettings {
  notifyOnMilestone: boolean;
  notifyOnPrestigeAvailable: boolean;
  notifyOnPerkAffordable: boolean;
  notifyOnAchievement: boolean;
  customNotifications: CustomNotification[];
}

export interface CustomNotification {
  condition: string;
  message: string;
  priority: number;
  enabled: boolean;
}

export interface PrestigeOptimization {
  recommendedPerks: string[];
  expectedBenefit: number;
  timeToPayoff: number;
  riskAssessment: string;
}
