import type { StateCreator } from 'zustand';
import type {
  TutorialSystem,
  Tutorial,
  TutorialStep,
  TutorialProgress,
  TutorialSettings,
  TutorialHighlight,
  TutorialOverlay,
  TutorialTooltip,
  TutorialSession,
  LearningProfile,
  AdaptiveDifficulty,
  ContextualHelp,
  HintSystem,
  TutorialMistake,
  InteractionEvent
} from '../../types/tutorial';

export interface TutorialActions {
  // Tutorial management
  startTutorial: (tutorialId: string) => boolean;
  pauseTutorial: () => boolean;
  resumeTutorial: () => boolean;
  stopTutorial: () => boolean;
  skipTutorial: () => boolean;
  restartTutorial: (tutorialId: string) => boolean;

  // Step navigation
  nextStep: () => boolean;
  previousStep: () => boolean;
  goToStep: (stepIndex: number) => boolean;
  validateStep: (stepId: string) => boolean;
  completeStep: (stepId: string) => boolean;

  // Tutorial progression
  markTutorialComplete: (tutorialId: string) => boolean;
  updateTutorialProgress: (tutorialId: string, progress: Partial<TutorialProgress>) => void;
  recordTutorialMistake: (mistake: TutorialMistake) => void;
  recordInteractionEvent: (event: InteractionEvent) => void;

  // UI elements management
  showHighlight: (highlight: TutorialHighlight) => void;
  hideHighlight: (highlightId: string) => void;
  showOverlay: (overlay: TutorialOverlay) => void;
  hideOverlay: (overlayId: string) => void;
  showTooltip: (tooltip: TutorialTooltip) => void;
  hideTooltip: (tooltipId: string) => void;

  // Settings and configuration
  updateTutorialSettings: (settings: Partial<TutorialSettings>) => void;
  resetTutorialProgress: (tutorialId?: string) => void;
  configureLearningProfile: (profile: Partial<LearningProfile>) => void;

  // Adaptive learning
  updateAdaptiveDifficulty: (difficulty: Partial<AdaptiveDifficulty>) => void;
  recordPerformanceMetric: (metric: any) => void;
  adaptTutorialDifficulty: (tutorialId: string) => void;

  // Help and hints
  showHint: (stepId: string, hintId: string) => void;
  requestHelp: (context: string) => void;
  showContextualHelp: (helpId: string) => void;
  dismissContextualHelp: (helpId: string) => void;

  // Analytics and feedback
  provideFeedback: (tutorialId: string, rating: number, feedback?: string) => void;
  reportIssue: (tutorialId: string, stepId: string, issue: string) => void;
  trackTutorialAnalytics: () => void;

  // Tutorial discovery and recommendations
  getRecommendedTutorials: () => Tutorial[];
  searchTutorials: (query: string) => Tutorial[];
  filterTutorialsByCategory: (category: string) => Tutorial[];
}

export interface TutorialSlice extends TutorialSystem, TutorialActions {
  // Additional computed properties
  getCurrentTutorial: () => Tutorial | null;
  getCurrentStep: () => TutorialStep | null;
  getTutorialProgress: (tutorialId: string) => TutorialProgress | null;
  getCompletionPercentage: (tutorialId: string) => number;
  isStepCompleted: (tutorialId: string, stepId: string) => boolean;
  canAdvanceToNext: () => boolean;
  getAvailableTutorials: () => Tutorial[];
}

export const createTutorialSlice: StateCreator<TutorialSlice> = (set, get) => ({
  // Initial state
  availableTutorials: [],
  completedTutorials: [],
  currentTutorial: null,
  currentStep: 0,
  tutorialProgress: {},
  globalTutorialSettings: {
    enableTutorials: true,
    autoStartTutorials: true,
    showCompletedTutorials: false,
    animationsEnabled: true,
    soundEffectsEnabled: true,
    voiceOverEnabled: false,
    allowSkipping: true,
    confirmBeforeSkipping: true,
    autoAdvanceSpeed: 'normal',
    highContrastMode: false,
    largeTextMode: false,
    reducedMotionMode: false,
    screenReaderMode: false,
    preferredLearningStyle: 'mixed',
    difficultyPreference: 'adaptive',
    pacePreference: 'self_paced',
    reminderNotifications: true,
    completionNotifications: true,
    hintNotifications: true
  },
  activeHighlights: [],
  activeOverlays: [],
  activeTooltips: [],
  tutorialHistory: [],
  tutorialAnalytics: {
    totalTutorialsCompleted: 0,
    totalTimeSpent: 0,
    averageCompletionRate: 0,
    tutorialStats: {},
    commonDropOffPoints: [],
    commonMistakes: [],
    preferredLearningPaths: [],
    mostEffectiveSteps: [],
    leastEffectiveSteps: [],
    improvementSuggestions: []
  },
  userLearningProfile: {
    learningStyle: 'mixed',
    preferredPace: 'self_paced',
    attentionSpan: 300000, // 5 minutes
    skillLevels: {},
    knowledgeAreas: [],
    experienceLevel: 'new_user',
    prefersVisualContent: true,
    prefersAudioContent: false,
    prefersInteractiveContent: true,
    prefersTextualContent: true,
    frustrationTolerance: 0.7,
    helpSeekingBehavior: 'normal',
    retryPersistence: 0.8,
    overallProgress: 0,
    streakDays: 0,
    lastActive: Date.now()
  },
  adaptiveDifficulty: {
    currentLevel: 'normal',
    adaptationEnabled: true,
    performanceThreshold: 0.7,
    adaptationSensitivity: 0.3,
    minimumSessionsBeforeAdaptation: 3,
    recentPerformance: [],
    adaptationHistory: [],
    contentComplexity: 'moderate',
    hintFrequency: 'normal',
    timeoutDuration: 30000,
    validationStrictness: 'normal'
  },
  contextualHelp: [],
  hintSystem: {
    enabled: true,
    autoShowHints: true,
    adaptiveHints: true,
    hintDelay: 10000,
    maxHintsPerStep: 3,
    hintProgression: 'adaptive',
    availableHintTypes: ['text', 'visual', 'interactive'],
    hintPersonalization: {
      adaptToLearningStyle: true,
      adaptToPerformance: true,
      adaptToPreferences: true,
      usePersonalizedContent: true
    },
    hintEffectiveness: {},
    hintUsageStats: {
      totalHintsShown: 0,
      totalHintsUsed: 0,
      averageHintsPerTutorial: 0,
      mostUsefulHints: [],
      leastUsefulHints: []
    }
  },

  // Computed properties
  getCurrentTutorial: () => {
    const state = get();
    if (!state.currentTutorial) return null;
    return state.availableTutorials.find(t => t.id === state.currentTutorial) || null;
  },

  getCurrentStep: () => {
    const tutorial = get().getCurrentTutorial();
    if (!tutorial || get().currentStep < 0 || get().currentStep >= tutorial.steps.length) {
      return null;
    }
    return tutorial.steps[get().currentStep];
  },

  getTutorialProgress: (tutorialId: string) => {
    const state = get();
    return state.tutorialProgress[tutorialId] || null;
  },

  getCompletionPercentage: (tutorialId: string) => {
    const progress = get().getTutorialProgress(tutorialId);
    const tutorial = get().availableTutorials.find(t => t.id === tutorialId);

    if (!progress || !tutorial) return 0;

    return (progress.completedSteps.length / tutorial.steps.length) * 100;
  },

  isStepCompleted: (tutorialId: string, stepId: string) => {
    const progress = get().getTutorialProgress(tutorialId);
    return progress ? progress.completedSteps.includes(stepId) : false;
  },

  canAdvanceToNext: () => {
    const tutorial = get().getCurrentTutorial();
    const currentStep = get().getCurrentStep();

    if (!tutorial || !currentStep) return false;

    // Check if current step is completed or can be skipped
    const progress = get().getTutorialProgress(tutorial.id);
    const isCompleted = progress ? progress.completedSteps.includes(currentStep.id) : false;

    return isCompleted || currentStep.canSkip;
  },

  getAvailableTutorials: () => {
    const state = get();
    return state.availableTutorials.filter(tutorial => {
      // Check prerequisites and unlock requirements
      const hasPrerequisites = tutorial.prerequisites.every(prereq =>
        get().checkPrerequisite(prereq)
      );

      const hasUnlockRequirements = tutorial.unlockRequirements.every(req =>
        get().checkUnlockRequirement(req)
      );

      return hasPrerequisites && hasUnlockRequirements;
    });
  },

  // Tutorial management actions
  startTutorial: (tutorialId: string): boolean => {
    const tutorial = get().availableTutorials.find(t => t.id === tutorialId);
    if (!tutorial) return false;

    // Check if tutorial is available
    const available = get().getAvailableTutorials();
    if (!available.find(t => t.id === tutorialId)) return false;

    // Initialize tutorial progress if not exists
    const existingProgress = get().getTutorialProgress(tutorialId);
    if (!existingProgress) {
      const newProgress: TutorialProgress = {
        tutorialId,
        currentStep: 0,
        totalSteps: tutorial.steps.length,
        completedSteps: [],
        startedAt: Date.now(),
        lastUpdated: Date.now(),
        timeSpent: 0,
        pausedTime: 0,
        isCompleted: false,
        wasSkipped: false,
        mistakes: [],
        hintsUsed: [],
        retryCount: 0
      };

      set((state) => ({
        ...state,
        tutorialProgress: {
          ...state.tutorialProgress,
          [tutorialId]: newProgress
        }
      }));
    }

    // Start tutorial
    set((state) => ({
      ...state,
      currentTutorial: tutorialId,
      currentStep: existingProgress ? existingProgress.currentStep : 0
    }));

    // Start tutorial session
    get().startTutorialSession(tutorialId);

    // Show first step
    get().showCurrentStep();

    return true;
  },

  pauseTutorial: (): boolean => {
    const state = get();
    if (!state.currentTutorial) return false;

    // Record pause time
    const progress = get().getTutorialProgress(state.currentTutorial);
    if (progress) {
      set((state) => ({
        ...state,
        tutorialProgress: {
          ...state.tutorialProgress,
          [state.currentTutorial!]: {
            ...progress,
            pausedTime: progress.pausedTime + (Date.now() - progress.lastUpdated)
          }
        }
      }));
    }

    // Hide current UI elements
    get().hideAllTutorialElements();

    return true;
  },

  resumeTutorial: (): boolean => {
    const state = get();
    if (!state.currentTutorial) return false;

    // Update last updated time
    const progress = get().getTutorialProgress(state.currentTutorial);
    if (progress) {
      set((state) => ({
        ...state,
        tutorialProgress: {
          ...state.tutorialProgress,
          [state.currentTutorial!]: {
            ...progress,
            lastUpdated: Date.now()
          }
        }
      }));
    }

    // Show current step
    get().showCurrentStep();

    return true;
  },

  stopTutorial: (): boolean => {
    const state = get();
    if (!state.currentTutorial) return false;

    // Complete current session
    get().endTutorialSession(false);

    // Clear current tutorial
    set((state) => ({
      ...state,
      currentTutorial: null,
      currentStep: 0
    }));

    // Hide all tutorial elements
    get().hideAllTutorialElements();

    return true;
  },

  skipTutorial: (): boolean => {
    const state = get();
    if (!state.currentTutorial) return false;

    const tutorial = get().getCurrentTutorial();
    if (!tutorial || !tutorial.allowSkipping) return false;

    // Confirm skip if enabled
    if (state.globalTutorialSettings.confirmBeforeSkipping) {
      const confirmed = get().confirmSkip();
      if (!confirmed) return false;
    }

    // Mark tutorial as skipped
    const progress = get().getTutorialProgress(state.currentTutorial);
    if (progress) {
      set((state) => ({
        ...state,
        tutorialProgress: {
          ...state.tutorialProgress,
          [state.currentTutorial!]: {
            ...progress,
            wasSkipped: true,
            isCompleted: false
          }
        }
      }));
    }

    // Complete session
    get().endTutorialSession(false);

    // Clear current tutorial
    set((state) => ({
      ...state,
      currentTutorial: null,
      currentStep: 0
    }));

    get().hideAllTutorialElements();

    return true;
  },

  restartTutorial: (tutorialId: string): boolean => {
    // Reset tutorial progress
    set((state) => ({
      ...state,
      tutorialProgress: {
        ...state.tutorialProgress,
        [tutorialId]: {
          tutorialId,
          currentStep: 0,
          totalSteps: state.availableTutorials.find(t => t.id === tutorialId)?.steps.length || 0,
          completedSteps: [],
          startedAt: Date.now(),
          lastUpdated: Date.now(),
          timeSpent: 0,
          pausedTime: 0,
          isCompleted: false,
          wasSkipped: false,
          mistakes: [],
          hintsUsed: [],
          retryCount: 0
        }
      }
    }));

    // Start tutorial
    return get().startTutorial(tutorialId);
  },

  // Step navigation actions
  nextStep: (): boolean => {
    const state = get();
    const tutorial = get().getCurrentTutorial();

    if (!tutorial || !state.currentTutorial) return false;

    if (!get().canAdvanceToNext()) return false;

    const nextStepIndex = state.currentStep + 1;

    if (nextStepIndex >= tutorial.steps.length) {
      // Tutorial completed
      get().markTutorialComplete(state.currentTutorial);
      return true;
    }

    // Move to next step
    set((state) => ({
      ...state,
      currentStep: nextStepIndex
    }));

    // Update progress
    const progress = get().getTutorialProgress(state.currentTutorial);
    if (progress) {
      set((state) => ({
        ...state,
        tutorialProgress: {
          ...state.tutorialProgress,
          [state.currentTutorial!]: {
            ...progress,
            currentStep: nextStepIndex,
            lastUpdated: Date.now()
          }
        }
      }));
    }

    // Show new step
    get().hideAllTutorialElements();
    get().showCurrentStep();

    return true;
  },

  previousStep: (): boolean => {
    const state = get();

    if (!state.currentTutorial || state.currentStep <= 0) return false;

    const previousStepIndex = state.currentStep - 1;

    // Move to previous step
    set((state) => ({
      ...state,
      currentStep: previousStepIndex
    }));

    // Update progress
    const progress = get().getTutorialProgress(state.currentTutorial);
    if (progress) {
      set((state) => ({
        ...state,
        tutorialProgress: {
          ...state.tutorialProgress,
          [state.currentTutorial!]: {
            ...progress,
            currentStep: previousStepIndex,
            lastUpdated: Date.now()
          }
        }
      }));
    }

    // Show previous step
    get().hideAllTutorialElements();
    get().showCurrentStep();

    return true;
  },

  goToStep: (stepIndex: number): boolean => {
    const tutorial = get().getCurrentTutorial();
    const state = get();

    if (!tutorial || !state.currentTutorial) return false;
    if (stepIndex < 0 || stepIndex >= tutorial.steps.length) return false;

    // Update current step
    set((state) => ({
      ...state,
      currentStep: stepIndex
    }));

    // Update progress
    const progress = get().getTutorialProgress(state.currentTutorial);
    if (progress) {
      set((state) => ({
        ...state,
        tutorialProgress: {
          ...state.tutorialProgress,
          [state.currentTutorial!]: {
            ...progress,
            currentStep: stepIndex,
            lastUpdated: Date.now()
          }
        }
      }));
    }

    // Show new step
    get().hideAllTutorialElements();
    get().showCurrentStep();

    return true;
  },

  validateStep: (stepId: string): boolean => {
    const currentStep = get().getCurrentStep();
    if (!currentStep || currentStep.id !== stepId) return false;

    // Perform step validation based on step type
    return get().performStepValidation(currentStep);
  },

  completeStep: (stepId: string): boolean => {
    const state = get();
    const currentStep = get().getCurrentStep();

    if (!currentStep || currentStep.id !== stepId || !state.currentTutorial) return false;

    // Validate step completion
    if (!get().validateStep(stepId)) return false;

    // Mark step as completed
    const progress = get().getTutorialProgress(state.currentTutorial);
    if (progress && !progress.completedSteps.includes(stepId)) {
      set((state) => ({
        ...state,
        tutorialProgress: {
          ...state.tutorialProgress,
          [state.currentTutorial!]: {
            ...progress,
            completedSteps: [...progress.completedSteps, stepId],
            lastUpdated: Date.now()
          }
        }
      }));
    }

    // Auto-advance if enabled
    if (currentStep.autoAdvance || state.globalTutorialSettings.autoAdvanceSpeed !== 'manual') {
      const delay = currentStep.advanceDelay || get().getAutoAdvanceDelay();
      setTimeout(() => {
        get().nextStep();
      }, delay);
    }

    return true;
  },

  // Tutorial progression actions
  markTutorialComplete: (tutorialId: string): boolean => {
    const progress = get().getTutorialProgress(tutorialId);
    if (!progress) return false;

    // Mark as completed
    set((state) => ({
      ...state,
      tutorialProgress: {
        ...state.tutorialProgress,
        [tutorialId]: {
          ...progress,
          isCompleted: true,
          completedAt: Date.now()
        }
      },
      completedTutorials: state.completedTutorials.includes(tutorialId)
        ? state.completedTutorials
        : [...state.completedTutorials, tutorialId],
      currentTutorial: null,
      currentStep: 0
    }));

    // Complete tutorial session
    get().endTutorialSession(true);

    // Hide tutorial elements
    get().hideAllTutorialElements();

    // Award completion rewards
    get().awardTutorialRewards(tutorialId);

    // Update analytics
    get().updateTutorialCompletionAnalytics(tutorialId);

    return true;
  },

  updateTutorialProgress: (tutorialId: string, progressUpdate: Partial<TutorialProgress>): void => {
    const existingProgress = get().getTutorialProgress(tutorialId);
    if (!existingProgress) return;

    set((state) => ({
      ...state,
      tutorialProgress: {
        ...state.tutorialProgress,
        [tutorialId]: {
          ...existingProgress,
          ...progressUpdate,
          lastUpdated: Date.now()
        }
      }
    }));
  },

  recordTutorialMistake: (mistake: TutorialMistake): void => {
    const state = get();
    if (!state.currentTutorial) return;

    const progress = get().getTutorialProgress(state.currentTutorial);
    if (progress) {
      set((state) => ({
        ...state,
        tutorialProgress: {
          ...state.tutorialProgress,
          [state.currentTutorial!]: {
            ...progress,
            mistakes: [...progress.mistakes, mistake]
          }
        }
      }));
    }

    // Update analytics
    get().updateMistakeAnalytics(mistake);
  },

  recordInteractionEvent: (event: InteractionEvent): void => {
    // Record interaction for current tutorial session
    get().addInteractionToCurrentSession(event);
  },

  // UI elements management
  showHighlight: (highlight: TutorialHighlight): void => {
    set((state) => ({
      ...state,
      activeHighlights: [...state.activeHighlights.filter(h => h.id !== highlight.id), highlight]
    }));
  },

  hideHighlight: (highlightId: string): void => {
    set((state) => ({
      ...state,
      activeHighlights: state.activeHighlights.filter(h => h.id !== highlightId)
    }));
  },

  showOverlay: (overlay: TutorialOverlay): void => {
    set((state) => ({
      ...state,
      activeOverlays: [...state.activeOverlays.filter(o => o.id !== overlay.id), overlay]
    }));
  },

  hideOverlay: (overlayId: string): void => {
    set((state) => ({
      ...state,
      activeOverlays: state.activeOverlays.filter(o => o.id !== overlayId)
    }));
  },

  showTooltip: (tooltip: TutorialTooltip): void => {
    set((state) => ({
      ...state,
      activeTooltips: [...state.activeTooltips.filter(t => t.id !== tooltip.id), tooltip]
    }));
  },

  hideTooltip: (tooltipId: string): void => {
    set((state) => ({
      ...state,
      activeTooltips: state.activeTooltips.filter(t => t.id !== tooltipId)
    }));
  },

  // Settings and configuration
  updateTutorialSettings: (settingsUpdate: Partial<TutorialSettings>): void => {
    set((state) => ({
      ...state,
      globalTutorialSettings: {
        ...state.globalTutorialSettings,
        ...settingsUpdate
      }
    }));
  },

  resetTutorialProgress: (tutorialId?: string): void => {
    if (tutorialId) {
      // Reset specific tutorial
      set((state) => ({
        ...state,
        tutorialProgress: {
          ...state.tutorialProgress,
          [tutorialId]: {
            tutorialId,
            currentStep: 0,
            totalSteps: state.availableTutorials.find(t => t.id === tutorialId)?.steps.length || 0,
            completedSteps: [],
            startedAt: Date.now(),
            lastUpdated: Date.now(),
            timeSpent: 0,
            pausedTime: 0,
            isCompleted: false,
            wasSkipped: false,
            mistakes: [],
            hintsUsed: [],
            retryCount: 0
          }
        },
        completedTutorials: state.completedTutorials.filter(id => id !== tutorialId)
      }));
    } else {
      // Reset all tutorial progress
      set((state) => ({
        ...state,
        tutorialProgress: {},
        completedTutorials: [],
        currentTutorial: null,
        currentStep: 0
      }));
    }
  },

  configureLearningProfile: (profileUpdate: Partial<LearningProfile>): void => {
    set((state) => ({
      ...state,
      userLearningProfile: {
        ...state.userLearningProfile,
        ...profileUpdate
      }
    }));

    // Adapt tutorials based on new profile
    get().adaptTutorialsToProfile();
  },

  // Adaptive learning actions
  updateAdaptiveDifficulty: (difficultyUpdate: Partial<AdaptiveDifficulty>): void => {
    set((state) => ({
      ...state,
      adaptiveDifficulty: {
        ...state.adaptiveDifficulty,
        ...difficultyUpdate
      }
    }));
  },

  recordPerformanceMetric: (metric: any): void => {
    set((state) => ({
      ...state,
      adaptiveDifficulty: {
        ...state.adaptiveDifficulty,
        recentPerformance: [...state.adaptiveDifficulty.recentPerformance.slice(-9), metric]
      }
    }));

    // Check if adaptation is needed
    get().checkAdaptationTrigger();
  },

  adaptTutorialDifficulty: (tutorialId: string): void => {
    const state = get();
    if (!state.adaptiveDifficulty.adaptationEnabled) return;

    const averagePerformance = get().calculateAveragePerformance();

    if (averagePerformance < state.adaptiveDifficulty.performanceThreshold - 0.2) {
      // Decrease difficulty
      get().decreaseDifficulty();
    } else if (averagePerformance > state.adaptiveDifficulty.performanceThreshold + 0.2) {
      // Increase difficulty
      get().increaseDifficulty();
    }
  },

  // Help and hints actions
  showHint: (stepId: string, hintId: string): void => {
    const state = get();
    if (!state.currentTutorial) return;

    const progress = get().getTutorialProgress(state.currentTutorial);
    if (progress && !progress.hintsUsed.includes(hintId)) {
      set((state) => ({
        ...state,
        tutorialProgress: {
          ...state.tutorialProgress,
          [state.currentTutorial!]: {
            ...progress,
            hintsUsed: [...progress.hintsUsed, hintId]
          }
        }
      }));
    }

    // Update hint analytics
    get().updateHintAnalytics(hintId, true);
  },

  requestHelp: (context: string): void => {
    // Find relevant contextual help
    const relevantHelp = get().findRelevantHelp(context);

    if (relevantHelp.length > 0) {
      get().showContextualHelp(relevantHelp[0].id);
    }
  },

  showContextualHelp: (helpId: string): void => {
    const help = get().contextualHelp.find(h => h.id === helpId);
    if (!help) return;

    // Mark as shown and update count
    set((state) => ({
      ...state,
      contextualHelp: state.contextualHelp.map(h =>
        h.id === helpId
          ? { ...h, showCount: h.showCount + 1, lastShown: Date.now() }
          : h
      )
    }));

    // Display help (would integrate with UI)
    get().displayContextualHelp(help);
  },

  dismissContextualHelp: (helpId: string): void => {
    // Hide contextual help (would integrate with UI)
    get().hideContextualHelp(helpId);
  },

  // Analytics and feedback actions
  provideFeedback: (tutorialId: string, rating: number, feedback?: string): void => {
    const progress = get().getTutorialProgress(tutorialId);
    if (progress) {
      set((state) => ({
        ...state,
        tutorialProgress: {
          ...state.tutorialProgress,
          [tutorialId]: {
            ...progress,
            satisfactionRating: rating,
            feedback: feedback
          }
        }
      }));
    }

    // Update analytics
    get().updateFeedbackAnalytics(tutorialId, rating, feedback);
  },

  reportIssue: (tutorialId: string, stepId: string, issue: string): void => {
    const progress = get().getTutorialProgress(tutorialId);
    if (progress) {
      set((state) => ({
        ...state,
        tutorialProgress: {
          ...state.tutorialProgress,
          [tutorialId]: {
            ...progress,
            reportedIssues: [...progress.reportedIssues, issue]
          }
        }
      }));
    }

    // Record issue for analysis
    get().recordTutorialIssue(tutorialId, stepId, issue);
  },

  trackTutorialAnalytics: (): void => {
    // Update overall analytics
    get().updateGlobalAnalytics();
  },

  // Tutorial discovery and recommendations
  getRecommendedTutorials: (): Tutorial[] => {
    const state = get();
    const userProfile = state.userLearningProfile;
    const completed = state.completedTutorials;

    return state.availableTutorials
      .filter(tutorial => !completed.includes(tutorial.id))
      .sort((a, b) => {
        // Score tutorials based on user profile and difficulty
        const scoreA = get().calculateTutorialScore(a, userProfile);
        const scoreB = get().calculateTutorialScore(b, userProfile);
        return scoreB - scoreA;
      })
      .slice(0, 5);
  },

  searchTutorials: (query: string): Tutorial[] => {
    const state = get();
    const lowercaseQuery = query.toLowerCase();

    return state.availableTutorials.filter(tutorial =>
      tutorial.name.toLowerCase().includes(lowercaseQuery) ||
      tutorial.description.toLowerCase().includes(lowercaseQuery) ||
      tutorial.category.toLowerCase().includes(lowercaseQuery)
    );
  },

  filterTutorialsByCategory: (category: string): Tutorial[] => {
    const state = get();
    return state.availableTutorials.filter(tutorial => tutorial.category === category);
  },

  // Helper methods
  checkPrerequisite: (prereq: any): boolean => {
    // Check if prerequisite is met
    return true; // Placeholder
  },

  checkUnlockRequirement: (req: any): boolean => {
    // Check if unlock requirement is met
    return true; // Placeholder
  },

  startTutorialSession: (tutorialId: string): void => {
    // Start new tutorial session tracking
    const session: TutorialSession = {
      id: `session_${Date.now()}`,
      tutorialId,
      startedAt: Date.now(),
      duration: 0,
      stepsCompleted: [],
      stepsSkipped: [],
      hintsUsed: [],
      mistakes: [],
      interactionEvents: [],
      pausedDuration: 0,
      retryCount: 0,
      completed: false,
      averageStepTime: 0,
      totalInteractions: 0,
      efficiencyScore: 0
    };

    set((state) => ({
      ...state,
      tutorialHistory: [...state.tutorialHistory, session]
    }));
  },

  endTutorialSession: (completed: boolean): void => {
    const state = get();
    const currentSession = state.tutorialHistory[state.tutorialHistory.length - 1];

    if (currentSession) {
      const endTime = Date.now();
      const duration = endTime - currentSession.startedAt;

      set((state) => ({
        ...state,
        tutorialHistory: state.tutorialHistory.map((session, index) =>
          index === state.tutorialHistory.length - 1
            ? {
                ...session,
                completedAt: endTime,
                duration,
                completed,
                averageStepTime: session.stepsCompleted.length > 0
                  ? duration / session.stepsCompleted.length
                  : 0,
                efficiencyScore: get().calculateEfficiencyScore(session)
              }
            : session
        )
      }));
    }
  },

  showCurrentStep: (): void => {
    const currentStep = get().getCurrentStep();
    if (!currentStep) return;

    // Show highlight if target element specified
    if (currentStep.targetElement) {
      const highlight: TutorialHighlight = {
        id: `step_highlight_${currentStep.id}`,
        targetElement: currentStep.targetElement,
        type: currentStep.highlightType,
        style: get().getHighlightStyle(currentStep.highlightType),
        pulseAnimation: true,
        glowEffect: true,
        borderColor: '#ff6b6b',
        duration: undefined,
        fadeIn: 300,
        fadeOut: 300,
        zIndex: 9999,
        blocksInteraction: false
      };

      get().showHighlight(highlight);
    }

    // Show tooltip with step content
    if (currentStep.targetElement) {
      const tooltip: TutorialTooltip = {
        id: `step_tooltip_${currentStep.id}`,
        targetElement: currentStep.targetElement,
        content: {
          title: currentStep.title,
          text: currentStep.description,
          actions: [
            { text: 'Next', action: 'next' },
            { text: 'Skip', action: 'skip' }
          ]
        },
        position: currentStep.position,
        style: get().getTooltipStyle(),
        arrow: true,
        maxWidth: 300,
        trigger: 'manual',
        delay: 0,
        persistent: true,
        actions: [],
        closeButton: false,
        nextButton: true,
        previousButton: get().currentStep > 0
      };

      get().showTooltip(tooltip);
    }

    // Auto-show hints if enabled
    if (get().hintSystem.autoShowHints) {
      get().scheduleHints(currentStep);
    }
  },

  hideAllTutorialElements: (): void => {
    set((state) => ({
      ...state,
      activeHighlights: [],
      activeOverlays: [],
      activeTooltips: []
    }));
  },

  performStepValidation: (step: TutorialStep): boolean => {
    // Perform validation based on step validation criteria
    return true; // Placeholder
  },

  getAutoAdvanceDelay: (): number => {
    const state = get();
    const speedMap = {
      'slow': 3000,
      'normal': 2000,
      'fast': 1000,
      'instant': 0,
      'manual': 0
    };

    return speedMap[state.globalTutorialSettings.autoAdvanceSpeed];
  },

  confirmSkip: (): boolean => {
    // Show confirmation dialog
    return window.confirm('Are you sure you want to skip this tutorial?');
  },

  awardTutorialRewards: (tutorialId: string): void => {
    const tutorial = get().availableTutorials.find(t => t.id === tutorialId);
    if (!tutorial) return;

    // Award completion rewards
    tutorial.completionRewards.forEach(reward => {
      get().grantReward(reward);
    });
  },

  updateTutorialCompletionAnalytics: (tutorialId: string): void => {
    set((state) => ({
      ...state,
      tutorialAnalytics: {
        ...state.tutorialAnalytics,
        totalTutorialsCompleted: state.tutorialAnalytics.totalTutorialsCompleted + 1
      }
    }));
  },

  updateMistakeAnalytics: (mistake: TutorialMistake): void => {
    // Update mistake analytics
  },

  addInteractionToCurrentSession: (event: InteractionEvent): void => {
    const state = get();
    const currentSession = state.tutorialHistory[state.tutorialHistory.length - 1];

    if (currentSession) {
      set((state) => ({
        ...state,
        tutorialHistory: state.tutorialHistory.map((session, index) =>
          index === state.tutorialHistory.length - 1
            ? {
                ...session,
                interactionEvents: [...session.interactionEvents, event],
                totalInteractions: session.totalInteractions + 1
              }
            : session
        )
      }));
    }
  },

  adaptTutorialsToProfile: (): void => {
    // Adapt tutorial presentation based on learning profile
  },

  checkAdaptationTrigger: (): void => {
    const state = get();
    const recentPerformance = state.adaptiveDifficulty.recentPerformance;

    if (recentPerformance.length >= state.adaptiveDifficulty.minimumSessionsBeforeAdaptation) {
      const currentTutorial = state.currentTutorial;
      if (currentTutorial) {
        get().adaptTutorialDifficulty(currentTutorial);
      }
    }
  },

  calculateAveragePerformance: (): number => {
    const state = get();
    const recentPerformance = state.adaptiveDifficulty.recentPerformance;

    if (recentPerformance.length === 0) return 0.5;

    const sum = recentPerformance.reduce((acc, perf) => acc + perf.accuracy, 0);
    return sum / recentPerformance.length;
  },

  decreaseDifficulty: (): void => {
    const state = get();
    const levelMap = {
      'very_hard': 'hard',
      'hard': 'normal',
      'normal': 'easy',
      'easy': 'very_easy',
      'very_easy': 'very_easy'
    };

    const newLevel = levelMap[state.adaptiveDifficulty.currentLevel] as any;

    set((state) => ({
      ...state,
      adaptiveDifficulty: {
        ...state.adaptiveDifficulty,
        currentLevel: newLevel,
        adaptationHistory: [...state.adaptiveDifficulty.adaptationHistory, {
          timestamp: Date.now(),
          oldLevel: state.adaptiveDifficulty.currentLevel,
          newLevel,
          reason: 'poor_performance',
          performance: get().calculateAveragePerformance()
        }]
      }
    }));
  },

  increaseDifficulty: (): void => {
    const state = get();
    const levelMap = {
      'very_easy': 'easy',
      'easy': 'normal',
      'normal': 'hard',
      'hard': 'very_hard',
      'very_hard': 'very_hard'
    };

    const newLevel = levelMap[state.adaptiveDifficulty.currentLevel] as any;

    set((state) => ({
      ...state,
      adaptiveDifficulty: {
        ...state.adaptiveDifficulty,
        currentLevel: newLevel,
        adaptationHistory: [...state.adaptiveDifficulty.adaptationHistory, {
          timestamp: Date.now(),
          oldLevel: state.adaptiveDifficulty.currentLevel,
          newLevel,
          reason: 'excellent_performance',
          performance: get().calculateAveragePerformance()
        }]
      }
    }));
  },

  updateHintAnalytics: (hintId: string, wasUsed: boolean): void => {
    set((state) => ({
      ...state,
      hintSystem: {
        ...state.hintSystem,
        hintUsageStats: {
          ...state.hintSystem.hintUsageStats,
          totalHintsShown: state.hintSystem.hintUsageStats.totalHintsShown + 1,
          totalHintsUsed: wasUsed
            ? state.hintSystem.hintUsageStats.totalHintsUsed + 1
            : state.hintSystem.hintUsageStats.totalHintsUsed
        }
      }
    }));
  },

  findRelevantHelp: (context: string): any[] => {
    const state = get();
    return state.contextualHelp.filter(help =>
      help.context.page === context ||
      help.context.section === context
    );
  },

  displayContextualHelp: (help: any): void => {
    // Display help in UI
  },

  hideContextualHelp: (helpId: string): void => {
    // Hide help from UI
  },

  updateFeedbackAnalytics: (tutorialId: string, rating: number, feedback?: string): void => {
    // Update feedback analytics
  },

  recordTutorialIssue: (tutorialId: string, stepId: string, issue: string): void => {
    // Record issue for analysis
  },

  updateGlobalAnalytics: (): void => {
    // Update global tutorial analytics
  },

  calculateTutorialScore: (tutorial: Tutorial, userProfile: LearningProfile): number => {
    let score = 0;

    // Base score from priority
    score += tutorial.priority * 10;

    // Difficulty match
    if (tutorial.difficulty === userProfile.experienceLevel) {
      score += 20;
    }

    // Category preferences
    if (userProfile.skillLevels[tutorial.category]) {
      score += userProfile.skillLevels[tutorial.category] * 10;
    }

    return score;
  },

  getHighlightStyle: (type: any): any => {
    return {
      borderWidth: 2,
      borderStyle: 'solid',
      borderRadius: 4,
      opacity: 0.8,
      zIndex: 9999
    };
  },

  getTooltipStyle: (): any => {
    return {
      backgroundColor: '#333',
      textColor: '#fff',
      borderColor: '#555',
      fontSize: '14px',
      borderRadius: 6,
      padding: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    };
  },

  scheduleHints: (step: TutorialStep): void => {
    step.hints.forEach(hint => {
      setTimeout(() => {
        get().showHint(step.id, hint.id);
      }, hint.showAfter);
    });
  },

  calculateEfficiencyScore: (session: TutorialSession): number => {
    // Calculate efficiency based on time, mistakes, and hints used
    const baseScore = 100;
    const mistakePenalty = session.mistakes.length * 10;
    const hintPenalty = session.hintsUsed.length * 5;
    const timePenalty = session.averageStepTime > 60000 ? 20 : 0;

    return Math.max(0, baseScore - mistakePenalty - hintPenalty - timePenalty);
  },

  grantReward: (reward: any): void => {
    // Grant tutorial reward to player
  }
});