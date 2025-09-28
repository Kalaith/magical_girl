// Enhanced Settings Panel Types

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  colorBlindSupport: boolean;
}

export interface PanelArrangement {
  layout: "grid" | "list" | "compact";
  columns: number;
  spacing: number;
}

export interface EnhancedSettingsSystem {
  // Settings categories and organization
  settingsCategories: SettingsCategory[];
  activeCategory: string;
  searchQuery: string;
  favoriteSettings: string[];

  // Settings values and state
  currentSettings: GameSettings;
  defaultSettings: GameSettings;
  tempSettings: GameSettings; // For preview before applying

  // Settings management
  settingsHistory: SettingsChange[];
  settingsProfiles: SettingsProfile[];
  activeProfileId: string | null;

  // Import/Export
  exportHistory: SettingsExport[];
  importHistory: SettingsImport[];

  // Validation and conflicts
  settingsValidation: SettingsValidation;
  conflictResolution: ConflictResolution[];

  // UI and presentation
  settingsLayout: SettingsLayout;
  customization: SettingsCustomization;

  // Advanced features
  advancedMode: boolean;
  debugMode: boolean;
  expertSettings: ExpertSettings;

  // Performance and optimization
  performanceSettings: PerformanceSettings;
  optimizationSuggestions: OptimizationSuggestion[];

  // Accessibility
  accessibilitySettings: AccessibilitySettings;
  accessibilityAssessment: AccessibilityAssessment;

  // Help and guidance
  settingsHelp: SettingsHelp;
  tooltipsEnabled: boolean;
  onboardingCompleted: boolean;
}

export interface SettingsCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  priority: number;

  // Category organization
  subcategories: SettingsSubcategory[];
  settingSections: SettingsSection[];

  // Access control
  requiresUnlock: boolean;
  unlockRequirements: UnlockRequirement[];
  accessLevel: AccessLevel;

  // Visual presentation
  color: string;
  bannerImage?: string;
  customStyling?: CategoryStyling;

  // Help and documentation
  helpContent: string;
  tutorialId?: string;
  externalLinks: ExternalLink[];
}

export interface SettingsSubcategory {
  id: string;
  name: string;
  description: string;
  parentCategory: string;
  settings: string[]; // Setting IDs
  isCollapsible: boolean;
  defaultExpanded: boolean;
}

export interface SettingsSection {
  id: string;
  name: string;
  description: string;
  settings: GameSetting[];
  layout: SectionLayout;
  conditions: DisplayCondition[];
  priority: number;
}

export interface GameSetting {
  id: string;
  name: string;
  description: string;
  type: SettingType;
  category: string;
  section: string;

  // Value and constraints
  currentValue: string | number | boolean;
  defaultValue: string | number | boolean;
  possibleValues?: Array<{ value: string | number; label: string; }>;
  constraints: SettingConstraints;

  // Validation and dependencies
  validation: SettingValidation;
  dependencies: SettingDependency[];
  conflicts: SettingConflict[];

  // UI presentation
  displayName: string;
  tooltip: string;
  helpText: string;
  placeholder?: string;
  unit?: string;
  format?: string;

  // Behavior
  requiresRestart: boolean;
  requiresConfirmation: boolean;
  hasPreview: boolean;
  isAdvanced: boolean;
  isExperimental: boolean;

  // Access and visibility
  accessLevel: AccessLevel;
  visibility: SettingVisibility;
  searchTags: string[];

  // Customization
  customRenderer?: string;
  customValidator?: string;
  customActions: CustomAction[];

  // Analytics and tracking
  trackingEnabled: boolean;
  changeHistory: SettingChange[];
  usageMetrics: UsageMetrics;
}

export interface GameSettings {
  // Display and Graphics
  display: DisplaySettings;
  graphics: GraphicsSettings;
  performance: PerformanceSettings;

  // Audio and Sound
  audio: AudioSettings;
  voice: VoiceSettings;
  accessibility: AccessibilitySettings;

  // Gameplay and Mechanics
  gameplay: GameplaySettings;
  difficulty: DifficultySettings;
  progression: ProgressionSettings;

  // UI and Interface
  interface: InterfaceSettings;
  controls: ControlSettings;
  notifications: NotificationSettings;

  // Social and Online
  social: SocialSettings;
  privacy: PrivacySettings;
  moderation: ModerationSettings;

  // Advanced and Debug
  advanced: AdvancedSettings;
  developer: DeveloperSettings;
  experimental: ExperimentalSettings;

  // Custom and Mods
  customizations: CustomizationSettings;
  modSettings: ModSettings;
  userPreferences: UserPreferences;
}

export interface DisplaySettings {
  // Screen and Resolution
  resolution: Resolution;
  aspectRatio: AspectRatio;
  displayMode: DisplayMode;
  refreshRate: number;

  // Visual Quality
  brightness: number;
  contrast: number;
  saturation: number;
  gamma: number;

  // Color and Theme
  colorProfile: ColorProfile;
  theme: ThemeSettings;
  uiScale: number;
  fontScale: number;

  // Effects and Animation
  animationQuality: AnimationQuality;
  particleEffects: boolean;
  screenEffects: boolean;
  transitions: boolean;

  // Advanced Display
  vsync: boolean;
  frameRateLimit: number;
  adaptiveSync: boolean;
  hdr: boolean;
}

export interface GraphicsSettings {
  // Rendering Quality
  renderQuality: RenderQuality;
  textureQuality: TextureQuality;
  shadowQuality: ShadowQuality;
  lightingQuality: LightingQuality;

  // Effects and Shaders
  postProcessing: boolean;
  bloom: boolean;
  motionBlur: boolean;
  antiAliasing: AntiAliasingType;

  // Performance Options
  levelOfDetail: boolean;
  culling: boolean;
  batchRendering: boolean;
  gpuAcceleration: boolean;

  // Advanced Graphics
  shaderComplexity: ShaderComplexity;
  renderPipeline: RenderPipeline;
  memoryPool: number;
  bufferSize: number;
}

export interface AudioSettings {
  // Volume Controls
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  ambientVolume: number;

  // Audio Quality
  audioQuality: AudioQuality;
  sampleRate: number;
  bitDepth: number;
  compression: AudioCompression;

  // Audio Device
  outputDevice: string;
  inputDevice: string;
  spatialAudio: boolean;
  surroundSound: boolean;

  // Audio Effects
  equalizer: EqualizerSettings;
  dynamicRange: boolean;
  normalization: boolean;
  crossfade: boolean;

  // Advanced Audio
  audioEngine: AudioEngine;
  bufferSize: number;
  latency: number;
  dsp: boolean;
}

export interface GameplaySettings {
  // Game Speed and Timing
  gameSpeed: number;
  autoSave: boolean;
  autoSaveInterval: number;
  pauseOnFocusLoss: boolean;

  // Assistance and Automation
  tutorials: boolean;
  hints: boolean;
  autoActions: AutoActionSettings;
  smartAssist: SmartAssistSettings;

  // Combat and Battle
  combatSpeed: number;
  skipAnimations: boolean;
  autoTarget: boolean;
  battleConfirmations: boolean;

  // Economy and Resources
  currencyFormat: CurrencyFormat;
  numberFormat: NumberFormat;
  resourceAlerts: boolean;
  economyAssist: boolean;

  // Character and Progression
  experienceSharing: boolean;
  autoLevelUp: boolean;
  skillRecommendations: boolean;
  characterAssist: boolean;
}

export interface InterfaceSettings {
  // Layout and Organization
  layoutStyle: LayoutStyle;
  panelArrangement: PanelArrangement;
  toolbarCustomization: ToolbarSettings;
  sidebarSettings: SidebarSettings;

  // Information Display
  tooltips: TooltipSettings;
  statusDisplays: StatusDisplaySettings;
  progressBars: ProgressBarSettings;
  notifications: NotificationDisplaySettings;

  // Navigation and Flow
  navigationStyle: NavigationStyle;
  breadcrumbs: boolean;
  quickActions: QuickActionSettings;
  contextMenus: ContextMenuSettings;

  // Visual Customization
  colorScheme: ColorScheme;
  iconTheme: IconTheme;
  fontSettings: FontSettings;
  spacing: SpacingSettings;

  // Advanced UI
  animationSpeed: number;
  transitionEffects: boolean;
  responsiveLayout: boolean;
  customCSS: string;
}

export interface SettingsProfile {
  id: string;
  name: string;
  description: string;
  type: ProfileType;

  // Profile data
  settings: Partial<GameSettings>;
  createdAt: number;
  lastUsed: number;
  usageCount: number;

  // Profile properties
  isDefault: boolean;
  isLocked: boolean;
  isShared: boolean;
  isFavorite: boolean;

  // Metadata
  tags: string[];
  category: string;
  author: string;
  version: string;

  // Sharing and social
  shareCode: string;
  likes: number;
  downloads: number;
  rating: number;
}

export interface SettingsChange {
  id: string;
  settingId: string;
  oldValue: string | number | boolean;
  newValue: string | number | boolean;
  timestamp: number;
  source: ChangeSource;
  reason?: string;
  autoApplied: boolean;
}

export interface SettingsValidation {
  // Validation configuration
  enabled: boolean;
  strictMode: boolean;
  warningLevel: ValidationLevel;

  // Validation results
  validationErrors: ValidationError[];
  validationWarnings: ValidationWarning[];
  validationInfo: ValidationInfo[];

  // Validation rules
  customRules: ValidationRule[];
  dependencyChecks: boolean;
  conflictDetection: boolean;
}

export interface ConflictResolution {
  id: string;
  conflictType: ConflictType;
  affectedSettings: string[];
  description: string;
  resolutionOptions: ResolutionOption[];
  selectedResolution?: string;
  isResolved: boolean;
  resolvedAt?: number;
}

export interface SettingsLayout {
  // Layout configuration
  style: LayoutStyle;
  columns: number;
  grouping: GroupingMethod;
  sorting: SortingMethod;

  // Display options
  showAdvanced: boolean;
  showDescriptions: boolean;
  showDefaults: boolean;
  compactMode: boolean;

  // Search and filter
  searchEnabled: boolean;
  filterOptions: FilterOption[];
  activeFilters: string[];

  // Customization
  customOrder: string[];
  hiddenSections: string[];
  pinnedSettings: string[];
}

export interface SettingsCustomization {
  // Theme and appearance
  theme: SettingsTheme;
  customColors: CustomColorScheme;
  customFonts: CustomFontSettings;

  // Layout customization
  customLayouts: CustomLayout[];
  widgetPreferences: WidgetPreference[];

  // Behavior customization
  shortcuts: SettingsShortcut[];
  quickAccess: QuickAccessSettings;
  automation: AutomationSettings;
}

export interface ExpertSettings {
  // Advanced configuration
  enabled: boolean;
  configFiles: ConfigFile[];
  commandLine: CommandLineSettings;
  scripting: ScriptingSettings;

  // System integration
  systemSettings: SystemIntegrationSettings;
  externalTools: ExternalToolSettings;
  apiSettings: APISettings;

  // Debug and diagnostics
  debugging: DebuggingSettings;
  logging: LoggingSettings;
  profiling: ProfilingSettings;
}

export interface OptimizationSuggestion {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  impact: ImpactLevel;
  difficulty: DifficultyLevel;

  // Suggestion details
  affectedSettings: string[];
  estimatedImprovement: number;
  requirements: string[];

  // Actions
  autoApplyable: boolean;
  actions: OptimizationAction[];
  reversible: boolean;

  // Tracking
  applied: boolean;
  appliedAt?: number;
  effectiveness?: number;
}

export interface AccessibilityAssessment {
  // Assessment results
  overallScore: number;
  categories: AccessibilityCategory[];
  issues: AccessibilityIssue[];
  recommendations: AccessibilityRecommendation[];

  // Compliance
  wcagLevel: WCAGLevel;
  compliancePercentage: number;
  criticalIssues: number;

  // Testing
  lastAssessment: number;
  automaticTesting: boolean;
  manualTesting: boolean;
}

export interface SettingsHelp {
  // Help system
  enabled: boolean;
  contextualHelp: boolean;
  searchableHelp: boolean;
  interactiveHelp: boolean;

  // Help content
  helpArticles: HelpArticle[];
  videoTutorials: VideoTutorial[];
  examples: SettingExample[];

  // Help behavior
  autoShowHelp: boolean;
  helpDelay: number;
  helpPosition: HelpPosition;
}

// Enums and Type Unions
export type SettingType =
  | "boolean"
  | "number"
  | "string"
  | "select"
  | "multiselect"
  | "range"
  | "color"
  | "file"
  | "directory"
  | "keybind"
  | "resolution"
  | "custom"
  | "json"
  | "array"
  | "object";

export type AccessLevel =
  | "basic"
  | "intermediate"
  | "advanced"
  | "expert"
  | "developer";

export type SettingVisibility =
  | "always"
  | "conditional"
  | "advanced"
  | "hidden"
  | "debug";

export type ProfileType = "user" | "preset" | "shared" | "automatic" | "backup";

export type ChangeSource =
  | "user"
  | "auto"
  | "import"
  | "reset"
  | "optimization"
  | "system";

export type ValidationLevel =
  | "none"
  | "basic"
  | "standard"
  | "strict"
  | "paranoid";

export type ConflictType =
  | "dependency"
  | "mutual_exclusion"
  | "resource"
  | "performance"
  | "compatibility";

export type LayoutStyle =
  | "list"
  | "grid"
  | "tabs"
  | "accordion"
  | "wizard"
  | "custom";

export type GroupingMethod =
  | "category"
  | "type"
  | "alphabetical"
  | "usage"
  | "custom";

export type SortingMethod =
  | "alphabetical"
  | "priority"
  | "recent"
  | "frequency"
  | "manual";

export type SettingsTheme =
  | "light"
  | "dark"
  | "auto"
  | "high_contrast"
  | "custom";

export type SuggestionType =
  | "performance"
  | "accessibility"
  | "usability"
  | "security"
  | "quality";

export type ImpactLevel = "low" | "medium" | "high" | "critical";

export type DifficultyLevel = "easy" | "medium" | "hard" | "expert";

export type WCAGLevel = "A" | "AA" | "AAA" | "none";

export type HelpPosition =
  | "sidebar"
  | "modal"
  | "tooltip"
  | "inline"
  | "overlay";

// Complex type definitions
export type Resolution = {
  width: number;
  height: number;
  label?: string;
};

export type AspectRatio = "16:9" | "16:10" | "4:3" | "21:9" | "auto" | "custom";

export type DisplayMode =
  | "windowed"
  | "fullscreen"
  | "borderless"
  | "maximized";

export type ColorProfile = "sRGB" | "DCI-P3" | "Rec2020" | "Adobe_RGB" | "auto";

export type ThemeSettings = {
  name: string;
  isDark: boolean;
  primaryColor: string;
  accentColor: string;
  customCSS?: string;
};

export type AnimationQuality = "none" | "reduced" | "normal" | "high" | "ultra";

export type RenderQuality = "low" | "medium" | "high" | "ultra" | "custom";

export type TextureQuality = "low" | "medium" | "high" | "ultra";

export type ShadowQuality = "none" | "low" | "medium" | "high" | "ultra";

export type LightingQuality = "basic" | "standard" | "enhanced" | "realistic";

export type AntiAliasingType = "none" | "FXAA" | "MSAA" | "TAA" | "DLAA";

export type ShaderComplexity = "basic" | "standard" | "complex" | "ultra";

export type RenderPipeline = "forward" | "deferred" | "hybrid" | "raytracing";

export type AudioQuality = "low" | "medium" | "high" | "lossless";

export type AudioCompression = "none" | "light" | "standard" | "aggressive";

export type AudioEngine = "standard" | "enhanced" | "spatial" | "custom";

export type CurrencyFormat = "short" | "long" | "scientific" | "custom";

export type NumberFormat =
  | "standard"
  | "grouped"
  | "scientific"
  | "engineering";

export type NavigationStyle =
  | "tabs"
  | "sidebar"
  | "breadcrumb"
  | "tree"
  | "custom";

export type ColorScheme =
  | "system"
  | "light"
  | "dark"
  | "high_contrast"
  | "custom";

export type IconTheme =
  | "default"
  | "minimal"
  | "detailed"
  | "colorful"
  | "custom";

// Complex interface definitions
export interface SettingConstraints {
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  required?: boolean;
  unique?: boolean;
  customConstraints?: CustomConstraint[];
}

export interface SettingValidation {
  rules: ValidationRule[];
  messages: ValidationMessage[];
  realTimeValidation: boolean;
  showErrors: boolean;
}

export interface SettingDependency {
  settingId: string;
  dependencyType: DependencyType;
  condition: DependencyCondition;
  action: DependencyAction;
}

export interface SettingConflict {
  conflictingSettingId: string;
  conflictType: ConflictType;
  severity: ConflictSeverity;
  resolution: ConflictResolutionMethod;
}

export interface UsageMetrics {
  changeCount: number;
  lastChanged: number;
  averageValue: number;
  popularValues: Array<{ value: string | number; usage: number; }>;
  userPatterns: UserPattern[];
}

export interface EqualizerSettings {
  enabled: boolean;
  preset: string;
  bands: EqualizerBand[];
  customPresets: CustomEqualizerPreset[];
}

export interface AutoActionSettings {
  enabled: boolean;
  actions: AutoAction[];
  conditions: AutoCondition[];
  scheduling: AutoSchedule;
}

export interface SmartAssistSettings {
  enabled: boolean;
  suggestions: boolean;
  automation: boolean;
  learning: boolean;
  privacy: SmartAssistPrivacy;
}

export interface ToolbarSettings {
  visible: boolean;
  items: ToolbarItem[];
  customizable: boolean;
  position: ToolbarPosition;
}

export interface TooltipSettings {
  enabled: boolean;
  delay: number;
  duration: number;
  style: TooltipStyle;
  position: TooltipPosition;
}

export interface QuickActionSettings {
  enabled: boolean;
  actions: QuickAction[];
  shortcuts: QuickShortcut[];
  customizable: boolean;
}

export interface FontSettings {
  family: string;
  size: number;
  weight: FontWeight;
  style: FontStyle;
  customFonts: string[];
}

export interface SpacingSettings {
  compact: boolean;
  padding: number;
  margin: number;
  lineHeight: number;
}

// Additional complex interfaces
export interface ValidationRule {
  id: string;
  type: ValidationType;
  condition: ValidationCondition;
  message: string;
  severity: ValidationSeverity;
}

export interface ValidationError {
  settingId: string;
  rule: string;
  message: string;
  severity: ErrorSeverity;
  canAutoFix: boolean;
}

export interface ResolutionOption {
  id: string;
  title: string;
  description: string;
  action: ResolutionAction;
  consequences: string[];
}

export interface FilterOption {
  id: string;
  name: string;
  type: FilterType;
  options: FilterValue[];
}

export interface CustomAction {
  id: string;
  name: string;
  description: string;
  action: ActionFunction;
  parameters: ActionParameter[];
}

export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  lastUpdated: number;
}

export interface VideoTutorial {
  id: string;
  title: string;
  url: string;
  duration: number;
  category: string;
  thumbnail: string;
}

export interface SettingExample {
  id: string;
  settingId: string;
  name: string;
  description: string;
  value: string | number;
  explanation: string;
}

// Actions interface
export interface EnhancedSettingsActions {
  // Category and navigation
  setActiveCategory: (categoryId: string) => void;
  searchSettings: (query: string) => void;
  toggleFavoriteSetting: (settingId: string) => void;
  navigateToSetting: (settingId: string) => void;

  // Setting management
  updateSetting: (settingId: string, value: string | number) => void;
  resetSetting: (settingId: string) => void;
  resetCategory: (categoryId: string) => void;
  resetAllSettings: () => void;
  previewSetting: (settingId: string, value: string | number) => void;
  applySetting: (settingId: string) => void;
  revertSetting: (settingId: string) => void;

  // Profile management
  createProfile: (name: string, settings?: Partial<GameSettings>) => string;
  loadProfile: (profileId: string) => void;
  saveProfile: (profileId: string, name?: string) => void;
  deleteProfile: (profileId: string) => void;
  duplicateProfile: (profileId: string, newName: string) => string;
  shareProfile: (profileId: string) => string;
  importProfile: (profileData: string) => string;

  // Import/Export
  exportSettings: (options: ExportOptions) => string;
  importSettings: (data: string, options: ImportOptions) => void;
  exportCategory: (categoryId: string) => string;
  importCategory: (categoryId: string, data: string) => void;

  // Validation and conflicts
  validateSettings: () => void;
  resolveConflict: (conflictId: string, resolutionId: string) => void;
  checkDependencies: (settingId: string) => void;
  autoFixIssues: () => void;

  // Advanced features
  toggleAdvancedMode: () => void;
  toggleDebugMode: () => void;
  optimizeSettings: (criteria: OptimizationCriteria) => void;
  applyOptimizationSuggestion: (suggestionId: string) => void;

  // Help and guidance
  showSettingHelp: (settingId: string) => void;
  startSettingsTour: () => void;
  toggleTooltips: () => void;
  searchHelp: (query: string) => void;

  // Accessibility
  runAccessibilityAssessment: () => void;
  applyAccessibilityRecommendation: (recommendationId: string) => void;
  toggleAccessibilityMode: (mode: string) => void;

  // Customization
  customizeLayout: (layout: Partial<SettingsLayout>) => void;
  saveLayoutPreset: (name: string) => void;
  loadLayoutPreset: (presetId: string) => void;
  addCustomSetting: (setting: Partial<GameSetting>) => void;
}

// Additional type definitions for comprehensive settings system
export type DependencyType =
  | "enables"
  | "disables"
  | "requires"
  | "conflicts"
  | "modifies";
export type DependencyCondition =
  | "equals"
  | "not_equals"
  | "greater"
  | "less"
  | "contains";
export type DependencyAction =
  | "show"
  | "hide"
  | "enable"
  | "disable"
  | "modify"
  | "validate";
export type ConflictSeverity = "info" | "warning" | "error" | "critical";
export type ConflictResolutionMethod = "auto" | "prompt" | "manual" | "ignore";
export type ValidationType =
  | "range"
  | "pattern"
  | "custom"
  | "dependency"
  | "format";
export type ValidationSeverity = "info" | "warning" | "error" | "critical";
export type ErrorSeverity = "low" | "medium" | "high" | "critical";
export type FilterType =
  | "category"
  | "type"
  | "access_level"
  | "status"
  | "custom";
export type ActionFunction = string; // Function name or code
export type FontWeight = "normal" | "bold" | "light" | "medium" | "black";
export type FontStyle = "normal" | "italic" | "oblique";
export type ToolbarPosition = "top" | "bottom" | "left" | "right" | "floating";
export type TooltipPosition = "top" | "bottom" | "left" | "right" | "auto";
export type TooltipStyle =
  | "simple"
  | "detailed"
  | "minimal"
  | "rich"
  | "custom";

// Placeholder types for complex nested structures
export interface CustomConstraint {
  id: string;
  name: string;
  rule: string;
  errorMessage: string;
}

export interface ValidationMessage {
  type: 'error' | 'warning' | 'info';
  message: string;
  field?: string;
}

export interface ValidationCondition {
  field: string;
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains';
  value: string | number | boolean;
}

export interface UserPattern {
  id: string;
  name: string;
  pattern: string;
  description: string;
}

export interface EqualizerBand {
  frequency: number;
  gain: number;
  q: number;
}

export interface CustomEqualizerPreset {
  id: string;
  name: string;
  bands: EqualizerBand[];
}

export interface AutoAction {
  id: string;
  name: string;
  trigger: string;
  action: string;
  parameters: Record<string, string | number | boolean>;
}

export interface AutoCondition {
  field: string;
  operator: string;
  value: string | number;
}

export interface AutoSchedule {
  id: string;
  name: string;
  enabled: boolean;
  schedule: string;
  actions: string[];
}

export interface SmartAssistPrivacy {
  collectData: boolean;
  shareAnalytics: boolean;
  personalizedRecommendations: boolean;
}

export interface ToolbarItem {
  id: string;
  type: 'button' | 'separator' | 'dropdown';
  label?: string;
  icon?: string;
  action?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  shortcut?: string;
  action: string;
}

export interface QuickShortcut {
  id: string;
  key: string;
  modifiers: string[];
  action: string;
}

export interface ValidationInfo {
  field: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
}

export interface ValidationWarning {
  field: string;
  message: string;
  canIgnore: boolean;
}

export interface CategoryStyling {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  iconColor: string;
}

export interface ExternalLink {
  label: string;
  url: string;
  icon?: string;
}

export interface SectionLayout {
  type: 'grid' | 'list' | 'tabs';
  columns?: number;
  spacing?: number;
}

export interface DisplayCondition {
  field: string;
  operator: string;
  value: string | number;
}
export interface CustomColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface CustomFontSettings {
  family: string;
  size: number;
  weight: number;
  lineHeight: number;
}

export interface CustomLayout {
  id: string;
  name: string;
  structure: {
    header: boolean;
    sidebar: boolean;
    footer: boolean;
  };
}

export interface WidgetPreference {
  widgetId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  visible: boolean;
}

export interface SettingsShortcut {
  action: string;
  key: string;
  modifiers: string[];
}

export interface QuickAccessSettings {
  favoriteSettings: string[];
  recentSettings: string[];
  pinnedCategories: string[];
}

export interface AutomationSettings {
  enabled: boolean;
  rules: AutoAction[];
  schedules: AutoSchedule[];
}

export interface ConfigFile {
  name: string;
  path: string;
  format: 'json' | 'yaml' | 'toml';
  content: Record<string, string | number | boolean>;
}

export interface CommandLineSettings {
  enableCLI: boolean;
  defaultArgs: string[];
  aliases: Record<string, string>;
}

export interface ScriptingSettings {
  enabled: boolean;
  language: 'javascript' | 'python' | 'lua';
  customScripts: string[];
}

export interface SystemIntegrationSettings {
  enableSystemNotifications: boolean;
  enableSystemTray: boolean;
  startWithSystem: boolean;
}

export interface ExternalToolSettings {
  enabledTools: string[];
  toolConfigs: Record<string, Record<string, string | number | boolean>>;
}

export interface APISettings {
  baseUrl: string;
  apiKey: string;
  timeout: number;
  retries: number;
}

export interface DebuggingSettings {
  enabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  showStackTrace: boolean;
}

export interface LoggingSettings {
  enabled: boolean;
  level: 'debug' | 'info' | 'warn' | 'error';
  outputFile: string;
  maxFileSize: number;
}

export interface ProfilingSettings {
  enabled: boolean;
  sampleRate: number;
  maxSamples: number;
}

export interface OptimizationAction {
  id: string;
  name: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  action: () => void;
}

export interface AccessibilityCategory {
  id: string;
  name: string;
  description: string;
  issues: AccessibilityIssue[];
}

export interface AccessibilityIssue {
  id: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendation: string;
}

export interface AccessibilityRecommendation {
  issueId: string;
  action: string;
  description: string;
  priority: number;
}

export interface SettingsExport {
  format: 'json' | 'yaml';
  includeDefaults: boolean;
  categories: string[];
}

export interface SettingsImport {
  source: 'file' | 'url' | 'clipboard';
  mergeStrategy: 'replace' | 'merge' | 'append';
  validation: boolean;
}
export interface PerformanceSettings {
  enableOptimizations: boolean;
  cacheSize: number;
  maxWorkers: number;
}

export interface VoiceSettings {
  enabled: boolean;
  language: string;
  voice: string;
  rate: number;
  pitch: number;
}

export interface DifficultySettings {
  level: 'easy' | 'normal' | 'hard' | 'expert';
  customModifiers: Record<string, number>;
}

export interface ProgressionSettings {
  autoSave: boolean;
  saveInterval: number;
  backupCount: number;
}

export interface ControlSettings {
  keyBindings: Record<string, string>;
  mouseSettings: {
    sensitivity: number;
    invertY: boolean;
  };
}

export interface NotificationSettings {
  enabled: boolean;
  types: string[];
  sound: boolean;
  duration: number;
}

export interface SocialSettings {
  allowFriendRequests: boolean;
  showOnlineStatus: boolean;
  allowChat: boolean;
}

export interface PrivacySettings {
  dataCollection: boolean;
  analytics: boolean;
  crashReports: boolean;
}

export interface ModerationSettings {
  autoModeration: boolean;
  filterLevel: 'none' | 'basic' | 'strict';
  allowedWords: string[];
  blockedWords: string[];
}

export interface AdvancedSettings {
  enableExperimentalFeatures: boolean;
  debugMode: boolean;
  verboseLogging: boolean;
}

export interface DeveloperSettings {
  enableDevTools: boolean;
  showDebugInfo: boolean;
  allowConsoleAccess: boolean;
}

export interface ExperimentalSettings {
  enableBetaFeatures: boolean;
  features: Record<string, boolean>;
}

export interface CustomizationSettings {
  theme: string;
  colorScheme: string;
  layout: string;
}

export interface ModSettings {
  enableMods: boolean;
  loadedMods: string[];
  modDirectory: string;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
}

export interface StatusDisplaySettings {
  showFPS: boolean;
  showMemoryUsage: boolean;
  showNetworkStatus: boolean;
}

export interface ProgressBarSettings {
  style: 'linear' | 'circular';
  showPercentage: boolean;
  animationSpeed: number;
}

export interface NotificationDisplaySettings {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  maxVisible: number;
  stackDirection: 'up' | 'down';
}

export interface ContextMenuSettings {
  enableCustom: boolean;
  items: ToolbarItem[];
}

export interface SidebarSettings {
  position: 'left' | 'right';
  width: number;
  collapsible: boolean;
}

export interface SettingChange {
  settingId: string;
  oldValue: string | number | boolean;
  newValue: string | number | boolean;
  timestamp: number;
  userId?: string;
}

export interface UnlockRequirement {
  type: 'level' | 'achievement' | 'item' | 'custom';
  value: string | number;
  description: string;
}

export interface ResolutionAction {
  id: string;
  label: string;
  description: string;
  action: () => void;
}

export interface FilterValue {
  field: string;
  operator: string;
  value: string | number;
}

export interface ActionParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object';
  required: boolean;
  defaultValue?: string | number | boolean;
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'xml';
  includeMetadata: boolean;
  compression: boolean;
}

export interface ImportOptions {
  format: 'json' | 'csv' | 'xml';
  validateSchema: boolean;
  mergeStrategy: 'replace' | 'merge';
}

export interface OptimizationCriteria {
  performance: boolean;
  memory: boolean;
  storage: boolean;
  network: boolean;
}
