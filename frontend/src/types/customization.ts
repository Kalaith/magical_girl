// Magical Girl Customization System Types

// Import required base types
interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

interface Vector3D {
  x: number;
  y: number;
  z: number;
}

interface SetBonus {
  id: string;
  name: string;
  description: string;
  pieces: number;
  effects: Array<{
    type: string;
    value: string | number;
    description: string;
  }>;
}

interface EffectCondition {
  type: string;
  value: string | number;
}

export interface CustomizationSystem {
  // Character customization state
  characters: Record<string, CharacterCustomization>;

  // Available items and unlocks
  unlockedOutfits: string[];
  unlockedAccessories: string[];
  unlockedColors: string[];
  unlockedPatterns: string[];

  // Customization presets
  savedOutfits: SavedOutfit[];
  quickSlots: QuickSlot[];

  // Unlocking and progression
  customizationPoints: number;
  fashionLevel: number;
  fashionExperience: number;

  // Collections and achievements
  completedSets: string[];
  fashionAchievements: string[];

  // Settings
  autoEquipNewItems: boolean;
  showOnlyOwnedItems: boolean;
  enableAnimatedPreviews: boolean;
}

export interface CharacterCustomization {
  characterId: string;

  // Current appearance
  currentOutfit: OutfitConfiguration;
  currentAccessories: AccessoryConfiguration;
  currentColors: ColorConfiguration;

  // Transformation states
  baseForm: AppearanceState;
  transformedForm: AppearanceState;

  // Style preferences
  favoriteStyles: StyleTag[];
  dislikedStyles: StyleTag[];

  // Statistics
  outfitsOwned: number;
  accessoriesOwned: number;
  totalCustomizations: number;
  fashionRating: number;
}

export interface OutfitConfiguration {
  // Core outfit pieces
  dress: OutfitPiece | null;
  top: OutfitPiece | null;
  bottom: OutfitPiece | null;
  shoes: OutfitPiece | null;

  // Additional pieces
  cape: OutfitPiece | null;
  gloves: OutfitPiece | null;
  stockings: OutfitPiece | null;

  // Outfit metadata
  setId?: string;
  theme: OutfitTheme;
  formality: FormalityLevel;
  completionBonus?: OutfitBonus;
}

export interface AccessoryConfiguration {
  // Head accessories
  tiara: Accessory | null;
  hairClip: Accessory | null;
  headband: Accessory | null;

  // Face accessories
  glasses: Accessory | null;
  mask: Accessory | null;

  // Jewelry
  necklace: Accessory | null;
  earrings: Accessory | null;
  bracelet: Accessory | null;
  ring: Accessory | null;

  // Magical accessories
  wand: Accessory | null;
  charm: Accessory | null;
  brooch: Accessory | null;

  // Additional accessories
  bag: Accessory | null;
  belt: Accessory | null;
  wings: Accessory | null;
  tail: Accessory | null;
}

export interface ColorConfiguration {
  // Hair colors
  primaryHairColor: Color;
  secondaryHairColor?: Color;
  hairGradient?: GradientConfiguration;

  // Eye colors
  leftEyeColor: Color;
  rightEyeColor: Color;

  // Outfit colors
  primaryOutfitColor: Color;
  secondaryOutfitColor: Color;
  accentColor: Color;

  // Accessory colors
  metalTone: MetalTone;
  gemColor?: Color;

  // Special effects
  auraColor?: Color;
  magicalGlow?: Color;
}

export interface OutfitPiece {
  id: string;
  name: string;
  description: string;
  category: OutfitCategory;
  slot: OutfitSlot;

  // Visual properties
  sprite: string;
  animationFrames?: string[];
  layerOrder: number;

  // Style properties
  theme: OutfitTheme;
  style: StyleTag[];
  formality: FormalityLevel;
  season: Season[];

  // Gameplay properties
  rarity: ItemRarity;
  stats?: OutfitStats;
  setBonus?: SetBonus;

  // Customization options
  colorable: boolean;
  colorSlots: ColorSlot[];
  patternSlots: PatternSlot[];

  // Unlock requirements
  unlockRequirements: UnlockRequirement[];
  cost: ItemCost;

  // Metadata
  designerNotes?: string;
  collectionName?: string;
  setId?: string;

  // Special properties
  animated: boolean;
  magical: boolean;
  transformationOnly: boolean;
  seasonalExclusive: boolean;
}

export interface Accessory {
  id: string;
  name: string;
  description: string;
  category: AccessoryCategory;
  slot: AccessorySlot;

  // Visual properties
  sprite: string;
  attachmentPoint: AttachmentPoint;
  animationLoop?: AnimationLoop;

  // Style properties
  theme: OutfitTheme;
  style: StyleTag[];
  elegance: EleganceLevel;

  // Gameplay properties
  rarity: ItemRarity;
  effects?: AccessoryEffect[];

  // Customization
  colorable: boolean;
  sizeable: boolean;
  positionAdjustable: boolean;

  // Requirements and costs
  unlockRequirements: UnlockRequirement[];
  cost: ItemCost;

  // Special properties
  magical: boolean;
  equipmentSlot?: EquipmentSlot;
  transformationBonus?: TransformationBonus;
}

export interface AppearanceState {
  // Physical appearance
  bodyType: BodyType;
  height: HeightRange;
  skinTone: SkinTone;

  // Hair
  hairstyle: Hairstyle;
  hairLength: HairLength;
  hairTexture: HairTexture;

  // Eyes
  eyeShape: EyeShape;
  eyeSize: EyeSize;

  // Face
  faceShape: FaceShape;
  expressionSet: ExpressionSet;

  // Special features
  magicalMarks?: MagicalMark[];
  specialFeatures?: SpecialFeature[];
}

export interface SavedOutfit {
  id: string;
  name: string;
  description: string;
  characterId: string;

  // Outfit data
  outfit: OutfitConfiguration;
  accessories: AccessoryConfiguration;
  colors: ColorConfiguration;
  harmonyScore?: number;

  // Metadata
  createdAt: number;
  lastUsed: number;
  timesUsed: number;

  // Social features
  isPublic: boolean;
  likes: number;
  tags: string[];

  // Categories
  occasion: OutfitOccasion[];
  mood: OutfitMood;
  season: Season;
}

export interface QuickSlot {
  slotNumber: number;
  name: string;
  outfitId: string;
  characterId: string;
  keybind?: string;
}

export interface OutfitBonus {
  id: string;
  name: string;
  description: string;
  effects: OutfitEffect[];

  // Activation conditions
  requiredPieces: string[];
  minimumPieces: number;
  setId?: string;
}

export interface OutfitEffect {
  type: OutfitEffectType;
  target: EffectTarget;
  value: number;
  duration?: number;
  description: string;
}

export interface AccessoryEffect {
  type: AccessoryEffectType;
  value: number;
  conditions?: EffectCondition[];
  description: string;
}

export interface OutfitStats {
  charm: number;
  elegance: number;
  cuteness: number;
  coolness: number;
  uniqueness: number;
  harmonyScore?: number;

  // Combat stats (if applicable)
  magicalPower?: number;
  defense?: number;
  speed?: number;
}

export interface GradientConfiguration {
  type: GradientType;
  direction: GradientDirection;
  colors: Color[];
  stops: number[];
}

export interface ColorSlot {
  name: string;
  area: string;
  defaultColor: Color;
  allowedColors?: Color[];
  colorCategories?: ColorCategory[];
}

export interface PatternSlot {
  name: string;
  area: string;
  availablePatterns: Pattern[];
  defaultPattern?: string;
}

export interface Pattern {
  id: string;
  name: string;
  sprite: string;
  category: PatternCategory;
  colorable: boolean;
  scale: number;
  rotation: number;
}

export interface UnlockRequirement {
  type: UnlockType;
  value: string | number;
  description: string;
}

export interface ItemCost {
  currency: CurrencyType;
  amount: number;
  alternativeCosts?: AlternativeCost[];
}

export interface AlternativeCost {
  currency: CurrencyType;
  amount: number;
  description: string;
}

export interface AttachmentPoint {
  bone: string;
  offset: Vector3D;
  rotation: Vector3D;
  scale: number;
}

export interface AnimationLoop {
  frames: string[];
  duration: number;
  easing: AnimationEasing;
  loop: boolean;
  triggers?: AnimationTrigger[];
}

export interface MagicalMark {
  id: string;
  name: string;
  position: BodyPosition;
  sprite: string;
  color: Color;
  glowEffect: boolean;
}

export interface SpecialFeature {
  id: string;
  name: string;
  type: FeatureType;
  sprite: string;
  animationData?: AnimationData;
}

export interface TransformationBonus {
  type: TransformationBonusType;
  value: number;
  description: string;
}

// Enums and Type Unions
export type OutfitCategory =
  | "dress"
  | "top"
  | "bottom"
  | "shoes"
  | "outerwear"
  | "swimwear"
  | "sleepwear"
  | "formal"
  | "casual"
  | "magical";

export type OutfitSlot =
  | "dress"
  | "top"
  | "bottom"
  | "shoes"
  | "cape"
  | "gloves"
  | "stockings"
  | "jacket"
  | "skirt";

export type AccessoryCategory =
  | "jewelry"
  | "hair"
  | "face"
  | "magical"
  | "decorative"
  | "functional";

export type AccessorySlot =
  | "tiara"
  | "hairClip"
  | "headband"
  | "glasses"
  | "mask"
  | "necklace"
  | "earrings"
  | "bracelet"
  | "ring"
  | "wand"
  | "charm"
  | "brooch"
  | "bag"
  | "belt"
  | "wings"
  | "tail";

export type OutfitTheme =
  | "cute"
  | "elegant"
  | "cool"
  | "sexy"
  | "gothic"
  | "punk"
  | "princess"
  | "warrior"
  | "magical"
  | "school"
  | "casual"
  | "formal"
  | "fantasy"
  | "modern"
  | "vintage"
  | "futuristic";

export type StyleTag =
  | "frilly"
  | "minimalist"
  | "ornate"
  | "edgy"
  | "sweet"
  | "sporty"
  | "romantic"
  | "dramatic"
  | "playful"
  | "sophisticated";

export type FormalityLevel =
  | "casual"
  | "smart_casual"
  | "semi_formal"
  | "formal"
  | "ultra_formal";

export type ItemRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic"
  | "unique";

export type Season = "spring" | "summer" | "autumn" | "winter" | "all_season";

export type MetalTone =
  | "gold"
  | "silver"
  | "rose_gold"
  | "platinum"
  | "copper"
  | "bronze";

export type EleganceLevel =
  | "simple"
  | "refined"
  | "elaborate"
  | "extravagant"
  | "divine";

export type BodyType =
  | "petite"
  | "average"
  | "tall"
  | "curvy"
  | "athletic"
  | "custom";

export type HeightRange =
  | "very_short"
  | "short"
  | "average"
  | "tall"
  | "very_tall";

export type SkinTone = "pale" | "fair" | "medium" | "tan" | "dark" | "custom";

export type Hairstyle =
  | "straight"
  | "wavy"
  | "curly"
  | "pigtails"
  | "ponytail"
  | "braid"
  | "bun"
  | "short_bob"
  | "long_flowing"
  | "custom";

export type HairLength =
  | "very_short"
  | "short"
  | "medium"
  | "long"
  | "very_long";

export type HairTexture = "straight" | "wavy" | "curly" | "coily";

export type EyeShape =
  | "round"
  | "almond"
  | "upturned"
  | "downturned"
  | "hooded";

export type EyeSize = "small" | "medium" | "large" | "extra_large";

export type FaceShape = "oval" | "round" | "square" | "heart" | "diamond";

export type ExpressionSet =
  | "cheerful"
  | "serious"
  | "mysterious"
  | "gentle"
  | "fierce";

export type OutfitOccasion =
  | "daily"
  | "school"
  | "work"
  | "party"
  | "date"
  | "battle"
  | "ceremony"
  | "vacation"
  | "sleep"
  | "exercise"
  | "special_event";

export type OutfitMood =
  | "happy"
  | "confident"
  | "romantic"
  | "rebellious"
  | "peaceful"
  | "energetic";

export type OutfitEffectType =
  | "stat_bonus"
  | "skill_enhancement"
  | "special_ability"
  | "transformation_bonus"
  | "social_bonus"
  | "combat_bonus";

export type AccessoryEffectType =
  | "stat_boost"
  | "magical_enhancement"
  | "protection"
  | "utility"
  | "social"
  | "transformation";

export type EffectTarget =
  | "self"
  | "allies"
  | "enemies"
  | "all"
  | "environment";

export type GradientType =
  | "linear"
  | "radial"
  | "angular"
  | "diamond"
  | "custom";

export type GradientDirection =
  | "horizontal"
  | "vertical"
  | "diagonal"
  | "radial"
  | "custom";

export type ColorCategory =
  | "warm"
  | "cool"
  | "neutral"
  | "pastel"
  | "bright"
  | "dark"
  | "metallic"
  | "magical"
  | "natural"
  | "rainbow";

export type PatternCategory =
  | "floral"
  | "geometric"
  | "abstract"
  | "cute"
  | "elegant"
  | "tribal"
  | "lace"
  | "stripes"
  | "polka_dots"
  | "magical";

export type UnlockType =
  | "level"
  | "story_progress"
  | "achievement"
  | "purchase"
  | "event"
  | "gacha"
  | "craft"
  | "gift"
  | "special";

export type CurrencyType =
  | "coins"
  | "gems"
  | "fashion_points"
  | "event_tokens"
  | "crafting_materials"
  | "social_points"
  | "achievement_points";

export type AnimationEasing =
  | "linear"
  | "ease_in"
  | "ease_out"
  | "ease_in_out"
  | "bounce";

export type AnimationTrigger =
  | "idle"
  | "walk"
  | "run"
  | "cast"
  | "transform"
  | "victory";

export type BodyPosition =
  | "forehead"
  | "cheek"
  | "shoulder"
  | "hand"
  | "chest"
  | "back"
  | "arm"
  | "leg"
  | "neck"
  | "custom";

export type FeatureType =
  | "wings"
  | "tail"
  | "ears"
  | "horns"
  | "markings"
  | "aura"
  | "magical_effect"
  | "special_appendage";

export type TransformationBonusType =
  | "transformation_speed"
  | "magical_power"
  | "visual_effect"
  | "animation_enhancement"
  | "special_ability";

export type EquipmentSlot = "weapon" | "armor" | "accessory" | "magical_focus";

// Additional interfaces for complex features
export interface CustomizationActions {
  // Outfit management
  equipOutfitPiece: (
    characterId: string,
    slot: OutfitSlot,
    pieceId: string,
  ) => void;
  unequipOutfitPiece: (characterId: string, slot: OutfitSlot) => void;
  equipFullOutfit: (
    characterId: string,
    outfitConfig: OutfitConfiguration,
  ) => void;

  // Accessory management
  equipAccessory: (
    characterId: string,
    slot: AccessorySlot,
    accessoryId: string,
  ) => void;
  unequipAccessory: (characterId: string, slot: AccessorySlot) => void;

  // Color customization
  changeColor: (characterId: string, colorType: string, color: Color) => void;
  applyColorScheme: (characterId: string, scheme: ColorConfiguration) => void;

  // Outfit presets
  saveOutfit: (characterId: string, name: string, description?: string) => void;
  loadOutfit: (characterId: string, outfitId: string) => void;
  deleteOutfit: (outfitId: string) => void;
  shareOutfit: (outfitId: string) => string;
  importOutfit: (outfitCode: string) => void;

  // Quick slots
  assignQuickSlot: (slotNumber: number, outfitId: string) => void;
  useQuickSlot: (slotNumber: number) => void;
  clearQuickSlot: (slotNumber: number) => void;

  // Item management
  unlockItem: (itemId: string, itemType: "outfit" | "accessory") => void;
  purchaseItem: (itemId: string, currency: CurrencyType) => void;
  craftItem: (recipeId: string, materials: Record<string, number>) => void;

  // Randomization
  randomizeOutfit: (
    characterId: string,
    constraints?: RandomizationConstraints,
  ) => void;
  generateOutfitSuggestion: (
    characterId: string,
    occasion: OutfitOccasion,
  ) => OutfitConfiguration;

  // Analysis and stats
  calculateOutfitStats: (outfit: OutfitConfiguration) => OutfitStats;
  analyzeColorHarmony: (colors: ColorConfiguration) => ColorHarmonyScore;
  getStyleCompatibility: (
    outfit: OutfitConfiguration,
    accessories: AccessoryConfiguration,
  ) => number;

  // Social features
  rateOutfit: (outfitId: string, rating: number) => void;
  addOutfitToFavorites: (outfitId: string) => void;
  reportOutfit: (outfitId: string, reason: string) => void;
}

export interface RandomizationConstraints {
  theme?: OutfitTheme;
  formality?: FormalityLevel;
  colors?: Color[];
  excludeItems?: string[];
  onlyOwnedItems?: boolean;
  season?: Season;
  occasion?: OutfitOccasion;
}

export interface ColorHarmonyScore {
  overall: number;
  complementary: number;
  analogous: number;
  triadic: number;
  suggestions: string[];
}

export interface AnimationData {
  frameCount: number;
  frameDuration: number;
  looping: boolean;
  blendMode: string;
  effects: AnimationEffect[];
}

export interface AnimationEffect {
  type: EffectType;
  timing: number;
  duration: number;
  properties: Record<string, string | number | boolean>;
}

export type EffectType =
  | "glow"
  | "sparkle"
  | "float"
  | "pulse"
  | "shimmer"
  | "wave"
  | "rotate"
  | "scale"
  | "fade"
  | "custom";

// Customization Events
export interface CustomizationEvent {
  type: CustomizationEventType;
  characterId: string;
  timestamp: number;
  data: Record<string, string | number | boolean>;
}

export type CustomizationEventType =
  | "outfit_changed"
  | "accessory_equipped"
  | "color_changed"
  | "outfit_saved"
  | "item_unlocked"
  | "achievement_earned"
  | "fashion_level_up"
  | "set_completed"
  | "style_discovered";
