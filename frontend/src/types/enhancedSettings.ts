// Enhanced Settings Panel Types

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
  currentValue: any;
  defaultValue: any;
  possibleValues?: any[];
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
  oldValue: any;
  newValue: any;
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
  | 'boolean' | 'number' | 'string' | 'select' | 'multiselect'
  | 'range' | 'color' | 'file' | 'directory' | 'keybind'
  | 'resolution' | 'custom' | 'json' | 'array' | 'object';

export type AccessLevel = 'basic' | 'intermediate' | 'advanced' | 'expert' | 'developer';

export type SettingVisibility = 'always' | 'conditional' | 'advanced' | 'hidden' | 'debug';

export type ProfileType = 'user' | 'preset' | 'shared' | 'automatic' | 'backup';

export type ChangeSource = 'user' | 'auto' | 'import' | 'reset' | 'optimization' | 'system';

export type ValidationLevel = 'none' | 'basic' | 'standard' | 'strict' | 'paranoid';

export type ConflictType = 'dependency' | 'mutual_exclusion' | 'resource' | 'performance' | 'compatibility';

export type LayoutStyle = 'list' | 'grid' | 'tabs' | 'accordion' | 'wizard' | 'custom';

export type GroupingMethod = 'category' | 'type' | 'alphabetical' | 'usage' | 'custom';

export type SortingMethod = 'alphabetical' | 'priority' | 'recent' | 'frequency' | 'manual';

export type SettingsTheme = 'light' | 'dark' | 'auto' | 'high_contrast' | 'custom';

export type SuggestionType = 'performance' | 'accessibility' | 'usability' | 'security' | 'quality';

export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

export type WCAGLevel = 'A' | 'AA' | 'AAA' | 'none';

export type HelpPosition = 'sidebar' | 'modal' | 'tooltip' | 'inline' | 'overlay';

// Complex type definitions
export type Resolution = {
  width: number;
  height: number;
  label?: string;
};

export type AspectRatio = '16:9' | '16:10' | '4:3' | '21:9' | 'auto' | 'custom';

export type DisplayMode = 'windowed' | 'fullscreen' | 'borderless' | 'maximized';

export type ColorProfile = 'sRGB' | 'DCI-P3' | 'Rec2020' | 'Adobe_RGB' | 'auto';

export type ThemeSettings = {
  name: string;
  isDark: boolean;
  primaryColor: string;
  accentColor: string;
  customCSS?: string;
};

export type AnimationQuality = 'none' | 'reduced' | 'normal' | 'high' | 'ultra';

export type RenderQuality = 'low' | 'medium' | 'high' | 'ultra' | 'custom';

export type TextureQuality = 'low' | 'medium' | 'high' | 'ultra';

export type ShadowQuality = 'none' | 'low' | 'medium' | 'high' | 'ultra';

export type LightingQuality = 'basic' | 'standard' | 'enhanced' | 'realistic';

export type AntiAliasingType = 'none' | 'FXAA' | 'MSAA' | 'TAA' | 'DLAA';

export type ShaderComplexity = 'basic' | 'standard' | 'complex' | 'ultra';

export type RenderPipeline = 'forward' | 'deferred' | 'hybrid' | 'raytracing';

export type AudioQuality = 'low' | 'medium' | 'high' | 'lossless';

export type AudioCompression = 'none' | 'light' | 'standard' | 'aggressive';

export type AudioEngine = 'standard' | 'enhanced' | 'spatial' | 'custom';

export type CurrencyFormat = 'short' | 'long' | 'scientific' | 'custom';

export type NumberFormat = 'standard' | 'grouped' | 'scientific' | 'engineering';

export type NavigationStyle = 'tabs' | 'sidebar' | 'breadcrumb' | 'tree' | 'custom';

export type ColorScheme = 'system' | 'light' | 'dark' | 'high_contrast' | 'custom';

export type IconTheme = 'default' | 'minimal' | 'detailed' | 'colorful' | 'custom';

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
  popularValues: any[];
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
  value: any;
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
  updateSetting: (settingId: string, value: any) => void;
  resetSetting: (settingId: string) => void;
  resetCategory: (categoryId: string) => void;
  resetAllSettings: () => void;
  previewSetting: (settingId: string, value: any) => void;
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
export type DependencyType = 'enables' | 'disables' | 'requires' | 'conflicts' | 'modifies';
export type DependencyCondition = 'equals' | 'not_equals' | 'greater' | 'less' | 'contains';
export type DependencyAction = 'show' | 'hide' | 'enable' | 'disable' | 'modify' | 'validate';
export type ConflictSeverity = 'info' | 'warning' | 'error' | 'critical';
export type ConflictResolutionMethod = 'auto' | 'prompt' | 'manual' | 'ignore';
export type ValidationType = 'range' | 'pattern' | 'custom' | 'dependency' | 'format';
export type ValidationSeverity = 'info' | 'warning' | 'error' | 'critical';
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';
export type FilterType = 'category' | 'type' | 'access_level' | 'status' | 'custom';
export type ActionFunction = string; // Function name or code
export type FontWeight = 'normal' | 'bold' | 'light' | 'medium' | 'black';
export type FontStyle = 'normal' | 'italic' | 'oblique';
export type ToolbarPosition = 'top' | 'bottom' | 'left' | 'right' | 'floating';
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto';
export type TooltipStyle = 'simple' | 'detailed' | 'minimal' | 'rich' | 'custom';

// Placeholder types for complex nested structures
export type CustomConstraint = any;
export type ValidationMessage = any;
export type ValidationCondition = any;
export type UserPattern = any;
export type EqualizerBand = any;
export type CustomEqualizerPreset = any;
export type AutoAction = any;
export type AutoCondition = any;
export type AutoSchedule = any;
export type SmartAssistPrivacy = any;
export type ToolbarItem = any;
export type QuickAction = any;
export type QuickShortcut = any;
export type ValidationInfo = any;
export type ValidationWarning = any;
export type CategoryStyling = any;
export type ExternalLink = any;
export type SectionLayout = any;
export type DisplayCondition = any;
export type CustomColorScheme = any;
export type CustomFontSettings = any;
export type CustomLayout = any;
export type WidgetPreference = any;
export type SettingsShortcut = any;
export type QuickAccessSettings = any;
export type AutomationSettings = any;
export type ConfigFile = any;
export type CommandLineSettings = any;
export type ScriptingSettings = any;
export type SystemIntegrationSettings = any;
export type ExternalToolSettings = any;
export type APISettings = any;
export type DebuggingSettings = any;
export type LoggingSettings = any;
export type ProfilingSettings = any;
export type OptimizationAction = any;
export type AccessibilityCategory = any;
export type AccessibilityIssue = any;
export type AccessibilityRecommendation = any;
export type SettingsExport = any;
export type SettingsImport = any;
export type PerformanceSettings = any;
export type VoiceSettings = any;
export type DifficultySettings = any;
export type ProgressionSettings = any;
export type ControlSettings = any;
export type NotificationSettings = any;
export type SocialSettings = any;
export type PrivacySettings = any;
export type ModerationSettings = any;
export type AdvancedSettings = any;
export type DeveloperSettings = any;
export type ExperimentalSettings = any;
export type CustomizationSettings = any;
export type ModSettings = any;
export type UserPreferences = any;
export type StatusDisplaySettings = any;
export type ProgressBarSettings = any;
export type NotificationDisplaySettings = any;
export type ContextMenuSettings = any;
export type SidebarSettings = any;
export type SettingChange = any;
export type UnlockRequirement = any;
export type ResolutionAction = any;
export type FilterValue = any;
export type ActionParameter = any;
export type ExportOptions = any;
export type ImportOptions = any;
export type OptimizationCriteria = any;