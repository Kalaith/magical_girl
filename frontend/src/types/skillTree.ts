// Skill Tree System Types for Magical Girl Game

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  tier: SkillTier;
  maxRank: number;
  currentRank: number;

  // Tree structure
  prerequisites: SkillPrerequisite[];
  unlocks: string[]; // Node IDs that this node unlocks
  position: SkillPosition;

  // Costs and requirements
  costs: SkillCost[];
  requirements: SkillRequirement[];

  // Effects and bonuses
  effects: SkillEffect[];
  scaling: SkillScaling;

  // Visual and metadata
  icon: string;
  color: string;
  category: SkillCategory;
  tags: SkillTag[];

  // State
  isUnlocked: boolean;
  isLearnable: boolean;
  isMaxRank: boolean;

  // Specialization info
  specializationPath?: SpecializationPath;
  branchType?: BranchType;
}

export interface SkillTree {
  id: string;
  name: string;
  description: string;
  characterId: string;
  element: MagicalElement;

  // Tree structure
  nodes: SkillNode[];
  connections: SkillConnection[];
  specializations: SpecializationPath[];

  // Progress tracking
  totalNodesUnlocked: number;
  totalPointsSpent: number;
  availablePoints: number;

  // Tree metadata
  maxTier: SkillTier;
  treeLevel: number;
  masteryLevel: number;

  // Unlock requirements
  unlockRequirements: TreeUnlockRequirement[];
  isUnlocked: boolean;

  // Prestige and reset
  prestigeLevel: number;
  resetCount: number;
  lastReset: number;
}

export interface SpecializationPath {
  id: string;
  name: string;
  description: string;
  element: MagicalElement;
  theme: SpecializationTheme;

  // Path structure
  keyNodes: string[]; // Critical nodes that define this path
  capstoneNode: string; // Ultimate ability of this path
  branchNodes: string[]; // Where this path diverges from others

  // Requirements and progression
  unlockRequirements: PathRequirement[];
  masteryRequirements: PathMasteryRequirement[];

  // Bonuses and effects
  pathBonuses: PathBonus[];
  synergies: PathSynergy[];

  // Visual representation
  color: string;
  icon: string;

  // Progress tracking
  nodesInPath: number;
  nodesUnlocked: number;
  masteryLevel: PathMasteryLevel;

  // Exclusive choices
  conflictsWith: string[]; // Other path IDs that can't be taken with this one
  isExclusive: boolean;
}

export interface SkillConnection {
  fromNode: string;
  toNode: string;
  connectionType: ConnectionType;
  requirements?: SkillRequirement[];
  unlockConditions?: UnlockCondition[];
}

export interface SkillPosition {
  x: number;
  y: number;
  tier: SkillTier;
  branch?: BranchType;
}

export interface SkillPrerequisite {
  type: PrerequisiteType;
  nodeId?: string;
  minimumRank?: number;
  pathId?: string;
  requirement?: string;
}

export interface SkillCost {
  type: CostType;
  amount: number;
  scaling: CostScaling;
  rankMultiplier: number;
}

export interface SkillRequirement {
  type: RequirementType;
  value: number | string;
  description: string;
  checkFunction?: (character: Record<string, string | number | boolean>) => boolean;
}

export interface SkillEffect {
  id: string;
  type: EffectType;
  target: EffectTarget;
  value: number;
  scaling: EffectScaling;
  duration?: number;

  // Effect modifiers
  isPercentage: boolean;
  stackable: boolean;
  maxStacks?: number;

  // Conditional effects
  conditions?: EffectCondition[];
  triggers?: EffectTrigger[];

  // Description and display
  description: string;
  displayFormat: string;
}

export interface SkillScaling {
  baseValue: number;
  perRank: number;
  scalingType: ScalingType;
  softCap?: number;
  hardCap?: number;
  diminishingReturns?: boolean;
}

export interface PathBonus {
  id: string;
  name: string;
  description: string;
  type: BonusType;
  value: number;

  // Activation requirements
  requiredNodes: number;
  requiredMastery: PathMasteryLevel;

  // Bonus effects
  effects: SkillEffect[];
  isActive: boolean;
}

export interface PathSynergy {
  id: string;
  name: string;
  description: string;
  requiredPaths: string[];
  effects: SynergyEffect[];

  // Synergy conditions
  requiresAllPaths: boolean;
  minimumProgress: number; // Percentage of each path completed

  // Visual and metadata
  icon: string;
  rarity: SynergyRarity;
}

export interface SynergyEffect {
  type: EffectType;
  target: EffectTarget;
  value: number;
  description: string;

  // Special synergy properties
  isUnique: boolean;
  replacesSeparateEffects: boolean;
  amplificationFactor: number;
}

export interface TreeUnlockRequirement {
  type: UnlockRequirementType;
  value: number | string;
  description: string;
  isMetRequirement?: boolean;
}

export interface PathRequirement {
  type: PathRequirementType;
  value: number | string;
  description: string;
  nodeIds?: string[];
}

export interface PathMasteryRequirement {
  level: PathMasteryLevel;
  requirements: PathRequirement[];
  rewards: MasteryReward[];
}

export interface MasteryReward {
  type: RewardType;
  value: number | string;
  description: string;
  icon?: string;
}

export interface UnlockCondition {
  type: ConditionType;
  value: string | number;
  description: string;
  checkFunction?: () => boolean;
}

export interface EffectCondition {
  type: ConditionType;
  value: string | number;
  operator: ComparisonOperator;
  description: string;
}

export interface EffectTrigger {
  event: TriggerEvent;
  chance: number;
  cooldown?: number;
  description: string;
}

// Enums and Type Unions
export type SkillTier =
  | "basic"
  | "intermediate"
  | "advanced"
  | "expert"
  | "master"
  | "legendary";

export type SkillCategory =
  | "offensive"
  | "defensive"
  | "support"
  | "utility"
  | "passive"
  | "transformation"
  | "synergy"
  | "mastery";

export type SkillTag =
  | "elemental"
  | "physical"
  | "magical"
  | "healing"
  | "buff"
  | "debuff"
  | "aoe"
  | "single_target"
  | "channeled"
  | "instant"
  | "toggleable"
  | "passive";

export type SpecializationTheme =
  | "destroyer"
  | "protector"
  | "healer"
  | "controller"
  | "striker"
  | "guardian"
  | "sage"
  | "trickster"
  | "berserker"
  | "paladin"
  | "scholar"
  | "assassin";

export type BranchType =
  | "core"
  | "offensive"
  | "defensive"
  | "utility"
  | "hybrid"
  | "specialized"
  | "master"
  | "capstone";

export type ConnectionType =
  | "prerequisite"
  | "upgrade"
  | "branch"
  | "synergy"
  | "exclusive"
  | "optional"
  | "mastery";

export type PrerequisiteType =
  | "node_rank"
  | "total_points"
  | "path_progress"
  | "level"
  | "stat_requirement"
  | "achievement"
  | "special";

export type CostType =
  | "skill_points"
  | "experience"
  | "resources"
  | "special_currency"
  | "achievement_tokens";

export type CostScaling =
  | "linear"
  | "exponential"
  | "logarithmic"
  | "fixed"
  | "custom";

export type RequirementType =
  | "level"
  | "stat"
  | "element_affinity"
  | "transformation_mastery"
  | "combat_victories"
  | "skill_usage"
  | "special_condition";

export type EffectType =
  | "stat_bonus"
  | "stat_multiplier"
  | "ability_enhancement"
  | "new_ability"
  | "passive_effect"
  | "triggered_effect"
  | "transformation_bonus"
  | "synergy_bonus"
  | "special_mechanic";

export type EffectTarget =
  | "self"
  | "allies"
  | "enemies"
  | "all"
  | "party"
  | "specific_role"
  | "element_type"
  | "ability_type";

export type EffectScaling =
  | "linear"
  | "percentage"
  | "exponential"
  | "diminishing"
  | "threshold"
  | "custom";

export type ScalingType =
  | "additive"
  | "multiplicative"
  | "compound"
  | "diminishing"
  | "threshold_based";

export type BonusType =
  | "stat_increase"
  | "ability_unlock"
  | "cost_reduction"
  | "effect_enhancement"
  | "synergy_unlock"
  | "special_feature";

export type SynergyRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic";

export type UnlockRequirementType =
  | "character_level"
  | "story_progress"
  | "achievement"
  | "other_tree_mastery"
  | "special_unlock";

export type PathRequirementType =
  | "nodes_unlocked"
  | "points_spent"
  | "specific_nodes"
  | "tier_reached"
  | "mastery_level";

export type PathMasteryLevel =
  | "novice"
  | "apprentice"
  | "adept"
  | "expert"
  | "master"
  | "grandmaster";

export type RewardType =
  | "skill_points"
  | "stat_bonus"
  | "ability_unlock"
  | "title"
  | "cosmetic"
  | "special_feature";

export type ConditionType =
  | "health_threshold"
  | "mana_threshold"
  | "enemy_type"
  | "combat_state"
  | "buff_active"
  | "time_condition"
  | "custom";

export type ComparisonOperator =
  | "equals"
  | "greater_than"
  | "less_than"
  | "greater_equal"
  | "less_equal"
  | "not_equals";

export type TriggerEvent =
  | "on_attack"
  | "on_defend"
  | "on_cast"
  | "on_heal"
  | "on_critical"
  | "on_kill"
  | "on_transform"
  | "on_synergy";

export type MagicalElement =
  | "fire"
  | "water"
  | "earth"
  | "air"
  | "lightning"
  | "ice"
  | "light"
  | "dark"
  | "neutral";

// Skill Tree Management Types
export interface SkillTreeState {
  trees: Record<string, SkillTree>;
  activeTreeId: string | null;
  globalSkillPoints: number;

  // Presets and builds
  savedBuilds: SkillBuild[];
  activeBuildId: string | null;

  // Learning and progression
  skillLearningQueue: SkillLearningEntry[];
  autoLearnEnabled: boolean;

  // Analysis and recommendations
  lastAnalysis: TreeAnalysis | null;
  recommendedNodes: string[];

  // UI state
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  treeViewMode: TreeViewMode;
  filterSettings: TreeFilterSettings;
}

export interface SkillBuild {
  id: string;
  name: string;
  description: string;
  characterId: string;

  // Build data
  treeStates: Record<string, BuildTreeState>;
  totalPointsAllocated: number;
  buildVersion: string;

  // Metadata
  createdAt: number;
  lastModified: number;
  tags: string[];
  isPublic: boolean;
  rating: number;

  // Build analysis
  strengths: string[];
  weaknesses: string[];
  recommendedUsage: string[];
}

export interface BuildTreeState {
  treeId: string;
  nodeRanks: Record<string, number>;
  selectedPaths: string[];
  pointsSpent: number;
}

export interface SkillLearningEntry {
  nodeId: string;
  targetRank: number;
  priority: number;
  autoLearn: boolean;
  estimatedTime: number;
}

export interface TreeAnalysis {
  treeId: string;
  analyzedAt: number;

  // Efficiency metrics
  pointEfficiency: number;
  pathOptimization: number;
  synergyScore: number;

  // Recommendations
  recommendedNodes: AnalysisRecommendation[];
  inefficientNodes: string[];
  missedSynergies: string[];

  // Build suggestions
  suggestedRespec: boolean;
  alternativeBuilds: string[];
  optimizationTips: string[];
}

export interface AnalysisRecommendation {
  nodeId: string;
  reason: string;
  priority: RecommendationPriority;
  expectedBenefit: number;
}

export type RecommendationPriority = "low" | "medium" | "high" | "critical";

export type TreeViewMode = "full" | "compact" | "paths_only" | "analysis";

export interface TreeFilterSettings {
  showLockedNodes: boolean;
  showUnaffordableNodes: boolean;
  highlightRecommended: boolean;
  filterByCategory: SkillCategory[];
  filterByTier: SkillTier[];
  filterByPath: string[];
  searchQuery: string;
}

// Skill Tree Actions and Events
export interface SkillTreeActions {
  // Node management
  learnSkillNode: (treeId: string, nodeId: string, ranks?: number) => void;
  unlearnSkillNode: (treeId: string, nodeId: string, ranks?: number) => void;
  maxOutNode: (treeId: string, nodeId: string) => void;

  // Tree management
  resetSkillTree: (treeId: string, keepMastery?: boolean) => void;
  prestigeSkillTree: (treeId: string) => void;
  unlockSkillTree: (treeId: string) => void;

  // Path management
  selectSpecializationPath: (treeId: string, pathId: string) => void;
  deselectSpecializationPath: (treeId: string, pathId: string) => void;
  commitToPath: (treeId: string, pathId: string) => void;

  // Build management
  saveBuild: (build: Partial<SkillBuild>) => void;
  loadBuild: (buildId: string) => void;
  deleteBuild: (buildId: string) => void;
  shareBuild: (buildId: string) => string;
  importBuild: (buildCode: string) => void;

  // Analysis and optimization
  analyzeSkillTree: (treeId: string) => TreeAnalysis;
  getRecommendations: (
    treeId: string,
    goal?: string,
  ) => AnalysisRecommendation[];
  optimizeBuild: (
    treeId: string,
    constraints?: OptimizationConstraints,
  ) => BuildTreeState;

  // Learning queue
  addToLearningQueue: (entry: SkillLearningEntry) => void;
  removeFromLearningQueue: (nodeId: string) => void;
  processLearningQueue: () => void;

  // UI actions
  selectNode: (nodeId: string) => void;
  hoverNode: (nodeId: string) => void;
  setTreeViewMode: (mode: TreeViewMode) => void;
  updateFilterSettings: (settings: Partial<TreeFilterSettings>) => void;

  // Utility actions
  calculateNodeCost: (
    treeId: string,
    nodeId: string,
    targetRank: number,
  ) => SkillCost[];
  validateNodeLearning: (treeId: string, nodeId: string) => ValidationResult;
  getAvailableNodes: (treeId: string) => string[];
  getPathProgress: (treeId: string, pathId: string) => PathProgress;
}

export interface OptimizationConstraints {
  maxPoints?: number;
  requiredNodes?: string[];
  avoidNodes?: string[];
  preferredPaths?: string[];
  optimizationGoal?: OptimizationGoal;
}

export type OptimizationGoal =
  | "damage"
  | "survivability"
  | "support"
  | "utility"
  | "balanced"
  | "synergy"
  | "efficiency";

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  type: ErrorType;
  message: string;
  relatedNodes?: string[];
}

export interface ValidationWarning {
  type: WarningType;
  message: string;
  suggestion?: string;
}

export type ErrorType =
  | "insufficient_points"
  | "prerequisites_not_met"
  | "tree_locked"
  | "node_maxed"
  | "conflicting_paths"
  | "invalid_state";

export type WarningType =
  | "inefficient_spending"
  | "missed_synergy"
  | "path_conflict"
  | "overcapping"
  | "suboptimal_order";

export interface PathProgress {
  pathId: string;
  nodesUnlocked: number;
  totalNodes: number;
  pointsSpent: number;
  masteryLevel: PathMasteryLevel;
  nextMilestone: PathMasteryRequirement | null;
  completionPercentage: number;
}

// Events
export interface SkillTreeEvent {
  type: SkillTreeEventType;
  treeId: string;
  nodeId?: string;
  pathId?: string;
  timestamp: number;
  data?: Record<string, string | number | boolean>;
}

export type SkillTreeEventType =
  | "node_learned"
  | "node_unlearned"
  | "node_maxed"
  | "path_selected"
  | "path_committed"
  | "path_mastered"
  | "tree_reset"
  | "tree_prestiged"
  | "tree_unlocked"
  | "synergy_activated"
  | "milestone_reached";
