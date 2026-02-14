// Team Formation and Strategy System Types
import type { MagicalGirl, MagicalElement } from './magicalGirl';
// import type { CombatParticipant } from "./combat";

export interface StatBonus {
  health: number;
  mana: number;
  attack: number;
  defense: number;
  speed: number;
  accuracy: number;
  critical: number;
}

export interface FormationSystem {
  formations: Formation[];
  activeFormation: string | null;
  formationHistory: FormationRecord[];
  elementalSynergies: ElementalSynergy[];
  formationTemplates: FormationTemplate[];
  formationSettings: FormationSettings;
}

export interface Formation {
  id: string;
  name: string;
  description: string;
  category: FormationCategory;
  type: FormationType;

  // Visual representation
  icon: string;
  color: string;
  pattern: FormationPattern;

  // Team composition
  positions: FormationPosition[];
  teamSize: number;
  minTeamSize: number;
  maxTeamSize: number;

  // Requirements and restrictions
  requirements: FormationRequirement[];
  restrictions: FormationRestriction[];
  elementRequirements: ElementRequirement[];

  // Bonuses and effects
  bonuses: FormationBonus[];
  synergies: SynergyBonus[];
  penalties: FormationPenalty[];

  // Tactical properties
  tacticalEffects: TacticalEffect[];
  positionModifiers: PositionModifier[];
  combatEffects: FormationCombatEffect[];

  // Metadata
  isUnlocked: boolean;
  isCustom: boolean;
  createdBy?: string;
  createdAt?: number;
  difficulty: FormationDifficulty;
  effectiveness: FormationEffectiveness;
  popularityScore: number;
  winRate: number;
}

export type FormationCategory =
  | 'Offensive'
  | 'Defensive'
  | 'Balanced'
  | 'Support'
  | 'Elemental'
  | 'Specialist'
  | 'Custom';

export type FormationType =
  | 'Standard'
  | 'Advanced'
  | 'Elite'
  | 'Legendary'
  | 'Custom'
  | 'Experimental';

export interface FormationPattern {
  shape: 'Triangle' | 'Line' | 'Square' | 'Diamond' | 'Circle' | 'Star' | 'Custom';
  frontLine: number;
  midLine: number;
  backLine: number;
  flexibility: number; // How much positions can be adjusted
}

export interface FormationPosition {
  id: string;
  row: number; // 1-3 (front, middle, back)
  column: number; // 1-3 (left, center, right)
  priority: number; // Position importance (1-10)

  // Role specifications
  preferredRole: TeamRole;
  alternativeRoles: TeamRole[];
  roleFlexibility: number; // How adaptable this position is

  // Element preferences
  preferredElements: MagicalElement[];
  bannedElements: MagicalElement[];
  elementalWeight: number; // Importance of element matching

  // Stat requirements
  minStats: Partial<FormationStatRequirements>;
  preferredStats: Partial<FormationStatRequirements>;
  statWeights: StatWeight[];

  // Position modifiers
  modifiers: PositionModifier[];
  adjacencyBonuses: AdjacencyBonus[];

  // Special properties
  isLeaderPosition: boolean;
  canBeEmpty: boolean;
  isFlexible: boolean;
  specialRules: string[];
}

export type TeamRole =
  | 'Tank'
  | 'Damage'
  | 'Support'
  | 'Healer'
  | 'Buffer'
  | 'Debuffer'
  | 'Controller'
  | 'Utility'
  | 'Leader';

export interface FormationStatRequirements {
  power: number;
  magic: number;
  defense: number;
  speed: number;
  endurance: number;
  focus: number;
  luck: number;
}

export interface StatWeight {
  stat: keyof FormationStatRequirements;
  weight: number; // 0-1, importance of this stat for the position
  minimum: number; // Minimum required value
  optimal: number; // Optimal value for maximum effectiveness
}

export interface PositionModifier {
  type: 'stat' | 'ability' | 'elemental' | 'tactical' | 'special';
  stat?: keyof FormationStatRequirements;
  modification: number;
  modifierType: 'flat' | 'percentage' | 'multiplier';
  condition?: ModifierCondition;
  source: string;
  duration?: number;
}

export interface ModifierCondition {
  type:
    | 'always'
    | 'combat'
    | 'element_match'
    | 'adjacent_ally'
    | 'enemy_nearby'
    | 'health_threshold';
  value?: string | number;
  operator?: 'equals' | 'greater' | 'less' | 'contains';
}

export interface AdjacencyBonus {
  type: 'stat' | 'ability' | 'synergy' | 'protection';
  requiredAdjacent: TeamRole | MagicalElement | 'any';
  bonus: StatBonus[];
  radius: number; // How many positions away the bonus applies
  stackable: boolean;
  maxStacks?: number;
}

export interface FormationRequirement {
  type: 'level' | 'element' | 'role' | 'stat' | 'mastery' | 'achievement' | 'custom';
  description: string;
  value: string | number;
  optional: boolean;
  weight: number; // How important this requirement is (0-1)
}

export interface FormationRestriction {
  type: 'element' | 'role' | 'character' | 'equipment' | 'level' | 'custom';
  description: string;
  value: string | number;
  severity: 'warning' | 'error' | 'blocking';
}

export interface ElementRequirement {
  element: MagicalElement;
  minimum: number;
  maximum?: number;
  position?: 'any' | 'front' | 'middle' | 'back' | 'specific';
  specificPositions?: number[];
  bonus?: ElementalBonus;
}

export interface ElementalBonus {
  name: string;
  description: string;
  bonuses: StatBonus[];
  conditions: string[];
}

export interface FormationBonus {
  id: string;
  name: string;
  description: string;
  type: 'stat' | 'ability' | 'tactical' | 'elemental' | 'special';

  // Bonus effects
  statBonuses: StatBonus[];
  abilityModifiers: AbilityModifier[];
  specialEffects: SpecialEffect[];

  // Conditions for activation
  conditions: BonusCondition[];
  requirements: FormationRequirement[];

  // Scaling and stacking
  stackable: boolean;
  maxStacks?: number;
  scaling: BonusScaling[];

  // Timing and duration
  activationTiming: 'immediate' | 'combat_start' | 'turn_start' | 'on_action' | 'conditional';
  duration: 'permanent' | 'combat' | 'turn' | 'temporary';
  cooldown?: number;
}

export interface AbilityModifier {
  abilityId: string;
  type: 'enhance' | 'reduce' | 'disable' | 'replace' | 'add' | 'modify';
  value: number;
  description: string;
  conditions?: string[];
}

export interface SpecialEffect {
  id: string;
  name: string;
  description: string;
  type: 'aura' | 'trigger' | 'passive' | 'active' | 'environmental';

  // Effect properties
  effects: EffectData[];
  triggers: EffectTrigger[];
  conditions: EffectCondition[];

  // Targeting
  targets: 'self' | 'team' | 'allies' | 'enemies' | 'all' | 'area' | 'specific';
  range: number;
  areaOfEffect?: number;

  // Visual and audio
  visualEffect?: string;
  audioEffect?: string;
  particle?: string;
}

export interface EffectData {
  type: 'stat' | 'status' | 'damage' | 'healing' | 'movement' | 'special';
  value: number;
  target: string;
  duration?: number;
  probability?: number;
}

export interface EffectTrigger {
  event:
    | 'combat_start'
    | 'turn_start'
    | 'action_used'
    | 'damage_taken'
    | 'ally_defeated'
    | 'custom';
  condition?: string;
  probability: number;
  cooldown?: number;
}

export interface EffectCondition {
  type: 'stat' | 'health' | 'element' | 'position' | 'team_composition' | 'custom';
  operator: 'equals' | 'greater' | 'less' | 'contains' | 'not';
  value: string | number;
}

export interface BonusCondition {
  type:
    | 'full_formation'
    | 'element_diversity'
    | 'role_coverage'
    | 'stat_threshold'
    | 'synergy_active'
    | 'custom';
  description: string;
  value?: string | number;
  weight: number; // How much this condition affects bonus strength
}

export interface BonusScaling {
  factor: 'team_size' | 'element_count' | 'synergy_level' | 'formation_mastery' | 'custom';
  multiplier: number;
  maximum?: number;
  threshold?: number;
}

export interface SynergyBonus {
  id: string;
  name: string;
  description: string;
  type: ElementalSynergyType;

  // Synergy requirements
  requiredElements: MagicalElement[];
  requiredPositions?: number[];
  minCharacters: number;

  // Synergy effects
  bonuses: StatBonus[];
  specialEffects: SpecialEffect[];
  combatEffects: SynergyCombatEffect[];

  // Synergy properties
  level: SynergyLevel;
  tier: SynergyTier;
  rarity: SynergyRarity;

  // Activation and scaling
  activationThreshold: number;
  scalingFactor: number;
  maximumLevel: number;
  currentLevel: number;
  experience: number;
  maxExperience: number;
}

export type ElementalSynergyType =
  | 'Elemental_Harmony' // Same elements
  | 'Elemental_Contrast' // Opposing elements
  | 'Elemental_Trinity' // Three complementary elements
  | 'Elemental_Spectrum' // All different elements
  | 'Prismatic_Unity' // Special rainbow synergy
  | 'Void_Resonance' // Dark/light balance
  | 'Natural_Cycle' // Earth/water/fire/air cycle
  | 'Celestial_Alignment' // Light/celestial combinations
  | 'Custom';

export type SynergyLevel = 'Basic' | 'Enhanced' | 'Superior' | 'Perfect' | 'Transcendent';
export type SynergyTier = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythical';
export type SynergyRarity = 'Standard' | 'Special' | 'Secret' | 'Hidden' | 'Ultimate';

export interface SynergyCombatEffect {
  type: 'damage_boost' | 'defense_boost' | 'special_ability' | 'element_infusion' | 'combo_unlock';
  name: string;
  description: string;
  value: number;
  target: 'self' | 'team' | 'enemies' | 'all';
  trigger: 'passive' | 'active' | 'conditional';
  conditions?: string[];
}

export interface FormationPenalty {
  id: string;
  name: string;
  description: string;
  type: 'stat' | 'ability' | 'elemental' | 'tactical';

  // Penalty effects
  statPenalties: StatPenalty[];
  abilityRestrictions: string[];
  specialRestrictions: string[];

  // Conditions for penalty
  conditions: PenaltyCondition[];
  severity: 'minor' | 'moderate' | 'major' | 'severe';

  // Mitigation
  canBeMitigated: boolean;
  mitigationMethods: string[];
  mitigationCost?: Record<string, number>;
}

export interface StatPenalty {
  stat: keyof FormationStatRequirements;
  reduction: number;
  type: 'flat' | 'percentage' | 'multiplier';
  duration: 'permanent' | 'combat' | 'temporary';
}

export interface PenaltyCondition {
  type:
    | 'missing_role'
    | 'element_imbalance'
    | 'stat_deficiency'
    | 'position_mismatch'
    | 'team_size';
  description: string;
  threshold: number;
  weight: number;
}

export interface TacticalEffect {
  id: string;
  name: string;
  description: string;
  type: 'positioning' | 'movement' | 'targeting' | 'protection' | 'coordination';

  // Effect properties
  range: number;
  duration: 'permanent' | 'combat' | 'turn' | 'action';
  stackable: boolean;

  // Tactical modifiers
  movementBonus?: number;
  targetingBonus?: number;
  protectionBonus?: number;
  coordinationBonus?: number;

  // Conditions and triggers
  triggers: string[];
  conditions: string[];
  requirements: string[];
}

export interface FormationCombatEffect {
  id: string;
  name: string;
  description: string;
  phase: 'pre_combat' | 'combat_start' | 'turn_start' | 'action' | 'turn_end' | 'combat_end';

  // Effect timing
  timing: 'immediate' | 'delayed' | 'continuous' | 'triggered';
  delay?: number;
  duration?: number;

  // Effect properties
  effects: CombatEffectData[];
  targets: CombatTarget[];
  conditions: CombatCondition[];

  // Scaling and stacking
  scalingFactor?: number;
  stackLimit?: number;
  refreshable: boolean;
}

export interface CombatEffectData {
  type: 'stat_modifier' | 'ability_unlock' | 'special_action' | 'environmental' | 'tactical';
  value: number;
  duration: number;
  probability: number;
}

export interface CombatTarget {
  type: 'self' | 'allies' | 'enemies' | 'position' | 'area' | 'random';
  count?: number;
  criteria?: string[];
  priority?: string[];
}

export interface CombatCondition {
  type: 'health_threshold' | 'turn_count' | 'element_present' | 'role_present' | 'custom';
  operator: 'equals' | 'greater' | 'less' | 'contains';
  value: string | number;
  probability?: number;
}

export type FormationDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';

export interface FormationEffectiveness {
  overall: number; // 0-100
  offensive: number;
  defensive: number;
  utility: number;
  flexibility: number;
  synergy: number;

  // Situation-specific effectiveness
  earlyGame: number;
  midGame: number;
  lateGame: number;

  // Combat scenario effectiveness
  singleTarget: number;
  multiTarget: number;
  bossEncounter: number;
  pvpBattle: number;
}

export interface FormationTemplate {
  id: string;
  name: string;
  description: string;
  category: FormationCategory;

  // Template structure
  structure: TemplateStructure;
  guidelines: FormationGuideline[];
  examples: FormationExample[];

  // Usage data
  popularityRank: number;
  successRate: number;
  difficulty: FormationDifficulty;

  // Unlocking
  isUnlocked: boolean;
  unlockRequirements: FormationRequirement[];
}

export interface TemplateStructure {
  positions: TemplatePosition[];
  flexiblePositions: number[];
  mandatoryRoles: TeamRole[];
  recommendedElements: MagicalElement[];
  bannedCombinations: string[];
}

export interface TemplatePosition {
  position: number;
  role: TeamRole;
  element?: MagicalElement;
  priority: number;
  flexibility: number;
  alternatives: TeamRole[];
}

export interface FormationGuideline {
  category: 'positioning' | 'composition' | 'synergy' | 'tactics' | 'timing';
  title: string;
  description: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  examples: string[];
}

export interface FormationExample {
  name: string;
  description: string;
  team: ExampleTeamMember[];
  situation: string;
  effectiveness: number;
  notes: string[];
}

export interface ExampleTeamMember {
  position: number;
  role: TeamRole;
  element: MagicalElement;
  stats: Partial<FormationStatRequirements>;
  notes?: string;
}

export interface FormationRecord {
  id: string;
  formationId: string;
  timestamp: number;

  // Battle context
  battleType: string;
  enemyType: string;
  difficulty: string;
  duration: number;

  // Team composition
  teamMembers: FormationTeamMember[];
  teamSize: number;
  teamLevel: number;

  // Performance
  result: 'victory' | 'defeat' | 'draw';
  performance: FormationPerformance;
  effectiveness: number;

  // Synergies achieved
  activeSynergies: string[];
  synergyLevel: number;
  elementalBalance: ElementalBalance;

  // Analytics
  damageDealt: number;
  damageReceived: number;
  healingDone: number;
  turnsToVictory?: number;
  mvpCharacter?: string;

  // User feedback
  rating?: number;
  notes?: string;
  modifications?: FormationModification[];
}

export interface FormationTeamMember {
  characterId: string;
  position: number;
  role: TeamRole;
  element: MagicalElement;
  level: number;
  contribution: MemberContribution;
  synergiesParticipated: string[];
}

export interface MemberContribution {
  damageContribution: number;
  healingContribution: number;
  utilityContribution: number;
  synergyContribution: number;
  survivalTime: number;
  actionsPerformed: number;
}

export interface FormationPerformance {
  offensive: number;
  defensive: number;
  utility: number;
  coordination: number;
  adaptation: number;
  efficiency: number;
}

export interface ElementalBalance {
  diversity: number; // How many different elements
  harmony: number; // How well elements work together
  coverage: number; // How many element types are covered
  dominance: MagicalElement | null; // Most represented element
  gaps: MagicalElement[]; // Missing important elements
}

export interface FormationModification {
  type: 'position_swap' | 'member_replace' | 'role_change' | 'formation_change';
  description: string;
  reason: string;
  effectiveness: number;
  timestamp: number;
}

export interface ElementalSynergy {
  id: string;
  name: string;
  description: string;
  type: ElementalSynergyType;

  // Element combinations
  primaryElement: MagicalElement;
  secondaryElements: MagicalElement[];
  optionalElements: MagicalElement[];
  bannedElements: MagicalElement[];

  // Synergy requirements
  minimumCharacters: number;
  maximumCharacters?: number;
  positionRequirements: SynergyPositionRequirement[];

  // Synergy effects
  baseBonuses: StatBonus[];
  scalingBonuses: ScalingBonus[];
  specialAbilities: SynergyAbility[];
  visualEffects: SynergyVisualEffect[];

  // Synergy progression
  tiers: SynergyTierData[];
  currentTier: number;
  experience: number;
  maxExperience: number;

  // Discovery and unlocking
  isDiscovered: boolean;
  isUnlocked: boolean;
  discoveryMethod: SynergyDiscoveryMethod;
  unlockRequirements: SynergyRequirement[];

  // Analytics
  usageCount: number;
  successRate: number;
  averageEffectiveness: number;
  lastUsed?: number;
}

export interface SynergyPositionRequirement {
  positions: number[];
  elements: MagicalElement[];
  relationshipType: 'adjacent' | 'same_row' | 'same_column' | 'diagonal' | 'any';
  required: boolean;
}

export interface ScalingBonus {
  stat: keyof FormationStatRequirements;
  baseValue: number;
  scalingFactor: number;
  maxValue: number;
  scalingType: 'linear' | 'exponential' | 'logarithmic' | 'stepped';
}

export interface SynergyAbility {
  id: string;
  name: string;
  description: string;
  type: 'active' | 'passive' | 'triggered' | 'ultimate';

  // Ability properties
  cooldown: number;
  cost: SynergyCost[];
  requirements: string[];

  // Ability effects
  effects: SynergyAbilityEffect[];
  targeting: SynergyTargeting;
  animation: string;

  // Unlocking
  tierRequired: number;
  isUnlocked: boolean;
}

export interface SynergyCost {
  type: 'mana' | 'energy' | 'synergy_points' | 'turn' | 'health';
  amount: number;
  percentage?: boolean;
}

export interface SynergyAbilityEffect {
  type: 'damage' | 'healing' | 'buff' | 'debuff' | 'special' | 'environmental';
  value: number;
  duration?: number;
  probability: number;
  description: string;
}

export interface SynergyTargeting {
  type: 'self' | 'ally' | 'enemy' | 'team' | 'all' | 'area' | 'smart';
  count?: number;
  range?: number;
  criteria?: string[];
}

export interface SynergyVisualEffect {
  type: 'aura' | 'particles' | 'lightning' | 'waves' | 'burst' | 'field';
  color: string;
  intensity: number;
  duration: number;
  pattern: string;
}

export interface SynergyTierData {
  tier: number;
  name: string;
  description: string;
  requiredExperience: number;

  // Tier bonuses
  statMultiplier: number;
  abilityUnlocks: string[];
  specialEffects: string[];
  visualUpgrades: string[];

  // Tier requirements
  requirements: SynergyRequirement[];
}

export type SynergyDiscoveryMethod =
  | 'Combat_Success'
  | 'Experimentation'
  | 'Tutorial'
  | 'Achievement'
  | 'Story_Progression'
  | 'Random_Discovery'
  | 'Community_Sharing'
  | 'Research';

export interface SynergyRequirement {
  type:
    | 'battles_won'
    | 'elements_mastered'
    | 'formation_level'
    | 'character_level'
    | 'achievement'
    | 'custom';
  description: string;
  value: string | number;
  progress?: number;
  completed: boolean;
}

export interface FormationSettings {
  // Auto-formation features
  autoFormationEnabled: boolean;
  autoOptimizeForBattle: boolean;
  autoSynergyDetection: boolean;
  autoPositionOptimization: boolean;

  // Formation assistance
  showFormationHints: boolean;
  showSynergyPreview: boolean;
  showEffectivenessRating: boolean;
  showPositionRecommendations: boolean;

  // Visual preferences
  highlightSynergies: boolean;
  showPositionLines: boolean;
  animateFormationChanges: boolean;
  showElementalConnections: boolean;

  // Alerts and notifications
  alertOnLowSynergy: boolean;
  alertOnSuboptimalFormation: boolean;
  alertOnMissingRoles: boolean;
  alertOnElementImbalance: boolean;

  // Performance settings
  calculateFormationEffectiveness: boolean;
  trackFormationPerformance: boolean;
  saveFormationHistory: boolean;
  enableAdvancedAnalytics: boolean;

  // Experimental features
  enableExperimentalFormations: boolean;
  allowCustomSynergies: boolean;
  enableAIFormationSuggestions: boolean;
  participateInFormationSharing: boolean;
}

// Formation analysis and recommendation types
export interface FormationAnalysis {
  formationId: string;
  teamComposition: AnalysisTeamComposition;
  effectiveness: FormationEffectiveness;
  synergies: AnalysisSynergy[];
  weaknesses: FormationWeakness[];
  recommendations: FormationRecommendation[];
  alternatives: FormationAlternative[];
  score: FormationScore;
}

export interface AnalysisTeamComposition {
  roles: RoleDistribution;
  elements: ElementDistribution;
  levels: LevelDistribution;
  stats: StatDistribution;
  balance: CompositionBalance;
}

export type RoleDistribution = {
  [role in TeamRole]: number;
};

export type ElementDistribution = {
  [element in MagicalElement]: number;
};

export interface LevelDistribution {
  average: number;
  minimum: number;
  maximum: number;
  variance: number;
  gaps: number[];
}

export type StatDistribution = {
  [K in keyof FormationStatRequirements]: {
    total: number;
    average: number;
    distribution: number[];
    balance: number;
  };
};

export interface CompositionBalance {
  roleBalance: number; // 0-100
  elementBalance: number; // 0-100
  levelBalance: number; // 0-100
  statBalance: number; // 0-100
  overall: number; // 0-100
}

export interface AnalysisSynergy {
  synergyId: string;
  level: number;
  participants: string[];
  contribution: number;
  potential: number;
  recommendations: string[];
}

export interface FormationWeakness {
  type:
    | 'role_gap'
    | 'element_weakness'
    | 'stat_deficiency'
    | 'position_vulnerability'
    | 'synergy_loss';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
  impact: number;
  solutions: WeaknessSolution[];
}

export interface WeaknessSolution {
  type: 'character_swap' | 'position_change' | 'formation_change' | 'equipment_upgrade';
  description: string;
  cost: number;
  effectiveness: number;
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
}

export interface FormationRecommendation {
  type: 'improvement' | 'optimization' | 'alternative' | 'synergy' | 'counter';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  expectedImprovement: number;
  implementation: RecommendationImplementation;
}

export interface RecommendationImplementation {
  difficulty: 'trivial' | 'easy' | 'moderate' | 'hard' | 'expert';
  requirements: string[];
  steps: string[];
  estimatedTime: number;
  cost?: Record<string, number>;
}

export interface FormationAlternative {
  formationId: string;
  name: string;
  description: string;
  improvements: string[];
  tradeoffs: string[];
  suitability: number;
  requiredChanges: AlternativeChange[];
}

export interface AlternativeChange {
  type: 'character' | 'position' | 'role' | 'formation';
  description: string;
  impact: number;
  feasibility: number;
}

export interface FormationScore {
  overall: number; // 0-100
  components: ScoreComponents;
  breakdown: ScoreBreakdown;
  ranking: ScoreRanking;
}

export interface ScoreComponents {
  teamComposition: number;
  synergy: number;
  balance: number;
  effectiveness: number;
  flexibility: number;
  potential: number;
}

export interface ScoreBreakdown {
  bonuses: ScoreBonus[];
  penalties: ScorePenalty[];
  factors: ScoreFactor[];
}

export interface ScoreBonus {
  source: string;
  value: number;
  description: string;
}

export interface ScorePenalty {
  source: string;
  value: number;
  description: string;
}

export interface ScoreFactor {
  name: string;
  weight: number;
  contribution: number;
  description: string;
}

export interface ScoreRanking {
  percentile: number;
  rank: number;
  totalFormations: number;
  category: string;
  improvements: string[];
}

// Formation builder and management types
export interface FormationBuilder {
  currentFormation: Formation | null;
  availableCharacters: MagicalGirl[];
  constraints: BuilderConstraints;
  recommendations: BuilderRecommendation[];
  preview: FormationPreview;
  history: BuilderAction[];
}

export interface BuilderConstraints {
  maxTeamSize: number;
  requiredRoles: TeamRole[];
  bannedElements: MagicalElement[];
  levelRequirements: LevelConstraint[];
  customRules: CustomRule[];
}

export interface LevelConstraint {
  type: 'minimum' | 'maximum' | 'average' | 'range';
  value: number | [number, number];
  applies: 'individual' | 'team' | 'role';
}

export interface CustomRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  enforcement: 'warning' | 'error' | 'blocking';
}

export interface BuilderRecommendation {
  type: 'character' | 'position' | 'synergy' | 'optimization';
  priority: number;
  title: string;
  description: string;
  action: RecommendationAction;
}

export interface RecommendationAction {
  type: 'add_character' | 'move_character' | 'swap_characters' | 'change_formation';
  parameters: Record<string, string | number | boolean>;
  expectedBenefit: number;
}

export interface FormationPreview {
  effectiveness: FormationEffectiveness;
  synergies: PreviewSynergy[];
  warnings: PreviewWarning[];
  stats: PreviewStats;
  visualization: FormationVisualization;
}

export interface PreviewSynergy {
  name: string;
  type: ElementalSynergyType;
  level: number;
  participants: string[];
  bonuses: string[];
}

export interface PreviewWarning {
  type: 'missing_role' | 'weak_synergy' | 'imbalanced_elements' | 'level_mismatch';
  severity: 'info' | 'warning' | 'error';
  message: string;
  suggestions: string[];
}

export interface PreviewStats {
  totalPower: number;
  averageLevel: number;
  elementDistribution: ElementDistribution;
  roleDistribution: RoleDistribution;
  synergyScore: number;
  balanceScore: number;
}

export interface FormationVisualization {
  layout: VisualizationLayout;
  connections: VisualizationConnection[];
  highlights: VisualizationHighlight[];
  effects: VisualizationEffect[];
}

export interface VisualizationLayout {
  positions: VisualizationPosition[];
  spacing: number;
  scale: number;
  orientation: 'horizontal' | 'vertical';
}

export interface VisualizationPosition {
  id: string;
  x: number;
  y: number;
  character?: string;
  role?: TeamRole;
  element?: MagicalElement;
  isEmpty: boolean;
  isRecommended: boolean;
}

export interface VisualizationConnection {
  from: string;
  to: string;
  type: 'synergy' | 'adjacency' | 'leadership' | 'protection';
  strength: number;
  color: string;
  style: 'solid' | 'dashed' | 'dotted' | 'animated';
}

export interface VisualizationHighlight {
  positionId: string;
  type: 'warning' | 'recommendation' | 'synergy' | 'optimal';
  color: string;
  intensity: number;
  animation?: string;
}

export interface VisualizationEffect {
  type: 'aura' | 'particles' | 'field' | 'pulse';
  positions: string[];
  color: string;
  intensity: number;
  duration: number;
  animation: string;
}

export interface BuilderAction {
  type:
    | 'add_character'
    | 'remove_character'
    | 'move_character'
    | 'change_formation'
    | 'apply_template';
  timestamp: number;
  description: string;
  parameters: Record<string, string | number | boolean>;
  canUndo: boolean;
  canRedo: boolean;
}

// Formation events and notifications
export interface FormationEvent {
  type: FormationEventType;
  timestamp: number;
  formationId?: string;
  characterId?: string;
  data?: Record<string, string | number | boolean>;
}

export type FormationEventType =
  | 'formation_created'
  | 'formation_modified'
  | 'formation_activated'
  | 'synergy_discovered'
  | 'synergy_activated'
  | 'effectiveness_changed'
  | 'performance_recorded'
  | 'recommendation_generated'
  | 'weakness_detected'
  | 'achievement_unlocked';

// Export utility types
export type FormationId = string;
export type SynergyId = string;
export type PositionId = number;
export type TeamMemberId = string;
