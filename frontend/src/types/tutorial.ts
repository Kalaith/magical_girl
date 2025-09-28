// Interactive Tutorial System Types

export interface TutorialSystem {
  // Tutorial management
  availableTutorials: Tutorial[];
  completedTutorials: string[];
  currentTutorial: string | null;
  currentStep: number;

  // Tutorial progress and state
  tutorialProgress: Record<string, TutorialProgress>;
  globalTutorialSettings: TutorialSettings;

  // Interactive elements
  activeHighlights: TutorialHighlight[];
  activeOverlays: TutorialOverlay[];
  activeTooltips: TutorialTooltip[];

  // Tutorial history and analytics
  tutorialHistory: TutorialSession[];
  tutorialAnalytics: TutorialAnalytics;

  // Adaptive learning
  userLearningProfile: LearningProfile;
  adaptiveDifficulty: AdaptiveDifficulty;

  // Help and hints system
  contextualHelp: ContextualHelp[];
  hintSystem: HintSystem;
}

export interface Tutorial {
  id: string;
  name: string;
  description: string;
  category: TutorialCategory;

  // Tutorial structure
  steps: TutorialStep[];
  prerequisites: TutorialPrerequisite[];
  unlockRequirements: UnlockRequirement[];

  // Tutorial properties
  difficulty: TutorialDifficulty;
  estimatedDuration: number;
  isOptional: boolean;
  isRepeatable: boolean;

  // Visual and presentation
  icon: string;
  thumbnail: string;
  bannerImage?: string;

  // Tutorial metadata
  version: string;
  lastUpdated: number;
  priority: number;

  // Completion tracking
  completionRewards: TutorialReward[];
  achievements: string[];

  // Accessibility and localization
  accessibility: AccessibilityFeatures;
  availableLanguages: string[];

  // Tutorial flow control
  allowSkipping: boolean;
  allowPausing: boolean;
  autoProgress: boolean;
}

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  instruction: string;

  // Step type and behavior
  type: StepType;
  action: StepAction;
  validation: StepValidation;

  // UI interaction
  targetElement: ElementSelector | null;
  highlightType: HighlightType;
  overlayType: OverlayType;

  // Step presentation
  position: TooltipPosition;
  content: StepContent;
  media: StepMedia[];

  // Navigation and flow
  canSkip: boolean;
  autoAdvance: boolean;
  advanceDelay?: number;
  nextStep?: string; // For non-linear tutorials

  // Conditions and triggers
  showConditions: ShowCondition[];
  completionConditions: CompletionCondition[];
  timeoutDuration?: number;

  // Help and hints
  hints: StepHint[];
  commonMistakes: CommonMistake[];

  // Accessibility
  voiceOver?: string;
  screenReaderText?: string;
  keyboardNavigation?: KeyboardNavigation;
}

export interface TutorialProgress {
  tutorialId: string;
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];

  // Progress tracking
  startedAt: number;
  lastUpdated: number;
  timeSpent: number;
  pausedTime: number;

  // Completion status
  isCompleted: boolean;
  completedAt?: number;
  wasSkipped: boolean;

  // Performance metrics
  mistakes: TutorialMistake[];
  hintsUsed: string[];
  retryCount: number;

  // User engagement
  satisfactionRating?: number;
  feedback?: string;
  reportedIssues: string[];
}

export interface TutorialSettings {
  // General settings
  enableTutorials: boolean;
  autoStartTutorials: boolean;
  showCompletedTutorials: boolean;

  // Presentation settings
  animationsEnabled: boolean;
  soundEffectsEnabled: boolean;
  voiceOverEnabled: boolean;

  // Interaction settings
  allowSkipping: boolean;
  confirmBeforeSkipping: boolean;
  autoAdvanceSpeed: AutoAdvanceSpeed;

  // Accessibility settings
  highContrastMode: boolean;
  largeTextMode: boolean;
  reducedMotionMode: boolean;
  screenReaderMode: boolean;

  // Learning preferences
  preferredLearningStyle: LearningStyle;
  difficultyPreference: DifficultyPreference;
  pacePreference: PacePreference;

  // Notification settings
  reminderNotifications: boolean;
  completionNotifications: boolean;
  hintNotifications: boolean;
}

export interface TutorialHighlight {
  id: string;
  targetElement: ElementSelector;
  type: HighlightType;
  style: HighlightStyle;

  // Highlight behavior
  pulseAnimation: boolean;
  glowEffect: boolean;
  borderColor: string;
  backgroundColor?: string;

  // Timing and duration
  duration?: number;
  fadeIn: number;
  fadeOut: number;

  // Z-index and layering
  zIndex: number;
  blocksInteraction: boolean;
}

export interface TutorialOverlay {
  id: string;
  type: OverlayType;
  position: OverlayPosition;
  size: OverlaySize;

  // Content
  title?: string;
  content: string;
  media?: OverlayMedia[];
  buttons: OverlayButton[];

  // Styling
  theme: OverlayTheme;
  customStyles?: OverlayStyles;

  // Behavior
  modal: boolean;
  draggable: boolean;
  resizable: boolean;
  autoClose?: number;

  // Animation
  enterAnimation: AnimationType;
  exitAnimation: AnimationType;
  animationDuration: number;
}

export interface TutorialTooltip {
  id: string;
  targetElement: ElementSelector;
  content: TooltipContent;
  position: TooltipPosition;

  // Appearance
  style: TooltipStyle;
  arrow: boolean;
  maxWidth: number;

  // Behavior
  trigger: TooltipTrigger;
  delay: number;
  duration?: number;
  persistent: boolean;

  // Interactive elements
  actions: TooltipAction[];
  closeButton: boolean;
  nextButton: boolean;
  previousButton: boolean;
}

export interface TutorialSession {
  id: string;
  tutorialId: string;
  startedAt: number;
  completedAt?: number;
  duration: number;

  // Session details
  stepsCompleted: string[];
  stepsSkipped: string[];
  hintsUsed: string[];
  mistakes: TutorialMistake[];

  // User interaction
  interactionEvents: InteractionEvent[];
  pausedDuration: number;
  retryCount: number;

  // Outcome
  completed: boolean;
  satisfactionRating?: number;
  feedback?: string;

  // Performance metrics
  averageStepTime: number;
  totalInteractions: number;
  efficiencyScore: number;
}

export interface TutorialAnalytics {
  // Global statistics
  totalTutorialsCompleted: number;
  totalTimeSpent: number;
  averageCompletionRate: number;

  // Tutorial-specific analytics
  tutorialStats: Record<string, TutorialStats>;

  // User behavior patterns
  commonDropOffPoints: DropOffPoint[];
  commonMistakes: AnalyticsMistake[];
  preferredLearningPaths: LearningPath[];

  // Performance insights
  mostEffectiveSteps: string[];
  leastEffectiveSteps: string[];
  improvementSuggestions: string[];
}

export interface LearningProfile {
  // Learning characteristics
  learningStyle: LearningStyle;
  preferredPace: PacePreference;
  attentionSpan: number;

  // Skill assessments
  skillLevels: Record<string, SkillLevel>;
  knowledgeAreas: KnowledgeArea[];
  experienceLevel: ExperienceLevel;

  // Learning preferences
  prefersVisualContent: boolean;
  prefersAudioContent: boolean;
  prefersInteractiveContent: boolean;
  prefersTextualContent: boolean;

  // Adaptation factors
  frustrationTolerance: number;
  helpSeekingBehavior: HelpSeekingPattern;
  retryPersistence: number;

  // Progress tracking
  overallProgress: number;
  streakDays: number;
  lastActive: number;
}

export interface AdaptiveDifficulty {
  // Current difficulty settings
  currentLevel: DifficultyLevel;
  adaptationEnabled: boolean;

  // Adaptation parameters
  performanceThreshold: number;
  adaptationSensitivity: number;
  minimumSessionsBeforeAdaptation: number;

  // Performance tracking
  recentPerformance: PerformanceMetric[];
  adaptationHistory: AdaptationEvent[];

  // Difficulty adjustments
  contentComplexity: ComplexityLevel;
  hintFrequency: HintFrequency;
  timeoutDuration: number;
  validationStrictness: ValidationStrictness;
}

export interface ContextualHelp {
  id: string;
  context: HelpContext;
  content: HelpContent;
  priority: number;

  // Triggering conditions
  triggers: HelpTrigger[];
  showConditions: HelpCondition[];

  // Help presentation
  type: HelpType;
  position: HelpPosition;
  style: HelpStyle;

  // Interaction
  dismissible: boolean;
  actionable: boolean;
  actions: HelpAction[];

  // Lifecycle
  maxShowCount?: number;
  showCount: number;
  lastShown: number;
}

export interface HintSystem {
  // Hint configuration
  enabled: boolean;
  autoShowHints: boolean;
  adaptiveHints: boolean;

  // Hint delivery
  hintDelay: number;
  maxHintsPerStep: number;
  hintProgression: HintProgression;

  // Hint types available
  availableHintTypes: HintType[];
  hintPersonalization: HintPersonalization;

  // Performance tracking
  hintEffectiveness: Record<string, number>;
  hintUsageStats: HintUsageStats;
}

// Step-related interfaces
export interface StepContent {
  title: string;
  description: string;
  instruction: string;
  examples?: string[];
  tips?: string[];
  warnings?: string[];
}

export interface StepMedia {
  type: MediaType;
  url: string;
  alt?: string;
  caption?: string;
  autoPlay?: boolean;
  loop?: boolean;
}

export interface StepValidation {
  type: ValidationType;
  criteria: ValidationCriteria;
  errorMessage?: string;
  retryAllowed: boolean;
  maxRetries?: number;
}

export interface ElementSelector {
  selector: string;
  fallbackSelectors?: string[];
  waitForElement: boolean;
  timeout: number;
}

export interface ShowCondition {
  type: ConditionType;
  value: any;
  operator: ComparisonOperator;
}

export interface CompletionCondition {
  type: CompletionType;
  target?: string;
  value?: any;
  timeout?: number;
}

export interface StepHint {
  id: string;
  content: string;
  type: HintType;
  showAfter: number; // milliseconds
  priority: number;
}

export interface CommonMistake {
  description: string;
  solution: string;
  preventionTip: string;
}

export interface KeyboardNavigation {
  enabled: boolean;
  keyBindings: Record<string, string>;
  focusManagement: boolean;
}

// Tutorial mistake and error tracking
export interface TutorialMistake {
  stepId: string;
  mistakeType: MistakeType;
  description: string;
  timestamp: number;
  resolved: boolean;
  resolutionMethod?: ResolutionMethod;
}

export interface InteractionEvent {
  type: InteractionType;
  element?: string;
  timestamp: number;
  data?: any;
}

// Analytics interfaces
export interface TutorialStats {
  tutorialId: string;
  totalSessions: number;
  completionRate: number;
  averageDuration: number;
  averageStepTime: number;
  dropOffRate: number;
  satisfactionScore: number;
  commonIssues: string[];
}

export interface DropOffPoint {
  stepId: string;
  dropOffRate: number;
  commonReasons: string[];
  improvementSuggestions: string[];
}

export interface AnalyticsMistake {
  stepId: string;
  mistakeType: MistakeType;
  frequency: number;
  impact: MistakeImpact;
  solutions: string[];
}

export interface LearningPath {
  sequence: string[];
  completionRate: number;
  averageDuration: number;
  effectiveness: number;
}

// Adaptive learning interfaces
export interface PerformanceMetric {
  timestamp: number;
  accuracy: number;
  speed: number;
  mistakes: number;
  hintsUsed: number;
}

export interface AdaptationEvent {
  timestamp: number;
  oldLevel: DifficultyLevel;
  newLevel: DifficultyLevel;
  reason: AdaptationReason;
  performance: number;
}

export interface KnowledgeArea {
  area: string;
  proficiency: number;
  lastAssessed: number;
  needsRefresher: boolean;
}

// UI component interfaces
export interface OverlayButton {
  text: string;
  action: ButtonAction;
  style: ButtonStyle;
  disabled?: boolean;
}

export interface TooltipContent {
  title?: string;
  text: string;
  media?: StepMedia[];
  actions?: TooltipAction[];
}

export interface TooltipAction {
  text: string;
  action: string;
  style?: string;
}

// Help system interfaces
export interface HelpContent {
  title: string;
  description: string;
  details?: string;
  media?: StepMedia[];
  relatedTopics?: string[];
}

export interface HelpAction {
  text: string;
  action: string;
  parameters?: Record<string, any>;
}

// Enums and Type Unions
export type TutorialCategory =
  | 'getting_started' | 'basic_gameplay' | 'advanced_features' | 'combat_system'
  | 'character_management' | 'customization' | 'social_features' | 'achievements'
  | 'troubleshooting' | 'tips_and_tricks';

export type TutorialDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type StepType =
  | 'introduction' | 'demonstration' | 'practice' | 'confirmation' | 'summary'
  | 'branching' | 'checkpoint' | 'assessment';

export type StepAction =
  | 'click' | 'type' | 'drag' | 'scroll' | 'hover' | 'focus' | 'navigate'
  | 'wait' | 'observe' | 'read' | 'listen' | 'choose' | 'custom';

export type HighlightType =
  | 'border' | 'spotlight' | 'glow' | 'outline' | 'shadow' | 'pulse' | 'animate';

export type OverlayType =
  | 'modal' | 'popup' | 'sidebar' | 'banner' | 'tooltip' | 'notification'
  | 'fullscreen' | 'floating' | 'inline';

export type TooltipPosition =
  | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right'
  | 'bottom-left' | 'bottom-right' | 'center' | 'auto';

export type TooltipTrigger = 'hover' | 'click' | 'focus' | 'manual' | 'auto';

export type ValidationType =
  | 'element_click' | 'text_input' | 'navigation' | 'state_change'
  | 'time_based' | 'custom_function' | 'multiple_criteria';

export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading' | 'mixed';

export type AutoAdvanceSpeed = 'slow' | 'normal' | 'fast' | 'instant' | 'manual';

export type DifficultyPreference = 'easy' | 'normal' | 'challenging' | 'adaptive';

export type PacePreference = 'slow' | 'normal' | 'fast' | 'self_paced';

export type SkillLevel = 'novice' | 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type ExperienceLevel = 'new_user' | 'casual' | 'regular' | 'experienced' | 'expert';

export type HelpSeekingPattern = 'never' | 'reluctant' | 'normal' | 'frequent' | 'always';

export type DifficultyLevel = 'very_easy' | 'easy' | 'normal' | 'hard' | 'very_hard';

export type ComplexityLevel = 'simple' | 'moderate' | 'complex' | 'advanced';

export type HintFrequency = 'never' | 'rare' | 'normal' | 'frequent' | 'always';

export type ValidationStrictness = 'lenient' | 'normal' | 'strict' | 'precise';

export type HintType =
  | 'text' | 'visual' | 'audio' | 'animation' | 'interactive' | 'contextual';

export type HelpType =
  | 'tooltip' | 'modal' | 'inline' | 'sidebar' | 'overlay' | 'notification';

export type MistakeType =
  | 'wrong_element' | 'wrong_action' | 'timing_error' | 'input_error'
  | 'navigation_error' | 'sequence_error' | 'understanding_error';

export type ResolutionMethod = 'hint' | 'retry' | 'skip' | 'help' | 'auto_correction';

export type InteractionType =
  | 'click' | 'type' | 'scroll' | 'hover' | 'drag' | 'key_press' | 'navigation';

export type MistakeImpact = 'low' | 'medium' | 'high' | 'critical';

export type AdaptationReason =
  | 'poor_performance' | 'excellent_performance' | 'user_request'
  | 'time_based' | 'pattern_recognition';

export type MediaType = 'image' | 'video' | 'audio' | 'animation' | 'interactive';

export type ConditionType =
  | 'game_state' | 'user_level' | 'completion_status' | 'time_condition'
  | 'custom_function' | 'element_visible' | 'variable_value';

export type CompletionType =
  | 'element_interaction' | 'state_change' | 'navigation' | 'input_completion'
  | 'time_elapsed' | 'custom_validation';

export type ComparisonOperator =
  | 'equals' | 'not_equals' | 'greater_than' | 'less_than'
  | 'greater_equal' | 'less_equal' | 'contains' | 'matches';

export type ButtonAction = 'next' | 'previous' | 'skip' | 'close' | 'help' | 'retry' | 'custom';

export type ButtonStyle = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

export type AnimationType = 'fade' | 'slide' | 'scale' | 'bounce' | 'zoom' | 'none';

// Style and theming types
export type HighlightStyle = {
  borderWidth: number;
  borderStyle: string;
  borderRadius: number;
  opacity: number;
  zIndex: number;
};

export type OverlayPosition = {
  x: number | string;
  y: number | string;
  anchor: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
};

export type OverlaySize = {
  width: number | string;
  height: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
};

export type OverlayTheme = 'light' | 'dark' | 'magical' | 'system' | 'custom';

export type OverlayStyles = {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  fontSize?: string;
  fontFamily?: string;
  borderRadius?: string;
  boxShadow?: string;
};

export type TooltipStyle = {
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
  fontSize: string;
  fontWeight?: string;
  borderRadius: number;
  padding: string;
  boxShadow?: string;
};

export type HelpContext = {
  page: string;
  section: string;
  element?: string;
  gameState?: Record<string, any>;
};

export type HelpCondition = {
  type: ConditionType;
  value: any;
  operator: ComparisonOperator;
};

export type HelpTrigger = {
  event: string;
  element?: string;
  delay?: number;
  conditions?: HelpCondition[];
};

export type HelpPosition = TooltipPosition;
export type HelpStyle = TooltipStyle;

export type OverlayMedia = StepMedia;

export type HintProgression = 'linear' | 'adaptive' | 'difficulty_based' | 'performance_based';

export type HintPersonalization = {
  adaptToLearningStyle: boolean;
  adaptToPerformance: boolean;
  adaptToPreferences: boolean;
  usePersonalizedContent: boolean;
};

export type HintUsageStats = {
  totalHintsShown: number;
  totalHintsUsed: number;
  averageHintsPerTutorial: number;
  mostUsefulHints: string[];
  leastUsefulHints: string[];
};

export type ValidationCriteria = {
  target?: string;
  expectedValue?: any;
  customValidator?: string;
  toleranceLevel?: number;
};

// Accessibility types
export type AccessibilityFeatures = {
  screenReaderSupport: boolean;
  keyboardNavigation: boolean;
  highContrastMode: boolean;
  focusManagement: boolean;
  ariaLabels: boolean;
  captionedMedia: boolean;
  alternativeFormats: boolean;
};

// Reward and requirement types
export type TutorialReward = {
  type: string;
  value: number | string;
  description: string;
};

export type TutorialPrerequisite = {
  type: string;
  requirement: string;
  description: string;
};

export type UnlockRequirement = {
  type: string;
  value: number | string;
  description: string;
};