// Turn-based combat system types
import type { MagicalGirl, MagicalElement, Ability } from "./magicalGirl";

export interface CombatSystem {
  battles: CombatBattle[];
  activeBattle: CombatBattle | null;
  formations: CombatFormation[];
  activeFormation: string | null;
  combatHistory: CombatRecord[];
  combatSettings: CombatSettings;
}

export interface CombatBattle {
  id: string;
  name: string;
  type: BattleType;
  status: BattleStatus;
  playerTeam: CombatParticipant[];
  enemyTeam: CombatParticipant[];
  environment: BattleEnvironment;
  turnOrder: CombatTurnOrder;
  currentTurn: number;
  maxTurns: number;
  turnTimer: number;
  maxTurnTimer: number;
  conditions: BattleCondition[];
  rewards: CombatReward[];
  penalties: CombatPenalty[];
  startTime: number;
  endTime?: number;
  winner?: "player" | "enemy" | "draw";
  reason?: BattleEndReason;
  combatLog: CombatLogEntry[];
}

export type BattleType =
  | "Training"
  | "Mission"
  | "Arena"
  | "Boss"
  | "Event"
  | "Tournament"
  | "Raid"
  | "Challenge";

export type BattleStatus =
  | "Preparing"
  | "Active"
  | "Paused"
  | "Completed"
  | "Abandoned"
  | "Error";

export type BattleEndReason =
  | "Victory"
  | "Defeat"
  | "Timeout"
  | "Surrender"
  | "Draw"
  | "Error"
  | "Disconnect";

export interface CombatParticipant {
  id: string;
  source: "player" | "ai";
  character: MagicalGirl;
  position: CombatPosition;
  currentStats: CombatStats;
  maxStats: CombatStats;
  statusEffects: StatusEffect[];
  equipment: CombatEquipment;
  availableActions: CombatAction[];
  actionQueue: QueuedAction[];
  ai?: CombatAI;
  isTransformed: boolean;
  transformationCharges: number;
  maxTransformationCharges: number;
  shields: CombatShield[];
  barriers: CombatBarrier[];
}

export interface CombatPosition {
  row: number; // 1-3 (front, middle, back)
  column: number; // 1-3 (left, center, right)
  team: "player" | "enemy";
  modifiers: PositionModifier[];
}

export interface PositionModifier {
  type: "damage" | "defense" | "speed" | "accuracy" | "evasion" | "range";
  value: number;
  source: string;
  duration?: number;
}

export interface CombatStats {
  health: number;
  mana: number;
  attack: number;
  defense: number;
  speed: number;
  accuracy: number;
  evasion: number;
  criticalRate: number;
  criticalDamage: number;
  elementalPower: number;
  elementalResistance: { [element in MagicalElement]: number };
}

export interface StatusEffect {
  id: string;
  name: string;
  type: StatusEffectType;
  category: StatusEffectCategory;
  description: string;
  icon: string;
  duration: number;
  maxDuration: number;
  stacks: number;
  maxStacks: number;
  effects: StatusEffectData[];
  dispellable: boolean;
  source: string;
  appliedAt: number;
  tickInterval?: number;
  lastTick?: number;
}

export type StatusEffectType =
  | "Buff"
  | "Debuff"
  | "Neutral"
  | "Transform"
  | "Environmental";

export type StatusEffectCategory =
  | "Physical"
  | "Magical"
  | "Mental"
  | "Elemental"
  | "Special"
  | "Transformation";

export interface StatusEffectData {
  stat: keyof CombatStats | "special";
  modification: number;
  type: "flat" | "percentage" | "multiplier";
  operation: "add" | "subtract" | "multiply" | "divide" | "set";
}

export interface CombatEquipment {
  weapon?: CombatWeapon;
  armor?: CombatArmor;
  accessories: CombatAccessory[];
  temporaryItems: CombatItem[];
}

export interface CombatWeapon {
  id: string;
  name: string;
  type: WeaponType;
  damage: number;
  accuracy: number;
  criticalRate: number;
  range: number;
  element?: MagicalElement;
  abilities: string[];
  durability: number;
  maxDurability: number;
}

export type WeaponType =
  | "Staff"
  | "Wand"
  | "Sword"
  | "Bow"
  | "Orb"
  | "Crystal"
  | "Fan"
  | "Gauntlets"
  | "Wings"
  | "Harp";

export interface CombatArmor {
  id: string;
  name: string;
  type: ArmorType;
  defense: number;
  magicDefense: number;
  resistances: { [element in MagicalElement]?: number };
  abilities: string[];
  durability: number;
  maxDurability: number;
}

export type ArmorType =
  | "Dress"
  | "Robe"
  | "Cloak"
  | "Armor"
  | "Uniform"
  | "Kimono"
  | "Battle_Suit";

export interface CombatAccessory {
  id: string;
  name: string;
  type: AccessoryType;
  effects: StatusEffectData[];
  abilities: string[];
}

export type AccessoryType =
  | "Ring"
  | "Necklace"
  | "Earrings"
  | "Tiara"
  | "Bracelet"
  | "Charm"
  | "Badge";

export interface CombatItem {
  id: string;
  name: string;
  type: ItemType;
  effect: ItemEffect;
  quantity: number;
  usable: boolean;
  consumable: boolean;
}

export type ItemType =
  | "Healing"
  | "Buff"
  | "Debuff"
  | "Utility"
  | "Special"
  | "Transformation";

export interface ItemEffect {
  type: "instant" | "duration" | "triggered";
  target: "self" | "ally" | "enemy" | "all_allies" | "all_enemies" | "area";
  effects: StatusEffectData[];
  duration?: number;
  trigger?: string;
}

export interface CombatAction {
  id: string;
  name: string;
  type: ActionType;
  category: ActionCategory;
  description: string;
  icon: string;
  costs: ActionCost[];
  requirements: ActionRequirement[];
  effects: CombatEffect[];
  targeting: TargetingRule;
  animation: ActionAnimation;
  cooldown: number;
  currentCooldown: number;
  uses: number;
  maxUses?: number;
  castTime: number;
  range: number;
  areaOfEffect?: AreaOfEffect;
  priority: number;
  interruptible: boolean;
  channeled: boolean;
  combo?: ComboData;
}

export type ActionType =
  | "Attack"
  | "Ability"
  | "Spell"
  | "Item"
  | "Move"
  | "Guard"
  | "Transform"
  | "Special";

export type ActionCategory =
  | "Physical"
  | "Magical"
  | "Support"
  | "Utility"
  | "Ultimate"
  | "Counter"
  | "Passive";

export interface ActionCost {
  resource: "mana" | "health" | "energy" | "charges" | "items";
  amount: number;
  percentage?: boolean;
}

export interface ActionRequirement {
  type: "health" | "mana" | "status" | "position" | "target" | "combo";
  condition: string;
  value?: string | number;
}

export interface CombatEffect {
  type: EffectType;
  target: EffectTarget;
  timing: EffectTiming;
  calculation: EffectCalculation;
  modifiers: EffectModifier[];
  conditions: EffectCondition[];
}

export type EffectType =
  | "Damage"
  | "Healing"
  | "Status"
  | "Movement"
  | "Manipulation"
  | "Special";

export type EffectTarget =
  | "Self"
  | "Target"
  | "AllAllies"
  | "AllEnemies"
  | "Random"
  | "Area"
  | "Environment";

export type EffectTiming =
  | "Instant"
  | "StartOfTurn"
  | "EndOfTurn"
  | "OnHit"
  | "OnMiss"
  | "OnDamage"
  | "OnHeal"
  | "Triggered";

export interface EffectCalculation {
  baseValue: number;
  scalingStat?: keyof CombatStats;
  scalingPercentage?: number;
  randomVariance?: number;
  elementalModifier?: boolean;
  criticalModifier?: boolean;
}

export interface EffectModifier {
  condition: string;
  multiplier: number;
  additive?: number;
}

export interface EffectCondition {
  type: "health" | "mana" | "status" | "position" | "element" | "weather";
  operator: "equals" | "greater" | "less" | "contains" | "not";
  value: string | number;
}

export interface TargetingRule {
  type: "Single" | "Multiple" | "Area" | "Line" | "All" | "Random" | "Self";
  count?: number;
  restrictions: TargetRestriction[];
  autoTarget?: boolean;
  requiresLineOfSight?: boolean;
}

export interface TargetRestriction {
  type: "team" | "health" | "status" | "position" | "element" | "type";
  value: string | number;
  exclude?: boolean;
}

export interface AreaOfEffect {
  shape: "Circle" | "Square" | "Line" | "Cone" | "Cross" | "Diamond";
  size: number;
  centerOnTarget: boolean;
  includeCenter: boolean;
}

export interface ActionAnimation {
  type: "Instant" | "Projectile" | "Melee" | "Channeled" | "Transformation";
  duration: number;
  effects: AnimationEffect[];
  sound?: string;
  particles?: ParticleEffect[];
}

export interface AnimationEffect {
  type: "Flash" | "Shake" | "Fade" | "Scale" | "Move" | "Rotate";
  target: "caster" | "target" | "area" | "screen";
  intensity: number;
  duration: number;
  delay?: number;
}

export interface ParticleEffect {
  type: string;
  count: number;
  duration: number;
  position: "caster" | "target" | "area" | "path";
  color?: string;
  size?: number;
}

export interface ComboData {
  requiredActions: string[];
  window: number;
  bonus: CombatEffect[];
}

export interface QueuedAction {
  action: CombatAction;
  target?: CombatParticipant[];
  position?: CombatPosition;
  priority: number;
  castTime: number;
  remainingTime: number;
  interruptible: boolean;
  channeled: boolean;
}

export interface CombatAI {
  type: AIType;
  difficulty: AIDifficulty;
  personality: AIPersonality;
  priorities: AIPriority[];
  behaviors: AIBehavior[];
  reactions: AIReaction[];
  knowledge: AIKnowledge;
}

export type AIType =
  | "Aggressive"
  | "Defensive"
  | "Support"
  | "Balanced"
  | "Adaptive"
  | "Berserker"
  | "Tactical";

export type AIDifficulty =
  | "Beginner"
  | "Easy"
  | "Normal"
  | "Hard"
  | "Expert"
  | "Master"
  | "Nightmare";

export interface AIPersonality {
  aggression: number; // 0-100
  caution: number; // 0-100
  cooperation: number; // 0-100
  adaptability: number; // 0-100
  focus: number; // 0-100
}

export interface AIPriority {
  condition: string;
  weight: number;
  actions: string[];
}

export interface AIBehavior {
  trigger: string;
  probability: number;
  actions: string[];
  cooldown?: number;
}

export interface AIReaction {
  event: string;
  condition?: string;
  response: string[];
  probability: number;
}

export interface AIKnowledge {
  playerPatterns: AIPattern[];
  effectiveStrategies: AIStrategy[];
  threats: AIThreat[];
  opportunities: AIOpportunity[];
}

export interface AIPattern {
  description: string;
  frequency: number;
  lastSeen: number;
  confidence: number;
}

export interface AIStrategy {
  situation: string;
  actions: string[];
  successRate: number;
  lastUsed: number;
}

export interface AIThreat {
  source: string;
  level: number;
  counters: string[];
}

export interface AIOpportunity {
  condition: string;
  advantage: string[];
  priority: number;
}

export interface BattleEnvironment {
  id: string;
  name: string;
  description: string;
  type: EnvironmentType;
  weather: WeatherCondition;
  terrain: TerrainType;
  lighting: LightingCondition;
  magicalField: MagicalFieldType;
  effects: EnvironmentEffect[];
  hazards: EnvironmentHazard[];
  bonuses: EnvironmentBonus[];
  background: string;
  music?: string;
  ambient?: string[];
}

export type EnvironmentType =
  | "City"
  | "Forest"
  | "Beach"
  | "Mountain"
  | "School"
  | "Magical_Realm"
  | "Void"
  | "Arena"
  | "Dungeon";

export interface WeatherCondition {
  type: WeatherType;
  intensity: number;
  effects: StatusEffectData[];
}

export type WeatherType =
  | "Clear"
  | "Rain"
  | "Storm"
  | "Snow"
  | "Fog"
  | "Wind"
  | "Magical_Storm"
  | "Eclipse";

export type TerrainType =
  | "Flat"
  | "Hills"
  | "Water"
  | "Sand"
  | "Ice"
  | "Lava"
  | "Magical"
  | "Floating";

export type LightingCondition =
  | "Bright"
  | "Normal"
  | "Dim"
  | "Dark"
  | "Magical"
  | "Blinding"
  | "Twilight";

export type MagicalFieldType =
  | "Neutral"
  | "Amplified"
  | "Suppressed"
  | "Chaotic"
  | "Elemental"
  | "Void"
  | "Sacred";

export interface EnvironmentEffect {
  name: string;
  description: string;
  trigger: string;
  effect: StatusEffectData[];
  probability: number;
}

export interface EnvironmentHazard {
  name: string;
  description: string;
  type: "Damage" | "Status" | "Movement" | "Resource";
  trigger: string;
  effect: CombatEffect;
  positions?: CombatPosition[];
  recurring: boolean;
  interval?: number;
}

export interface EnvironmentBonus {
  name: string;
  description: string;
  condition: string;
  effect: StatusEffectData[];
  targets: "all" | "player" | "enemy" | "specific";
}

export interface CombatTurnOrder {
  participants: TurnOrderEntry[];
  currentIndex: number;
  phase: TurnPhase;
  speedTiebreaker: "random" | "player_first" | "higher_level";
}

export interface TurnOrderEntry {
  participantId: string;
  speed: number;
  initiative: number;
  delayedTurns: number;
  hasActed: boolean;
  canAct: boolean;
}

export type TurnPhase = "Start" | "Action" | "Resolution" | "End" | "Cleanup";

export interface BattleCondition {
  id: string;
  name: string;
  description: string;
  type: "Victory" | "Defeat" | "Special" | "Time";
  condition: string;
  priority: number;
  hidden: boolean;
  checkTiming: "StartTurn" | "EndTurn" | "OnAction" | "Continuous";
}

export interface CombatReward {
  type: "Experience" | "Currency" | "Item" | "Character" | "Unlock";
  amount?: number;
  item?: string;
  rarity?: string;
  condition?: string;
  bonus?: number;
  description: string;
}

export interface CombatPenalty {
  type: "Experience" | "Currency" | "Item" | "Condition";
  amount?: number;
  condition?: string;
  description: string;
}

export interface CombatShield {
  id: string;
  name: string;
  type: "Physical" | "Magical" | "Elemental" | "Universal";
  strength: number;
  maxStrength: number;
  duration: number;
  source: string;
  regeneration?: number;
  conditions?: string[];
}

export interface CombatBarrier {
  id: string;
  name: string;
  type: "Damage" | "Status" | "Displacement" | "Universal";
  effectiveness: number;
  duration: number;
  source: string;
  conditions?: string[];
}

export interface CombatLogEntry {
  id: string;
  timestamp: number;
  turn: number;
  phase: TurnPhase;
  type: LogEntryType;
  actor?: string;
  target?: string[];
  action?: string;
  effect?: string;
  value?: number;
  critical?: boolean;
  description: string;
  details?: Record<string, string | number | boolean>;
}

export type LogEntryType =
  | "Action"
  | "Damage"
  | "Healing"
  | "Status"
  | "Movement"
  | "Environment"
  | "System"
  | "Victory"
  | "Defeat";

export interface CombatRecord {
  id: string;
  battleId: string;
  timestamp: number;
  duration: number;
  type: BattleType;
  playerTeam: string[];
  enemyTeam: string[];
  result: "Victory" | "Defeat" | "Draw";
  turns: number;
  damageDealt: number;
  damageReceived: number;
  healingDone: number;
  criticalHits: number;
  abilitiesUsed: number;
  itemsUsed: number;
  transformations: number;
  mvp: string;
  rewards: CombatReward[];
  experience: number;
  rating: number;
}

export interface CombatFormation {
  id: string;
  name: string;
  description: string;
  positions: FormationPosition[];
  bonuses: FormationBonus[];
  requirements: FormationRequirement[];
  isDefault: boolean;
  isUnlocked: boolean;
  category: FormationType;
}

export type FormationType =
  | "Offensive"
  | "Defensive"
  | "Balanced"
  | "Support"
  | "Elemental"
  | "Specialist"
  | "Custom";

export interface FormationPosition {
  row: number;
  column: number;
  role: PositionRole;
  modifiers: PositionModifier[];
  restrictions?: PositionRestriction[];
}

export type PositionRole =
  | "Tank"
  | "Damage"
  | "Support"
  | "Healer"
  | "Buffer"
  | "Debuffer"
  | "Flexible";

export interface PositionRestriction {
  type: "element" | "specialization" | "level" | "equipment";
  value: string | number;
  required: boolean;
}

export interface FormationBonus {
  name: string;
  description: string;
  condition: string;
  effect: StatusEffectData[];
  stackable: boolean;
}

export interface FormationRequirement {
  type: "characters" | "elements" | "specializations" | "levels";
  condition: string;
  description: string;
}

export interface CombatSettings {
  autoMode: boolean;
  animationSpeed: number;
  skipAnimations: boolean;
  pauseOnPlayerTurn: boolean;
  showDamageNumbers: boolean;
  showStatusEffects: boolean;
  combatLog: boolean;
  tutorialMode: boolean;
  difficulty: CombatDifficulty;
  aiDelay: number;
  confirmActions: boolean;
  quickCombat: boolean;
}

export type CombatDifficulty =
  | "Story"
  | "Easy"
  | "Normal"
  | "Hard"
  | "Expert"
  | "Nightmare"
  | "Custom";

// Utility types for combat calculations
export interface DamageCalculation {
  baseDamage: number;
  attackStat: number;
  defenseStat: number;
  elementalModifier: number;
  criticalModifier: number;
  randomVariance: number;
  statusModifiers: number;
  equipmentModifiers: number;
  environmentModifiers: number;
  finalDamage: number;
  absorbed: number;
  reflected: number;
  isCritical: boolean;
  isElementalAdvantage: boolean;
  resistances: { [key: string]: number };
}

export interface HealingCalculation {
  baseHealing: number;
  magicStat: number;
  healingModifier: number;
  statusModifiers: number;
  equipmentModifiers: number;
  environmentModifiers: number;
  finalHealing: number;
  overheal: number;
  efficiency: number;
}

export interface CombatAnalytics {
  totalBattles: number;
  victories: number;
  defeats: number;
  winRate: number;
  averageTurns: number;
  averageDuration: number;
  favoriteFormation: string;
  mostUsedCharacter: string;
  mostUsedAbility: string;
  highestDamage: number;
  totalDamageDealt: number;
  totalHealingDone: number;
  criticalHitRate: number;
  preferredBattleTypes: BattleType[];
  difficultyProgress: { [key in CombatDifficulty]: number };
  elementalAffinityStats: { [element in MagicalElement]: CombatElementStats };
}

export interface CombatElementStats {
  timesUsed: number;
  damageDealt: number;
  effectiveness: number;
  advantageWins: number;
  disadvantageLosses: number;
}

// Combat event system
export interface CombatEvent {
  type: string;
  timestamp: number;
  data: Record<string, string | number | boolean>;
  handlers: CombatEventHandler[];
}

export interface CombatEventHandler {
  id: string;
  priority: number;
  condition?: (event: CombatEvent) => boolean;
  handler: (event: CombatEvent) => void;
  once?: boolean;
}

export interface CombatTrigger {
  event: string;
  condition: string;
  effect: CombatEffect;
  source: string;
  priority: number;
}

export interface CombatChain {
  actions: CombatAction[];
  conditions: string[];
  bonuses: CombatEffect[];
  cooldown: number;
  maxUses?: number;
}
