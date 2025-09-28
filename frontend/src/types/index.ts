// Re-export all types for easy importing

// Game types (re-export all)
export * from "./game";
export type { GameConfig, GameState } from "./game";

// Magical Girl types (specific exports to avoid conflicts)
export type {
  MagicalGirl,
  MagicalGirlStats,
  MagicalElement,
  Rarity,
  Specialization,
  Ability,
  AbilityType,
  AbilityCost,
  SpecialCost,
  AbilityEffect,
  AbilityRequirement,
  AbilityTag,
  Equipment,
  EquipmentItem,
  EquipmentType,
  EquipmentRequirement,
  SetBonus,
  EquipmentSpecial,
  Transformation,
  TransformationForm,
  MasteryBonus,
  Personality,
  PersonalityTrait,
  Mood,
  RelationshipType,
  Activity,
  MissionType as MagicalGirlMissionType,
  TimeOfDay,
  Location,
  TeamRole,
} from "./magicalGirl";

// Combat types (specific exports to avoid conflicts)
export type {
  CombatSystem,
  BattleType,
  CombatParticipant,
  CombatAction,
  CombatPosition,
} from "./combat";

// Mission types (specific exports to avoid conflicts)
export type {
  Mission,
  MissionType as GameMissionType,
  MissionCategory,
  Difficulty,
  MissionRequirement,
  Objective,
  ObjectiveType,
  ObjectiveTarget,
  ObjectiveCondition,
  ConditionRule,
  MissionReward,
  MissionPenalty,
  PenaltyType,
  PenaltySeverity,
  PenaltyEffect,
  MissionLocation,
} from "./missions";

// Training types (specific exports to avoid conflicts)
export type {
  TrainingSession,
  TrainingType,
  TrainingCategory,
  TrainingDifficulty,
  TrainingCost,
  SpecialTrainingCost,
  TrainingRequirement,
  TrainingRequirementType,
  TrainingEffect,
  TrainingEffectType,
  TrainingTarget,
  TrainingReward,
  TrainingRewardType,
  TrainingTag,
  TrainingInstructor,
  InstructorBonus,
  InstructorAvailability,
} from "./training";

// Achievement types (specific exports)
export type {
  Achievement,
  AchievementCategory,
  AchievementRarity,
  AchievementRequirement,
  AchievementReward,
  AchievementProgress,
  AchievementMilestone,
  AchievementStats,
  AchievementFilters,
  AchievementEvent,
  AchievementNotification,
} from "./achievements";

// Recruitment types (specific exports)
export type {
  RecruitmentSystem,
  RecruitmentCurrencies,
  RecruitmentBanner,
  BannerType,
  BannerRarity,
  GachaRates,
  BannerCosts,
  RecruitmentCost,
  CurrencyCost,
  PitySystemConfig,
  PityCounter,
  GuaranteeConfig,
  GuaranteeType,
  SummonRecord,
  SummonResult,
  SummonSession,
  RecruitmentEvent,
  RecruitmentStatistics,
  WishlistSystem,
  RecruitmentShop,
  ShopCategory,
  ShopItem,
} from "./recruitment";

// Transformation types (specific exports)
export type {
  TransformationSystem,
  TransformationSequence,
  TransformationRarity,
  TransformationCategory,
  TransformationAnimation,
  AnimationType,
  AnimationStage,
  CharacterPose,
  FacialExpression,
  HandGesture,
  OutfitTransition,
  AccessoryTransition,
  TransformationAccessory,
  AuraEffect,
  StageEffect,
  CameraMovement,
  LightingEffect,
  ParticleEffect,
  ScreenEffect,
  BackgroundTransition,
  TransformationPhrase,
  TransformationEffect,
  TransformationCost,
  TransformationSpecialEffect,
  AbilityModifier,
  TransformationVulnerability,
  TransformationSource,
  ActiveTransformation,
  TransformationStage,
  TransformationRecord,
  CharacterReaction,
  TransformationSettings,
  TransformationEvent,
  TransformationEventType,
  TransformationCustomization,
  CustomPhrase,
  CustomEffect,
  CustomColorScheme,
  CustomPose,
  PoseKeyframe,
  CustomizationOption,
} from "./transformation";

// Skill Tree types (specific exports)
export type {
  SkillTree,
  SkillNode,
  SpecializationPath,
  SkillTreeState,
  SkillTreeActions,
  SkillBuild,
  BuildTreeState,
  SkillLearningEntry,
  TreeAnalysis,
  AnalysisRecommendation,
  PathProgress,
  OptimizationConstraints,
  TreeFilterSettings,
  TreeViewMode,
  SkillTreeEvent,
  SkillTier,
  SkillCategory,
  SkillTag,
  SpecializationTheme,
  BranchType,
  ConnectionType,
  PrerequisiteType,
  CostType,
  CostScaling,
  ScalingType,
  SynergyRarity,
  SkillPosition,
  SkillPrerequisite,
  SkillCost,
  SkillRequirement,
  SkillEffect,
  SkillScaling,
  PathBonus,
  PathSynergy,
  SynergyEffect,
  TreeUnlockRequirement,
  PathRequirement,
  PathMasteryRequirement,
  MasteryReward,
  SkillConnection,
  RecommendationPriority,
  OptimizationGoal,
  SkillTreeEventType,
} from "./skillTree";

// Customization types (specific exports)
export type {
  CustomizationSystem,
  CustomizationActions,
  CharacterCustomization,
  OutfitConfiguration,
  AccessoryConfiguration,
  ColorConfiguration,
  SavedOutfit,
  QuickSlot,
  OutfitPiece,
  Accessory,
  AppearanceState,
  OutfitBonus,
  OutfitEffect,
  AccessoryEffect,
  OutfitStats,
  OutfitCategory,
  OutfitSlot,
  AccessoryCategory,
  AccessorySlot,
  OutfitTheme,
  StyleTag,
  FormalityLevel,
  ItemRarity,
  Season,
  MetalTone,
  EleganceLevel,
  RandomizationConstraints,
  ColorHarmonyScore,
  CustomizationEvent,
} from "./customization";

// Prestige types (specific exports)
export type {
  PrestigeSystem,
  PrestigeActions,
  CharacterPrestige,
  PrestigePerk,
  PrestigeMilestone,
  PrestigeCurrency,
  PermanentBonus,
  PrestigeMultiplier,
  SpecializationMastery,
  LegacyBonus,
  PrestigeEvent,
  PrestigeAnalysis,
  PrestigeGoal,
  PrestigeRecommendation,
  PrestigeStrategy,
  PrestigeSimulation,
  PrestigeLeaderboardEntry,
  PrestigeNotificationSettings,
  PrestigeStatistics,
  PrestigeCategory,
  PrestigeTier,
  PrestigeRarity,
  PrestigeTag,
  MilestoneCategory,
  MilestoneDifficulty,
  BonusSource,
  MultiplierTarget,
  PrestigeEventType,
  ApplicationMode,
} from "./prestige";

// Save System types (specific exports)
export type {
  SaveSystem,
  SaveSystemActions,
  SaveSlot,
  GameStateSnapshot,
  SavePreview,
  SaveConflict,
  ExportRecord,
  ImportRecord,
  SaveValidationSettings,
  CompressionSettings,
  ConflictResolution,
  ExportOptions,
  ImportOptions,
  ImportResult,
  RepairResult,
  IntegrityResult,
  BackupInfo,
  SaveComparison,
  OptimizationResult,
  SaveSystemSettings,
  MigrationResult,
  SaveSystemEvent,
  ConflictType,
  ExportType,
  ImportType,
  ImportStatus,
  CompressionAlgorithm,
  ValidationType,
  ValidationSeverity,
  CompatibilityType,
  SaveEventType,
} from "./saveSystem";

// Tutorial types (specific exports)
export type {
  TutorialSystem,
  Tutorial,
  TutorialStep,
  TutorialProgress,
  TutorialSettings,
  TutorialHighlight,
  TutorialOverlay,
  TutorialTooltip,
  TutorialSession,
  TutorialAnalytics,
  LearningProfile,
  AdaptiveDifficulty,
  ContextualHelp,
  HintSystem,
  TutorialMistake,
  InteractionEvent,
  TutorialCategory,
  TutorialDifficulty,
  StepType,
  StepAction,
  HighlightType,
  OverlayType,
  TooltipPosition,
  LearningStyle,
  AutoAdvanceSpeed,
  DifficultyPreference,
  PacePreference,
  SkillLevel,
  ExperienceLevel,
  HelpSeekingPattern,
  DifficultyLevel,
  ComplexityLevel,
  HintFrequency,
  ValidationStrictness,
  HintType,
  HelpType,
  MistakeType,
  ResolutionMethod,
  InteractionType,
  MistakeImpact,
  AdaptationReason,
} from "./tutorial";

// Enhanced Settings types (specific exports)
export type {
  EnhancedSettingsSystem,
  EnhancedSettingsActions,
  GameSettings,
  SettingsCategory,
  GameSetting,
  SettingsProfile,
  SettingsChange,
  SettingsValidation,
  SettingsLayout,
  SettingsCustomization,
  ExpertSettings,
  OptimizationSuggestion,
  AccessibilityAssessment,
  SettingsHelp,
  SettingType,
  AccessLevel,
  SettingVisibility,
  ProfileType,
  ChangeSource,
  ValidationLevel,
  LayoutStyle,
  GroupingMethod,
  SortingMethod,
  SettingsTheme,
  SuggestionType,
  ImpactLevel,
  WCAGLevel,
  HelpPosition,
} from "./enhancedSettings";

// Common utility types used across the application
export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D extends Vector2D {
  z: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface Animation {
  name: string;
  duration: number;
  easing: string;
  loop: boolean;
  autoPlay: boolean;
}

export interface Sound {
  id: string;
  src: string;
  volume: number;
  loop: boolean;
  category: SoundCategory;
}

export type SoundCategory = "sfx" | "music" | "voice" | "ambient";

export interface Image {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string | number | boolean>;
}

// Event system types
export interface GameEventData {
  type: string;
  payload: Record<string, string | number | boolean>;
  timestamp: number;
  source: string;
}

export interface EventListener {
  id: string;
  type: string;
  callback: (data: GameEventData) => void;
  once?: boolean;
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export interface ButtonProps extends BaseComponentProps {
  variant?: "primary" | "secondary" | "magical" | "sparkle" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  variant?: "default" | "magical" | "sparkle";
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "checkbox" | "radio" | "textarea";
  required?: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
  placeholder?: string;
  defaultValue?: string | number | boolean;
}

export interface SelectOption {
  value: string | number | boolean;
  label: string;
  disabled?: boolean;
}

export interface ValidationRule {
  type: "required" | "min" | "max" | "pattern" | "custom";
  value?: string | number | boolean;
  message: string;
  validator?: (value: string | number | boolean) => boolean;
}

// Settings and preferences types
export interface UserSettings {
  display: DisplaySettings;
  audio: AudioSettings;
  controls: ControlSettings;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
}

export interface DisplaySettings {
  theme: "light" | "dark" | "auto";
  language: string;
  fontSize: number;
  animations: boolean;
  particles: boolean;
  backgroundColor: string;
  uiScale: number;
}

export interface AudioSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  muted: boolean;
  musicEnabled: boolean;
  sfxEnabled: boolean;
}

export interface ControlSettings {
  keyBindings: { [action: string]: string };
  mouseSpeed: number;
  doubleClickSpeed: number;
  gesturesEnabled: boolean;
  tooltipsEnabled: boolean;
}

export interface PrivacySettings {
  analytics: boolean;
  crashReporting: boolean;
  socialFeatures: boolean;
  dataSharing: boolean;
}

export interface AccessibilitySettings {
  screenReader: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  colorBlind: boolean;
  subtitles: boolean;
}

// Performance and optimization types
export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  renderTime: number;
  cpuUsage: number;
  networkLatency: number;
}

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: number;
  expiry?: number;
  size: number;
}

export interface CacheConfig {
  maxSize: number;
  maxAge: number;
  cleanupInterval: number;
  strategy: "LRU" | "LFU" | "FIFO";
}

// Localization types
export interface LocaleData {
  code: string;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
  translations: { [key: string]: string };
  dateFormat: string;
  numberFormat: Intl.NumberFormatOptions;
}

export interface TranslationKey {
  key: string;
  defaultValue: string;
  namespace?: string;
  interpolation?: Record<string, string | number>;
}

// Network and sync types
export interface SyncState {
  lastSync: number;
  pending: boolean;
  conflicts: SyncConflict[];
  version: number;
}

export interface SyncConflict {
  key: string;
  local: Record<string, string | number | boolean>;
  remote: Record<string, string | number | boolean>;
  timestamp: number;
  resolved: boolean;
}

// Analytics and telemetry types
export interface AnalyticsEvent {
  name: string;
  category: string;
  properties: Record<string, string | number | boolean>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

export interface TelemetryData {
  events: AnalyticsEvent[];
  performance: PerformanceMetrics;
  errors: ErrorReport[];
  metadata: SessionMetadata;
}

export interface ErrorReport {
  type: "javascript" | "network" | "game" | "ui";
  message: string;
  stack?: string;
  timestamp: number;
  context: Record<string, string | number | boolean>;
  severity: "low" | "medium" | "high" | "critical";
}

export interface SessionMetadata {
  sessionId: string;
  userId?: string;
  platform: string;
  browser: string;
  version: string;
  startTime: number;
  duration: number;
}
