// Transformation system slice - Magical girl transformation sequences
import type { StateCreator } from 'zustand';
import type {
  TransformationSystem,
  TransformationSequence,
  ActiveTransformation,
  TransformationRecord,
  TransformationSettings,
  TransformationEvent,
  TransformationCustomization,
  TransformationMastery,
  TransformationStage,
  MasteryTier
} from '../../types/transformation';
import type { MagicalGirl } from '../../types/magicalGirl';
import { TRANSFORMATION_CONFIG } from '../../data/transformationConfig';

export interface TransformationSlice {
  // State
  transformationSystem: TransformationSystem;

  // Transformation Management
  startTransformation: (characterId: string, transformationId: string, context?: string) => Promise<string>;
  completeTransformation: (activeId: string) => void;
  interruptTransformation: (activeId: string, reason?: string) => void;
  skipTransformation: (activeId: string) => void;
  pauseTransformation: (activeId: string) => void;
  resumeTransformation: (activeId: string) => void;

  // Sequence Control
  advanceStage: (activeId: string) => void;
  setStage: (activeId: string, stage: TransformationStage) => void;
  updateProgress: (activeId: string, progress: number) => void;
  triggerEffect: (activeId: string, effectId: string) => void;

  // Transformation Library
  unlockTransformation: (transformationId: string, characterId: string, source?: string) => void;
  getAvailableTransformations: (characterId: string) => TransformationSequence[];
  getTransformationById: (transformationId: string) => TransformationSequence | null;
  canTransform: (characterId: string, transformationId: string) => boolean;

  // Mastery System
  gainMasteryExperience: (transformationId: string, amount: number) => void;
  levelUpMastery: (transformationId: string) => boolean;
  getTotalMastery: (characterId: string) => number;
  getMasteryTier: (transformationId: string) => MasteryTier;

  // Customization
  saveCustomization: (customization: TransformationCustomization) => void;
  loadCustomization: (transformationId: string, characterId: string) => TransformationCustomization | null;
  unlockCustomizationOption: (optionId: string, characterId: string) => void;
  applyCustomization: (activeId: string, customization: Partial<TransformationCustomization>) => void;

  // History and Analytics
  recordTransformation: (record: Omit<TransformationRecord, 'id' | 'timestamp'>) => void;
  getTransformationHistory: (characterId?: string, limit?: number) => TransformationRecord[];
  getTransformationStats: (characterId?: string) => TransformationAnalytics;
  getMostUsedTransformations: (characterId?: string, limit?: number) => { transformationId: string; count: number }[];

  // Events
  addTransformationEvent: (event: Omit<TransformationEvent, 'timestamp'>) => void;
  getRecentEvents: (limit?: number) => TransformationEvent[];
  clearEvents: () => void;

  // Settings
  updateTransformationSettings: (settings: Partial<TransformationSettings>) => void;

  // Utility
  getActiveTransformation: (characterId?: string) => ActiveTransformation | null;
  getAllActiveTransformations: () => ActiveTransformation[];
  isCharacterTransformed: (characterId: string) => boolean;
  getTransformationPower: (activeId: string) => number;
  estimateTransformationTime: (transformationId: string, skipOptions?: SkipOption[]) => number;

  // Internal helper
  simulateTransformationSequence: (activeId: string) => void;
}

export interface TransformationAnalytics {
  totalTransformations: number;
  totalTime: number;
  averageTime: number;
  mostUsedElement: string;
  mostUsedRarity: string;
  completionRate: number;
  skipRate: number;
  interruptionRate: number;
  masteryLevel: number;
  favoriteTransformation: string;
  transformationStreak: number;
  perfectTransformations: number;
}

export interface SkipOption {
  stage: string;
  enabled: boolean;
  reason: string;
}

export const createTransformationSlice: StateCreator<
  TransformationSlice & {
    addNotification: (notification: any) => void;
    gameState: { magicalGirls: MagicalGirl[] };
  },
  [],
  [],
  TransformationSlice
> = (set, get) => ({
  transformationSystem: {
    transformations: TRANSFORMATION_CONFIG.defaultTransformations,
    activeTransformations: [],
    transformationHistory: [],
    transformationSettings: {
      animationQuality: 'High',
      animationSpeed: 1.0,
      skipAnimations: false,
      autoSkipRepeated: false,
      voiceVolume: 80,
      effectsVolume: 75,
      musicVolume: 70,
      muteRepeated: false,
      particleQuality: 'High',
      lightingQuality: 'High',
      cameraShake: true,
      screenEffects: true,
      subtitles: true,
      colorBlindSupport: false,
      reducedMotion: false,
      highContrast: false,
      allowInterruption: true,
      requireConfirmation: false,
      showProgress: true,
      saveReplays: true
    }
  },

  startTransformation: async (characterId, transformationId, context = 'Manual') => {
    const transformation = get().getTransformationById(transformationId);
    if (!transformation) throw new Error('Transformation not found');

    if (!get().canTransform(characterId, transformationId)) {
      throw new Error('Character cannot use this transformation');
    }

    // Check if character is already transforming
    const existingActive = get().getActiveTransformation(characterId);
    if (existingActive) {
      get().interruptTransformation(existingActive.transformationId, 'New transformation started');
    }

    const activeId = `active_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const activeTransformation: ActiveTransformation = {
      transformationId: activeId,
      characterId,
      startTime: Date.now(),
      duration: transformation.duration,
      stage: 'Preparing',
      currentStageIndex: 0,
      timeElapsed: 0,
      timeRemaining: transformation.duration,
      isPaused: false,
      isSkippable: transformation.animation.skippable,
      activeBonuses: [...transformation.statBonuses],
      activeEffects: [...transformation.specialEffects],
      animationProgress: 0,
      completedStages: []
    };

    set(state => ({
      transformationSystem: {
        ...state.transformationSystem,
        activeTransformations: [...state.transformationSystem.activeTransformations, activeTransformation]
      }
    }));

    // Add transformation event
    get().addTransformationEvent({
      type: 'transformation_started',
      transformationId,
      characterId,
      data: { context, activeId }
    });

    get().addNotification({
      type: 'info',
      title: 'Transformation Started!',
      message: `${transformation.name} sequence initiated`,
      icon: '✨'
    });

    // Simulate transformation progression
    get().simulateTransformationSequence(activeId);

    return activeId;
  },

  simulateTransformationSequence: (activeId: string) => {
    const active = get().getAllActiveTransformations().find(a => a.transformationId === activeId);
    if (!active) return;

    const transformation = get().getTransformationById(active.transformationId);
    if (!transformation) return;

    const settings = get().transformationSystem.transformationSettings;
    const speedMultiplier = settings.animationSpeed;
    const stages = transformation.animation.stages;

    let currentTime = 0;
    let stageIndex = 0;

    const progressInterval = setInterval(() => {
      const activeTransformation = get().getAllActiveTransformations().find(a => a.transformationId === activeId);
      if (!activeTransformation || activeTransformation.isPaused) return;

      currentTime += 100; // Update every 100ms
      const adjustedTime = currentTime * speedMultiplier;

      // Update progress
      set(state => {
        const updatedActive = state.transformationSystem.activeTransformations.map(a =>
          a.transformationId === activeId
            ? {
                ...a,
                timeElapsed: adjustedTime,
                timeRemaining: Math.max(0, a.duration - adjustedTime),
                animationProgress: Math.min(100, (adjustedTime / a.duration) * 100)
              }
            : a
        );

        return {
          transformationSystem: {
            ...state.transformationSystem,
            activeTransformations: updatedActive
          }
        };
      });

      // Check stage progression
      if (stageIndex < stages.length) {
        const currentStage = stages[stageIndex];
        if (adjustedTime >= currentStage.startTime && !activeTransformation.completedStages.includes(currentStage.id)) {
          get().advanceStage(activeId);
          get().addTransformationEvent({
            type: 'stage_completed',
            transformationId: activeTransformation.transformationId,
            characterId: activeTransformation.characterId,
            data: { stage: currentStage.name, stageIndex }
          });
          stageIndex++;
        }
      }

      // Check completion
      if (adjustedTime >= activeTransformation.duration) {
        clearInterval(progressInterval);
        get().completeTransformation(activeId);
      }
    }, 100);

    // Store interval reference for cleanup
    set(state => ({
      transformationSystem: {
        ...state.transformationSystem,
        activeTransformations: state.transformationSystem.activeTransformations.map(a =>
          a.transformationId === activeId
            ? { ...a, intervalId: progressInterval as any }
            : a
        )
      }
    }));
  },

  completeTransformation: (activeId) => {
    const active = get().getAllActiveTransformations().find(a => a.transformationId === activeId);
    if (!active) return;

    const transformation = get().getTransformationById(active.transformationId);
    if (!transformation) return;

    // Calculate mastery experience gained
    const masteryGain = Math.floor(transformation.duration / 1000) + (transformation.rarity === 'Legendary' ? 50 : transformation.rarity === 'Epic' ? 30 : 20);
    get().gainMasteryExperience(active.transformationId, masteryGain);

    // Record the transformation
    get().recordTransformation({
      transformationId: active.transformationId,
      characterId: active.characterId,
      duration: active.timeElapsed,
      completed: true,
      skipped: false,
      interrupted: false,
      masteryGained: masteryGain,
      situation: 'Manual' as any,
      location: 'Home',
      witnesses: [],
      powerLevel: get().getTransformationPower(activeId),
      effectiveness: 100,
      reactions: []
    });

    // Remove from active transformations
    set(state => ({
      transformationSystem: {
        ...state.transformationSystem,
        activeTransformations: state.transformationSystem.activeTransformations.filter(a => a.transformationId !== activeId)
      }
    }));

    get().addTransformationEvent({
      type: 'transformation_completed',
      transformationId: active.transformationId,
      characterId: active.characterId,
      data: { masteryGain, duration: active.timeElapsed }
    });

    get().addNotification({
      type: 'success',
      title: 'Transformation Complete!',
      message: `${transformation.name} completed successfully`,
      icon: '🌟'
    });
  },

  interruptTransformation: (activeId, reason = 'Manual interruption') => {
    const active = get().getAllActiveTransformations().find(a => a.transformationId === activeId);
    if (!active) return;

    // Clear any running intervals
    if ((active as any).intervalId) {
      clearInterval((active as any).intervalId);
    }

    // Record the interrupted transformation
    get().recordTransformation({
      transformationId: active.transformationId,
      characterId: active.characterId,
      duration: active.timeElapsed,
      completed: false,
      skipped: false,
      interrupted: true,
      masteryGained: 0,
      situation: 'Manual' as any,
      location: 'Home',
      witnesses: [],
      powerLevel: 0,
      effectiveness: (active.timeElapsed / active.duration) * 100,
      reactions: []
    });

    // Remove from active transformations
    set(state => ({
      transformationSystem: {
        ...state.transformationSystem,
        activeTransformations: state.transformationSystem.activeTransformations.filter(a => a.transformationId !== activeId)
      }
    }));

    get().addTransformationEvent({
      type: 'transformation_interrupted',
      transformationId: active.transformationId,
      characterId: active.characterId,
      data: { reason, progress: active.animationProgress }
    });

    get().addNotification({
      type: 'warning',
      title: 'Transformation Interrupted',
      message: reason,
      icon: '⚠️'
    });
  },

  skipTransformation: (activeId) => {
    const active = get().getAllActiveTransformations().find(a => a.transformationId === activeId);
    if (!active || !active.isSkippable) return;

    // Clear any running intervals
    if ((active as any).intervalId) {
      clearInterval((active as any).intervalId);
    }

    const transformation = get().getTransformationById(active.transformationId);
    if (!transformation) return;

    // Record the skipped transformation
    get().recordTransformation({
      transformationId: active.transformationId,
      characterId: active.characterId,
      duration: active.timeElapsed,
      completed: true,
      skipped: true,
      interrupted: false,
      masteryGained: 10, // Reduced mastery for skipping
      situation: 'Manual' as any,
      location: 'Home',
      witnesses: [],
      powerLevel: get().getTransformationPower(activeId),
      effectiveness: 90, // Slightly reduced effectiveness
      reactions: []
    });

    // Remove from active transformations
    set(state => ({
      transformationSystem: {
        ...state.transformationSystem,
        activeTransformations: state.transformationSystem.activeTransformations.filter(a => a.transformationId !== activeId)
      }
    }));

    get().addTransformationEvent({
      type: 'transformation_completed',
      transformationId: active.transformationId,
      characterId: active.characterId,
      data: { skipped: true, masteryGain: 10 }
    });

    get().addNotification({
      type: 'info',
      title: 'Transformation Skipped',
      message: `${transformation.name} completed instantly`,
      icon: '⏭️'
    });
  },

  pauseTransformation: (activeId) => {
    set(state => ({
      transformationSystem: {
        ...state.transformationSystem,
        activeTransformations: state.transformationSystem.activeTransformations.map(a =>
          a.transformationId === activeId
            ? { ...a, isPaused: true }
            : a
        )
      }
    }));
  },

  resumeTransformation: (activeId) => {
    set(state => ({
      transformationSystem: {
        ...state.transformationSystem,
        activeTransformations: state.transformationSystem.activeTransformations.map(a =>
          a.transformationId === activeId
            ? { ...a, isPaused: false }
            : a
        )
      }
    }));
  },

  advanceStage: (activeId) => {
    set(state => ({
      transformationSystem: {
        ...state.transformationSystem,
        activeTransformations: state.transformationSystem.activeTransformations.map(a =>
          a.transformationId === activeId
            ? {
                ...a,
                currentStageIndex: a.currentStageIndex + 1,
                stage: a.currentStageIndex < 4 ?
                  (['Preparing', 'Chanting', 'Transforming', 'Completing', 'Completed'] as TransformationStage[])[a.currentStageIndex + 1]
                  : 'Completed'
              }
            : a
        )
      }
    }));
  },

  setStage: (activeId, stage) => {
    set(state => ({
      transformationSystem: {
        ...state.transformationSystem,
        activeTransformations: state.transformationSystem.activeTransformations.map(a =>
          a.transformationId === activeId
            ? { ...a, stage }
            : a
        )
      }
    }));
  },

  updateProgress: (activeId, progress) => {
    set(state => ({
      transformationSystem: {
        ...state.transformationSystem,
        activeTransformations: state.transformationSystem.activeTransformations.map(a =>
          a.transformationId === activeId
            ? { ...a, animationProgress: Math.min(100, Math.max(0, progress)) }
            : a
        )
      }
    }));
  },

  triggerEffect: (activeId, effectId) => {
    const active = get().getAllActiveTransformations().find(a => a.transformationId === activeId);
    if (!active) return;

    get().addTransformationEvent({
      type: 'effect_triggered',
      transformationId: active.transformationId,
      characterId: active.characterId,
      data: { effectId, stage: active.stage }
    });
  },

  unlockTransformation: (transformationId, characterId, source = 'Manual') => {
    set(state => ({
      transformationSystem: {
        ...state.transformationSystem,
        transformations: state.transformationSystem.transformations.map(t =>
          t.id === transformationId
            ? { ...t, isUnlocked: true, unlockedAt: Date.now(), source: source as any }
            : t
        )
      }
    }));

    get().addTransformationEvent({
      type: 'new_unlocked',
      transformationId,
      characterId,
      data: { source }
    });

    get().addNotification({
      type: 'success',
      title: 'New Transformation Unlocked!',
      message: `${transformationId} is now available`,
      icon: '🔓'
    });
  },

  getAvailableTransformations: (characterId) => {
    const character = get().gameState.magicalGirls.find(g => g.id === characterId);
    if (!character) return [];

    return get().transformationSystem.transformations.filter(t => {
      if (!t.isUnlocked) return false;

      // Check element compatibility
      if (t.element !== character.element && t.element !== 'Universal') return false;

      // Check requirements
      return t.requirements.every(req => {
        switch (req.type) {
          case 'level':
            return character.level >= req.value;
          case 'element':
            return character.element === req.value;
          default:
            return true;
        }
      });
    });
  },

  getTransformationById: (transformationId) => {
    return get().transformationSystem.transformations.find(t => t.id === transformationId) || null;
  },

  canTransform: (characterId, transformationId) => {
    const transformation = get().getTransformationById(transformationId);
    if (!transformation || !transformation.isUnlocked) return false;

    const character = get().gameState.magicalGirls.find(g => g.id === characterId);
    if (!character) return false;

    // Check if character is already transforming
    if (get().isCharacterTransformed(characterId)) return false;

    // Check costs
    const manaCost = transformation.costs.find(c => c.resource === 'mana');
    if (manaCost && character.stats.magic < manaCost.amount) return false;

    return true;
  },

  gainMasteryExperience: (transformationId, amount) => {
    set(state => ({
      transformationSystem: {
        ...state.transformationSystem,
        transformations: state.transformationSystem.transformations.map(t =>
          t.id === transformationId
            ? {
                ...t,
                experience: Math.min(t.maxExperience, t.experience + amount),
                mastery: {
                  ...t.mastery,
                  experience: Math.min(t.mastery.maxExperience, t.mastery.experience + amount)
                }
              }
            : t
        )
      }
    }));

    // Check for level up
    if (get().levelUpMastery(transformationId)) {
      get().addTransformationEvent({
        type: 'mastery_gained',
        transformationId,
        characterId: '',
        data: { amount, levelUp: true }
      });
    }
  },

  levelUpMastery: (transformationId) => {
    const transformation = get().getTransformationById(transformationId);
    if (!transformation) return false;

    if (transformation.mastery.experience >= transformation.mastery.maxExperience && transformation.mastery.level < transformation.maxLevel) {
      set(state => ({
        transformationSystem: {
          ...state.transformationSystem,
          transformations: state.transformationSystem.transformations.map(t =>
            t.id === transformationId
              ? {
                  ...t,
                  mastery: {
                    ...t.mastery,
                    level: t.mastery.level + 1,
                    experience: 0,
                    maxExperience: Math.floor(t.mastery.maxExperience * 1.2),
                    tier: t.mastery.level >= 10 ? 'Grandmaster' :
                          t.mastery.level >= 8 ? 'Master' :
                          t.mastery.level >= 6 ? 'Expert' :
                          t.mastery.level >= 4 ? 'Adept' :
                          t.mastery.level >= 2 ? 'Apprentice' : 'Novice'
                  }
                }
              : t
          )
        }
      }));

      get().addNotification({
        type: 'success',
        title: 'Mastery Level Up!',
        message: `${transformation.name} mastery increased`,
        icon: '⭐'
      });

      return true;
    }

    return false;
  },

  getTotalMastery: (characterId) => {
    const availableTransformations = get().getAvailableTransformations(characterId);
    return availableTransformations.reduce((total, t) => total + t.mastery.level, 0);
  },

  getMasteryTier: (transformationId) => {
    const transformation = get().getTransformationById(transformationId);
    return transformation?.mastery.tier || 'Novice';
  },

  saveCustomization: (customization) => {
    set(state => {
      // Find existing customization or create new one
      const existingIndex = state.transformationSystem.customizations?.findIndex(
        c => c.transformationId === customization.transformationId && c.characterId === customization.characterId
      ) ?? -1;

      const customizations = state.transformationSystem.customizations || [];

      if (existingIndex >= 0) {
        // Update existing customization
        customizations[existingIndex] = customization;
      } else {
        // Add new customization
        customizations.push(customization);
      }

      return {
        transformationSystem: {
          ...state.transformationSystem,
          customizations
        }
      };
    });

    get().addNotification({
      type: 'success',
      title: 'Customization Saved',
      message: 'Your transformation customization has been saved',
      icon: '💾'
    });
  },

  loadCustomization: (transformationId, characterId) => {
    const customizations = get().transformationSystem.customizations || [];
    return customizations.find(
      c => c.transformationId === transformationId && c.characterId === characterId
    ) || null;
  },

  unlockCustomizationOption: (optionId, characterId) => {
    set(state => {
      const customizations = state.transformationSystem.customizations || [];

      // Find or create customization for this character
      const characterCustomizations = customizations.filter(c => c.characterId === characterId);

      // Add the unlocked option to all relevant customizations
      const updatedCustomizations = customizations.map(customization => {
        if (customization.characterId === characterId) {
          return {
            ...customization,
            unlockedCustomizations: [...new Set([...customization.unlockedCustomizations, optionId])]
          };
        }
        return customization;
      });

      return {
        transformationSystem: {
          ...state.transformationSystem,
          customizations: updatedCustomizations
        }
      };
    });

    get().addTransformationEvent({
      type: 'customization_changed',
      transformationId: '',
      characterId,
      data: { unlockedOption: optionId }
    });

    get().addNotification({
      type: 'success',
      title: 'New Customization Unlocked!',
      message: `New customization option is now available`,
      icon: '🎨'
    });
  },

  applyCustomization: (activeId, customization) => {
    const active = get().getAllActiveTransformations().find(a => a.transformationId === activeId);
    if (!active) return;

    set(state => ({
      transformationSystem: {
        ...state.transformationSystem,
        activeTransformations: state.transformationSystem.activeTransformations.map(a =>
          a.transformationId === activeId
            ? {
                ...a,
                customization: {
                  ...a.customization,
                  ...customization
                }
              }
            : a
        )
      }
    }));

    get().addTransformationEvent({
      type: 'customization_changed',
      transformationId: active.transformationId,
      characterId: active.characterId,
      data: { customization }
    });
  },

  recordTransformation: (record) => {
    const transformationRecord: TransformationRecord = {
      ...record,
      id: `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    set(state => ({
      transformationSystem: {
        ...state.transformationSystem,
        transformationHistory: [...state.transformationSystem.transformationHistory, transformationRecord].slice(-200)
      }
    }));
  },

  getTransformationHistory: (characterId, limit = 50) => {
    const history = characterId
      ? get().transformationSystem.transformationHistory.filter(r => r.characterId === characterId)
      : get().transformationSystem.transformationHistory;

    return history.slice(-limit).reverse();
  },

  getTransformationStats: (characterId) => {
    const history = characterId
      ? get().transformationSystem.transformationHistory.filter(r => r.characterId === characterId)
      : get().transformationSystem.transformationHistory;

    const total = history.length;
    const completed = history.filter(r => r.completed).length;
    const skipped = history.filter(r => r.skipped).length;
    const interrupted = history.filter(r => r.interrupted).length;

    // Calculate element usage
    const elementCounts: { [element: string]: number } = {};
    history.forEach(r => {
      const transformation = get().getTransformationById(r.transformationId);
      if (transformation) {
        elementCounts[transformation.element] = (elementCounts[transformation.element] || 0) + 1;
      }
    });

    const mostUsedElement = Object.entries(elementCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

    return {
      totalTransformations: total,
      totalTime: history.reduce((sum, r) => sum + r.duration, 0),
      averageTime: total > 0 ? history.reduce((sum, r) => sum + r.duration, 0) / total : 0,
      mostUsedElement,
      mostUsedRarity: (() => {
        const rarityCounts: { [rarity: string]: number } = {};
        history.forEach(r => {
          const transformation = get().getTransformationById(r.transformationId);
          if (transformation) {
            rarityCounts[transformation.rarity] = (rarityCounts[transformation.rarity] || 0) + 1;
          }
        });
        return Object.entries(rarityCounts)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Common';
      })()
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      skipRate: total > 0 ? (skipped / total) * 100 : 0,
      interruptionRate: total > 0 ? (interrupted / total) * 100 : 0,
      masteryLevel: characterId ? get().getTotalMastery(characterId) : 0,
      favoriteTransformation: (() => {
        const transformationCounts: { [id: string]: number } = {};
        history.forEach(r => {
          transformationCounts[r.transformationId] = (transformationCounts[r.transformationId] || 0) + 1;
        });
        const favorite = Object.entries(transformationCounts)
          .sort(([,a], [,b]) => b - a)[0];
        return favorite ? get().getTransformationById(favorite[0])?.name || 'None' : 'None';
      })()
      transformationStreak: (() => {
        // Calculate current streak of successful transformations
        let streak = 0;
        for (let i = history.length - 1; i >= 0; i--) {
          const record = history[i];
          if (record.completed && !record.interrupted) {
            streak++;
          } else {
            break;
          }
        }
        return streak;
      })()
      perfectTransformations: history.filter(r => r.completed && !r.skipped && !r.interrupted).length
    };
  },

  getMostUsedTransformations: (characterId, limit = 10) => {
    const history = characterId
      ? get().transformationSystem.transformationHistory.filter(r => r.characterId === characterId)
      : get().transformationSystem.transformationHistory;

    const counts: { [transformationId: string]: number } = {};
    history.forEach(r => {
      counts[r.transformationId] = (counts[r.transformationId] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([transformationId, count]) => ({ transformationId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  },

  addTransformationEvent: (event) => {
    const transformationEvent: TransformationEvent = {
      ...event,
      timestamp: Date.now()
    };

    set(state => ({
      transformationSystem: {
        ...state.transformationSystem,
        recentEvents: [
          ...(state.transformationSystem.recentEvents || []),
          transformationEvent
        ].slice(-100) // Keep only last 100 events
      }
    }));
  },

  getRecentEvents: (limit = 20) => {
    const events = get().transformationSystem.recentEvents || [];
    return events.slice(-limit).reverse();
  },

  clearEvents: () => {
    set(state => ({
      transformationSystem: {
        ...state.transformationSystem,
        recentEvents: []
      }
    }));
  },

  updateTransformationSettings: (settings) => {
    set(state => ({
      transformationSystem: {
        ...state.transformationSystem,
        transformationSettings: {
          ...state.transformationSystem.transformationSettings,
          ...settings
        }
      }
    }));
  },

  getActiveTransformation: (characterId) => {
    const activeTransformations = get().transformationSystem.activeTransformations;
    return characterId
      ? activeTransformations.find(a => a.characterId === characterId) || null
      : activeTransformations[0] || null;
  },

  getAllActiveTransformations: () => {
    return get().transformationSystem.activeTransformations;
  },

  isCharacterTransformed: (characterId) => {
    return get().transformationSystem.activeTransformations.some(a => a.characterId === characterId);
  },

  getTransformationPower: (activeId) => {
    const active = get().getAllActiveTransformations().find(a => a.transformationId === activeId);
    if (!active) return 0;

    const transformation = get().getTransformationById(active.transformationId);
    if (!transformation) return 0;

    // Calculate power based on rarity, mastery, and progress
    const basePower = {
      'Common': 100,
      'Uncommon': 150,
      'Rare': 200,
      'Epic': 300,
      'Legendary': 500,
      'Mythical': 800
    }[transformation.rarity] || 100;

    const masteryMultiplier = 1 + (transformation.mastery.level * 0.1);
    const progressMultiplier = active.animationProgress / 100;

    return Math.floor(basePower * masteryMultiplier * progressMultiplier);
  },

  estimateTransformationTime: (transformationId, skipOptions = []) => {
    const transformation = get().getTransformationById(transformationId);
    if (!transformation) return 0;

    const settings = get().transformationSystem.transformationSettings;
    let totalTime = transformation.duration;

    // Apply speed multiplier
    totalTime /= settings.animationSpeed;

    // Apply skip options
    skipOptions.forEach(option => {
      if (option.enabled) {
        const stage = transformation.animation.stages.find(s => s.name === option.stage);
        if (stage) {
          totalTime -= stage.duration;
        }
      }
    });

    return Math.max(1000, totalTime); // Minimum 1 second
  }
});