// Recruitment and Gacha system types
import type { MagicalGirl, Rarity } from './magicalGirl';

// Re-export Rarity for components that import from recruitment
export type { Rarity } from './magicalGirl';

export interface RecruitmentSystem {
  currencies: RecruitmentCurrencies;
  banners: RecruitmentBanner[];
  activeBanners: string[];
  pityCounters: { [bannerId: string]: PityCounter };
  summonHistory: SummonRecord[];
  guaranteedCounter: { [bannerId: string]: number };
}

export interface RecruitmentCurrencies {
  friendshipPoints: number;
  premiumGems: number;
  eventTokens: number;
  summonTickets: number;
  rareTickets: number;
  legendaryTickets: number;
  dreamshards: number;
}

export interface RecruitmentBanner {
  id: string;
  name: string;
  description: string;
  type: BannerType;
  rarity: BannerRarity;
  startDate: number;
  endDate?: number;
  isActive: boolean;
  featuredGirls: string[]; // Magical Girl IDs
  rates: GachaRates;
  costs: BannerCosts;
  pitySystem: PitySystemConfig;
  guarantees: GuaranteeConfig[];
  maxSummons?: number;
  requirements?: BannerRequirement[];
  rewards: BannerReward[];
  artwork: BannerArtwork;
  animation: BannerAnimation;
}

export type BannerType =
  | 'Standard'
  | 'Limited'
  | 'Event'
  | 'Newcomer'
  | 'Seasonal'
  | 'Collaboration'
  | 'Rerun';

export type BannerRarity = 'Common' | 'Special' | 'Premium' | 'Legendary';

export type GachaRates = {
  [K in Rarity]: number; // Percentage (0-100)
};

export interface BannerCosts {
  single: RecruitmentCost;
  ten: RecruitmentCost;
  special?: RecruitmentCost; // For special multi-pulls
}

export interface RecruitmentCost {
  primary: CurrencyCost; // Main cost
  alternatives?: CurrencyCost[]; // Alternative payment methods
  discount?: CostDiscount;
}

export interface CurrencyCost {
  currency: keyof RecruitmentCurrencies;
  amount: number;
  displayName: string;
}

export interface CostDiscount {
  type: 'percentage' | 'flat' | 'first_time' | 'daily';
  value: number;
  condition?: string;
  remainingUses?: number;
}

export interface PitySystemConfig {
  enabled: boolean;
  maxCounter: number; // Pulls until guaranteed
  targetRarity: Rarity;
  carryOver: boolean; // Carries to next banner of same type
  resetOnPull: boolean; // Resets when target rarity is pulled
  softPity?: SoftPityConfig;
}

export interface SoftPityConfig {
  startAt: number; // When soft pity begins
  rateIncrease: number; // Rate increase per pull
  maxIncrease: number; // Maximum rate boost
}

export interface PityCounter {
  current: number;
  max: number;
  lastReset: number;
  carryOverFrom?: string; // Previous banner ID
}

export interface GuaranteeConfig {
  type: GuaranteeType;
  condition: GuaranteeCondition;
  reward: GuaranteeReward;
  maxTriggers?: number;
  currentTriggers: number;
}

export type GuaranteeType =
  | 'featured_character'
  | 'minimum_rarity'
  | 'new_character'
  | 'element_type'
  | 'first_pull'
  | 'daily_bonus';

export interface GuaranteeCondition {
  type: 'pulls_count' | 'consecutive_misses' | 'daily_first' | 'special_event';
  value: number;
  resetType: 'daily' | 'weekly' | 'banner' | 'never';
}

export interface GuaranteeReward {
  type: 'specific_character' | 'rarity_minimum' | 'bonus_currency' | 'extra_pull';
  value: number;
  description: string;
}

export interface BannerRequirement {
  type: 'level' | 'mission_completion' | 'achievement' | 'time_played';
  value: number;
  description: string;
}

export interface BannerReward {
  type: 'milestone' | 'completion' | 'special';
  requirement: number; // Number of pulls
  reward: BannerRewardItem;
  claimed: boolean;
}

export interface BannerRewardItem {
  type: 'currency' | 'character' | 'item' | 'cosmetic';
  id: string;
  amount?: number;
  description: string;
}

export interface BannerArtwork {
  background: string;
  foreground?: string;
  featuredCharacter?: string;
  effects?: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface BannerAnimation {
  summonSequence: SummonAnimation;
  revealSequence: RevealAnimation;
  rareSequence?: RareRevealAnimation;
}

export interface SummonAnimation {
  type: 'standard' | 'special' | 'ultimate';
  duration: number;
  effects: AnimationEffect[];
  music?: string;
  voiceover?: string;
}

export interface RevealAnimation {
  cardFlip: boolean;
  sparkleEffect: boolean;
  lightRays: boolean;
  colorScheme: { [K in Rarity]: string };
  duration: number;
}

export interface RareRevealAnimation extends RevealAnimation {
  specialEffects: string[];
  extendedDuration: number;
  screenShake: boolean;
  fireworks: boolean;
  customMusic?: string;
}

export interface AnimationEffect {
  type: 'particle' | 'light' | 'motion' | 'screen';
  name: string;
  intensity: number;
  duration: number;
  delay?: number;
}

export interface SummonRecord {
  id: string;
  bannerId: string;
  timestamp: number;
  results: SummonResult[];
  cost: RecruitmentCost;
  pityCounter: number;
  wasGuaranteed: boolean;
  eventContext?: string;
}

export interface SummonResult {
  characterId: string;
  character: MagicalGirl;
  rarity: Rarity;
  isNew: boolean;
  isDuplicate: boolean;
  wasFeatured: boolean;
  wasGuaranteed: boolean;
  rarityAnimation: boolean;
  position: number; // Position in multi-pull
}

export interface SummonSession {
  id: string;
  bannerId: string;
  startTime: number;
  endTime?: number;
  totalPulls: number;
  results: SummonResult[];
  totalCost: { [K in keyof RecruitmentCurrencies]: number };
  rarityBreakdown: { [K in Rarity]: number };
  newCharacters: number;
  duplicates: number;
  pityActivated: boolean;
  guaranteesActivated: string[];
  satisfaction: number; // Player satisfaction rating 1-5
}

export interface DuplicateConversion {
  enabled: boolean;
  rates: { [K in Rarity]: DuplicateRate };
  currencies: (keyof RecruitmentCurrencies)[];
}

export interface DuplicateRate {
  currency: keyof RecruitmentCurrencies;
  baseAmount: number;
  bonusMultiplier: number;
  specialRewards?: DuplicateSpecialReward[];
}

export interface DuplicateSpecialReward {
  requiredDuplicates: number;
  reward: BannerRewardItem;
  oneTime: boolean;
  claimed: boolean;
}

export interface RecruitmentEvent {
  id: string;
  name: string;
  description: string;
  type: 'rate_up' | 'discount' | 'bonus_currency' | 'special_banner' | 'guaranteed_pull';
  startDate: number;
  endDate: number;
  isActive: boolean;
  bannerIds: string[];
  effects: EventEffect[];
  requirements?: EventRequirement[];
  rewards: EventReward[];
}

export interface EventEffect {
  type: 'rate_increase' | 'cost_decrease' | 'bonus_currency' | 'extra_guarantee';
  target: 'all' | 'specific_banner' | 'specific_rarity';
  value: number;
  description: string;
}

export interface EventRequirement {
  type: 'participation' | 'pulls_count' | 'specific_character' | 'daily_login';
  value: number;
  description: string;
}

export interface EventReward {
  type: 'milestone' | 'participation' | 'completion';
  requirement: EventRequirement;
  reward: BannerRewardItem;
  claimed: boolean;
}

export interface RecruitmentStatistics {
  totalPulls: number;
  totalSpent: { [K in keyof RecruitmentCurrencies]: number };
  rarityStats: { [K in Rarity]: number };
  bannerStats: { [bannerId: string]: BannerStatistics };
  averagePityCounter: number;
  luckiestPull: SummonRecord;
  unluckiestStreak: number;
  favoriteTime: string; // Time of day when player summons most
  totalCharactersObtained: number;
  duplicatesConverted: number;
}

export interface BannerStatistics {
  pullCount: number;
  spent: { [K in keyof RecruitmentCurrencies]: number };
  charactersObtained: string[];
  pityActivations: number;
  averageCostPerCharacter: number;
  satisfactionRating: number;
}

export interface WishlistSystem {
  enabled: boolean;
  maxCharacters: number;
  currentWishes: string[]; // Character IDs
  bonusRates: { [characterId: string]: number };
  guaranteeAfter: number; // Pulls until guaranteed wishlist character
  currentProgress: number;
}

export interface SummonSimulator {
  enabled: boolean;
  maxSimulations: number;
  results: SimulationResult[];
  savedScenarios: SimulationScenario[];
}

export interface SimulationScenario {
  id: string;
  name: string;
  bannerId: string;
  pullCount: number;
  startingPity: number;
  targetCharacters: string[];
  budgetLimit?: { [K in keyof RecruitmentCurrencies]: number };
}

export interface SimulationResult {
  scenarioId: string;
  timestamp: number;
  pullsRequired: number;
  costEstimate: { [K in keyof RecruitmentCurrencies]: number };
  successProbability: number;
  alternativeOutcomes: AlternativeOutcome[];
}

export interface AlternativeOutcome {
  characters: string[];
  probability: number;
  pullsRequired: number;
  cost: { [K in keyof RecruitmentCurrencies]: number };
}

// Recruitment shop for exchanging duplicates/currency
export interface RecruitmentShop {
  categories: ShopCategory[];
  rotationSchedule?: ShopRotation;
  specialOffers: SpecialOffer[];
  playerPurchases: { [itemId: string]: number };
}

export interface ShopCategory {
  id: string;
  name: string;
  description: string;
  items: ShopItem[];
  requirements?: ShopRequirement[];
  refreshSchedule?: RefreshSchedule;
}

export interface ShopItem {
  id: string;
  type: 'character' | 'currency' | 'item' | 'cosmetic';
  name: string;
  description: string;
  cost: { [K in keyof RecruitmentCurrencies]: number };
  stock: number;
  maxPurchases: number;
  currentPurchases: number;
  discount?: number;
  requirements?: ShopRequirement[];
  rarity?: Rarity;
}

export interface ShopRequirement {
  type: 'level' | 'achievement' | 'banner_completion' | 'character_owned';
  value: number;
  description: string;
}

export interface RefreshSchedule {
  type: 'daily' | 'weekly' | 'monthly' | 'fixed';
  interval?: number;
  nextRefresh: number;
}

export interface ShopRotation {
  current: string; // Category ID
  schedule: RotationEntry[];
  nextRotation: number;
}

export interface RotationEntry {
  categoryId: string;
  startDate: number;
  endDate: number;
  specialTheme?: string;
}

export interface SpecialOffer {
  id: string;
  name: string;
  description: string;
  type: 'limited_time' | 'first_purchase' | 'milestone' | 'comeback';
  originalCost: { [K in keyof RecruitmentCurrencies]: number };
  discountedCost: { [K in keyof RecruitmentCurrencies]: number };
  items: ShopItem[];
  startDate: number;
  endDate: number;
  maxPurchases: number;
  currentPurchases: number;
  requirements?: ShopRequirement[];
  badge?: string; // "BEST VALUE", "LIMITED", etc.
}
