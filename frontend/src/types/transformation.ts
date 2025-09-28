// Magical Girl Transformation System Types
import type { MagicalElement } from "./magicalGirl";

export interface StatBonus {
  stat?: string;
  value?: number;
  type?: "flat" | "percentage";
  [key: string]: number | string | undefined;
}

export interface TransformationSystem {
  transformations: TransformationSequence[];
  activeTransformations: ActiveTransformation[];
  transformationHistory: TransformationRecord[];
  transformationSettings: TransformationSettings;
  customizations?: TransformationCustomization[];
  recentEvents?: TransformationEvent[];
}

export interface TransformationSequence {
  id: string;
  name: string;
  description: string;
  element: MagicalElement;
  rarity: TransformationRarity;
  category: TransformationCategory;

  // Visual & Audio
  animation: TransformationAnimation;
  phrases: TransformationPhrase[];
  effects: TransformationEffect[];
  music?: string;

  // Requirements & Costs
  requirements: TransformationRequirement[];
  costs: TransformationCost[];
  cooldown: number;
  duration: number;
  maxDuration: number;

  // Gameplay Effects
  statBonuses: StatBonus[];
  abilityUnlocks: string[];
  specialEffects: TransformationSpecialEffect[];
  vulnerabilities: TransformationVulnerability[];

  // Progression
  experience: number;
  maxExperience: number;
  level: number;
  maxLevel: number;
  mastery: TransformationMastery;

  // Unlocking
  isUnlocked: boolean;
  isDefault: boolean;
  unlockedAt?: number;
  source: TransformationSource;
}

export type TransformationRarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Epic"
  | "Legendary"
  | "Mythical";

export type TransformationCategory =
  | "Basic"
  | "Combat"
  | "Elemental"
  | "Guardian"
  | "Princess"
  | "Ultimate"
  | "Fusion"
  | "Dark"
  | "Light"
  | "Custom";

export interface TransformationAnimation {
  type: AnimationType;
  stages: AnimationStage[];
  totalDuration: number;
  skippable: boolean;

  // Cinematic elements
  cameraMovements: CameraMovement[];
  lightingEffects: LightingEffect[];
  particleEffects: ParticleEffect[];
  screenEffects: ScreenEffect[];
}

export type AnimationType =
  | "Classic"
  | "Quick"
  | "Dramatic"
  | "Elemental"
  | "Divine"
  | "Dark"
  | "Fusion"
  | "Custom";

export interface AnimationStage {
  id: string;
  name: string;
  description: string;
  duration: number;
  startTime: number;

  // Visual elements
  characterPose: CharacterPose;
  outfit: OutfitTransition;
  accessories: AccessoryTransition[];
  aura: AuraEffect;

  // Audio
  soundEffects: string[];
  voiceLine?: string;

  // Effects
  visualEffects: StageEffect[];
  backgroundChange?: BackgroundTransition;
}

export interface CharacterPose {
  type:
    | "standing"
    | "floating"
    | "spinning"
    | "dancing"
    | "dramatic"
    | "custom";
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
  expression: FacialExpression;
  gesture: HandGesture;
}

export interface FacialExpression {
  type: "determined" | "confident" | "serene" | "fierce" | "joyful" | "focused";
  intensity: number;
  eyeGlow?: boolean;
  specialMarkings?: string[];
}

export interface HandGesture {
  type:
    | "magical_symbol"
    | "heart"
    | "star"
    | "element"
    | "prayer"
    | "weapon_summon";
  position: "raised" | "crossed" | "extended" | "at_heart" | "overhead";
  glowEffect?: boolean;
}

export interface OutfitTransition {
  fromOutfit: string;
  toOutfit: string;
  transitionType:
    | "dissolve"
    | "sparkle"
    | "light_wrap"
    | "element_flow"
    | "ribbon_wrap";
  duration: number;

  // Piece-by-piece transformation
  pieces: OutfitPiece[];
  transformOrder: string[];
}

export interface OutfitPiece {
  id: string;
  name: string;
  type: "dress" | "skirt" | "top" | "boots" | "gloves" | "stockings" | "cape";
  color: string;
  pattern?: string;
  material: "fabric" | "magical" | "crystal" | "metal" | "energy";
  enchantments: string[];

  // Animation specific
  appearanceEffect: "materialize" | "spiral" | "grow" | "unfold" | "flash";
  timing: number;
  duration: number;
}

export interface AccessoryTransition {
  type: "weapon" | "tiara" | "jewelry" | "wings" | "tail" | "ears" | "markings";
  accessory: TransformationAccessory;
  appearanceEffect: "summon" | "grow" | "materialize" | "sparkle" | "burst";
  timing: number;
  duration: number;
}

export interface TransformationAccessory {
  id: string;
  name: string;
  description: string;
  element: MagicalElement;
  rarity: TransformationRarity;

  // Visual
  model: string;
  texture: string;
  color: string;
  size: number;
  position: { x: number; y: number; z: number };

  // Effects
  glow: boolean;
  particles: boolean;
  aura: boolean;
  special: boolean;

  // Gameplay
  statBonuses: StatBonus[];
  abilities: string[];
  passives: string[];
}

export interface AuraEffect {
  type:
    | "elemental"
    | "divine"
    | "dark"
    | "rainbow"
    | "star"
    | "heart"
    | "custom";
  color: string;
  intensity: number;
  size: number;
  shape: "circular" | "heart" | "star" | "elemental" | "spiral";
  animation: "pulse" | "rotate" | "wave" | "sparkle" | "flow";
  particles: boolean;
  sound?: string;
}

export interface StageEffect {
  type: EffectType;
  name: string;
  duration: number;
  delay: number;
  intensity: number;
  color?: string;

  // Positioning
  position: "character" | "background" | "foreground" | "fullscreen" | "custom";
  coordinates?: { x: number; y: number; z: number };

  // Animation
  movement: "static" | "orbit" | "spiral" | "wave" | "burst" | "flow";
  fadeIn: number;
  fadeOut: number;

  // Audio
  soundEffect?: string;
  synchronized: boolean;
}

export type EffectType =
  | "sparkles"
  | "stars"
  | "hearts"
  | "flowers"
  | "ribbons"
  | "light_rays"
  | "energy_burst"
  | "element_swirl"
  | "magic_circle"
  | "feathers"
  | "crystals"
  | "lightning"
  | "fire"
  | "water"
  | "earth"
  | "air"
  | "custom";

export interface CameraMovement {
  type:
    | "zoom_in"
    | "zoom_out"
    | "pan"
    | "rotate"
    | "shake"
    | "circle"
    | "dramatic";
  startTime: number;
  duration: number;
  easing: "linear" | "ease_in" | "ease_out" | "ease_in_out" | "bounce";

  // Movement parameters
  startPosition: { x: number; y: number; z: number };
  endPosition: { x: number; y: number; z: number };
  lookAt: { x: number; y: number; z: number };

  // Additional effects
  fieldOfView?: number;
  blur?: boolean;
  shake?: { intensity: number; frequency: number };
}

export interface LightingEffect {
  type: "spotlight" | "ambient" | "rim" | "dramatic" | "magical" | "elemental";
  color: string;
  intensity: number;
  startTime: number;
  duration: number;

  // Positioning
  position: { x: number; y: number; z: number };
  direction?: { x: number; y: number; z: number };
  radius?: number;

  // Animation
  animation: "static" | "pulse" | "flicker" | "sweep" | "grow" | "fade";
  speed: number;
}

export interface ParticleEffect {
  type: "sparkles" | "stars" | "petals" | "energy" | "elemental" | "custom";
  count: number;
  lifetime: number;
  startTime: number;
  duration: number;

  // Appearance
  size: { min: number; max: number };
  color: string[];
  opacity: { start: number; end: number };

  // Physics
  velocity: { x: number; y: number; z: number };
  acceleration: { x: number; y: number; z: number };
  gravity: number;

  // Emission
  emissionRate: number;
  burstCount?: number;
  emissionShape: "point" | "circle" | "sphere" | "box" | "cone";
  emissionArea: { width: number; height: number; depth: number };
}

export interface ScreenEffect {
  type: "flash" | "blur" | "distortion" | "color_shift" | "vignette" | "glow";
  intensity: number;
  startTime: number;
  duration: number;
  color?: string;

  // Animation
  easing: "linear" | "ease_in" | "ease_out" | "ease_in_out";
  fadeIn: number;
  fadeOut: number;
}

export interface BackgroundTransition {
  from: string;
  to: string;
  type: "fade" | "wipe" | "spiral" | "shatter" | "elemental";
  duration: number;
  easing: "linear" | "ease_in" | "ease_out" | "ease_in_out";
}

export interface TransformationPhrase {
  id: string;
  text: string;
  timing: number;
  duration: number;
  character: string;

  // Delivery
  emotion: "determined" | "confident" | "gentle" | "fierce" | "magical";
  volume: number;
  speed: number;

  // Visual presentation
  displayStyle: "subtitle" | "speech_bubble" | "floating_text" | "magical_text";
  textEffect: "none" | "glow" | "sparkle" | "pulse" | "typewriter";
  color: string;
  font: string;

  // Audio
  voiceFile?: string;
  lipSync?: boolean;
  echo?: boolean;
  reverb?: boolean;
}

export interface TransformationEffect {
  id: string;
  name: string;
  description: string;
  type: "visual" | "audio" | "gameplay" | "environmental";

  // Timing
  startTime: number;
  duration: number;
  delay: number;

  // Properties
  properties: Record<string, string | number | boolean>;
  intensity: number;

  // Conditions
  conditions: EffectCondition[];
  triggers: EffectTrigger[];
}

export interface EffectCondition {
  type:
    | "element"
    | "rarity"
    | "level"
    | "mastery"
    | "time"
    | "location"
    | "custom";
  operator: "equals" | "greater" | "less" | "contains" | "not";
  value: string | number | boolean;
}

export interface EffectTrigger {
  event: "start" | "middle" | "end" | "peak" | "phrase" | "gesture" | "custom";
  action: string;
  parameters: Record<string, string | number | boolean>;
}

export interface TransformationRequirement {
  type:
    | "level"
    | "element"
    | "item"
    | "achievement"
    | "mastery"
    | "story"
    | "custom";
  description: string;
  value: string | number | boolean;
  optional: boolean;
}

export interface TransformationCost {
  resource: "mana" | "energy" | "charges" | "items" | "currency";
  amount: number;
  percentage?: boolean;
  description: string;
}

export interface TransformationSpecialEffect {
  id: string;
  name: string;
  description: string;
  type: "passive" | "active" | "triggered" | "aura" | "environmental";

  // Gameplay impact
  statModifiers: StatBonus[];
  abilityModifiers: AbilityModifier[];
  combatEffects: CombatEffect[];

  // Conditions
  duration: number;
  stackable: boolean;
  dispellable: boolean;
  transferable: boolean;

  // Visual
  visualEffect?: string;
  audioEffect?: string;
  particleEffect?: string;
}

export interface AbilityModifier {
  abilityId: string;
  type: "enhance" | "reduce" | "disable" | "replace" | "add";
  value: number;
  description: string;
}

export interface CombatEffect {
  type: "damage" | "healing" | "status" | "movement" | "special";
  value: number;
  target: "self" | "allies" | "enemies" | "all";
  description: string;
}

export interface TransformationVulnerability {
  type: "element" | "damage_type" | "status" | "ability" | "environmental";
  multiplier: number;
  description: string;
  condition?: string;
}

export interface TransformationMastery {
  level: number;
  experience: number;
  maxExperience: number;

  // Mastery bonuses
  speedIncrease: number;
  powerIncrease: number;
  durationIncrease: number;
  cooldownReduction: number;

  // Unlocked features
  customization: boolean;
  newPhrases: string[];
  newEffects: string[];
  newPoses: string[];

  // Mastery tiers
  tier: MasteryTier;
  nextTierRequirements: TransformationRequirement[];
}

export type MasteryTier =
  | "Novice"
  | "Apprentice"
  | "Adept"
  | "Expert"
  | "Master"
  | "Grandmaster"
  | "Legendary";

export type TransformationSource =
  | "Default"
  | "Story"
  | "Achievement"
  | "Gacha"
  | "Event"
  | "Crafting"
  | "Purchase"
  | "Gift"
  | "Special"
  | "Custom";

export interface ActiveTransformation {
  transformationId: string;
  characterId: string;
  startTime: number;
  duration: number;
  stage: TransformationStage;

  // Current state
  currentStageIndex: number;
  timeElapsed: number;
  timeRemaining: number;
  isPaused: boolean;
  isSkippable: boolean;

  // Bonuses and effects
  activeBonuses: StatBonus[];
  activeEffects: TransformationSpecialEffect[];

  // Animation state
  animationProgress: number;
  currentPhrase?: TransformationPhrase;
  completedStages: string[];
  customization?: Partial<TransformationCustomization>;
}

export type TransformationStage =
  | "Idle"
  | "Preparing"
  | "Chanting"
  | "Transforming"
  | "Completing"
  | "Completed"
  | "Failed"
  | "Interrupted";

export interface TransformationRecord {
  id: string;
  transformationId: string;
  characterId: string;
  timestamp: number;
  duration: number;

  // Performance
  completed: boolean;
  skipped: boolean;
  interrupted: boolean;
  masteryGained: number;

  // Context
  situation: "Combat" | "Exploration" | "Story" | "Practice" | "Event";
  location: string;
  witnesses: string[];

  // Results
  powerLevel: number;
  effectiveness: number;
  reactions: CharacterReaction[];
}

export interface CharacterReaction {
  characterId: string;
  reaction:
    | "amazed"
    | "impressed"
    | "concerned"
    | "jealous"
    | "inspired"
    | "fearful";
  intensity: number;
  comment?: string;
}

export interface TransformationSettings {
  // Animation preferences
  animationQuality: "Low" | "Medium" | "High" | "Ultra";
  animationSpeed: number;
  skipAnimations: boolean;
  autoSkipRepeated: boolean;

  // Audio preferences
  voiceVolume: number;
  effectsVolume: number;
  musicVolume: number;
  muteRepeated: boolean;

  // Visual preferences
  particleQuality: "Low" | "Medium" | "High";
  lightingQuality: "Low" | "Medium" | "High";
  cameraShake: boolean;
  screenEffects: boolean;

  // Accessibility
  subtitles: boolean;
  colorBlindSupport: boolean;
  reducedMotion: boolean;
  highContrast: boolean;

  // Gameplay
  allowInterruption: boolean;
  requireConfirmation: boolean;
  showProgress: boolean;
  saveReplays: boolean;
}

// Transformation Events
export interface TransformationEvent {
  type: TransformationEventType;
  timestamp: number;
  transformationId: string;
  characterId: string;
  data?: {
    timestamp: number;
    userId?: string;
    metadata?: Record<string, string | number | boolean>;
  };
}

export type TransformationEventType =
  | "transformation_started"
  | "transformation_completed"
  | "transformation_failed"
  | "transformation_interrupted"
  | "stage_completed"
  | "phrase_spoken"
  | "effect_triggered"
  | "mastery_gained"
  | "new_unlocked"
  | "customization_changed";

// Customization
export interface TransformationCustomization {
  transformationId: string;
  characterId: string;

  // Custom elements
  customPhrases: CustomPhrase[];
  customEffects: CustomEffect[];
  customColors: CustomColorScheme;
  customPoses: CustomPose[];

  // Preferences
  preferredStages: string[];
  preferredEffects: string[];
  disabledElements: string[];

  // Unlocks
  unlockedCustomizations: string[];
  availableOptions: CustomizationOption[];
}

export interface CustomPhrase {
  id: string;
  text: string;
  emotion: string;
  timing: number;
  replacesDefault: boolean;
  unlocked: boolean;
}

export interface CustomEffect {
  id: string;
  name: string;
  type: EffectType;
  properties: Record<string, string | number | boolean>;
  replacesDefault: boolean;
  unlocked: boolean;
}

export interface CustomColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  aura: string;
  effects: string;
  outfit: { [piece: string]: string };
}

export interface CustomPose {
  id: string;
  name: string;
  type: string;
  keyframes: PoseKeyframe[];
  duration: number;
  unlocked: boolean;
}

export interface PoseKeyframe {
  time: number;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
}

export interface CustomizationOption {
  id: string;
  name: string;
  description: string;
  category: "phrase" | "effect" | "color" | "pose" | "accessory" | "music";
  rarity: TransformationRarity;
  cost: TransformationCost[];
  requirements: TransformationRequirement[];
  unlocked: boolean;
}
