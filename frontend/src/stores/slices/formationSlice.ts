// Formation system slice - Team formation strategies and elemental synergy bonuses
import type { StateCreator } from 'zustand';
import type {
  FormationSystem,
  Formation,
  FormationRecord,
  FormationSettings,
  ElementalSynergy,
  FormationAnalysis,
  FormationBuilder,
  FormationEvent,
  FormationEventType,
  TeamRole,
  ElementalSynergyType,
  SynergyLevel,
  FormationEffectiveness,
  FormationBonus,
  SynergyBonus,
  FormationPosition,
  BuilderRecommendation,
  FormationPreview
} from '../../types/formation';
import type { MagicalGirl, MagicalElement } from '../../types/magicalGirl';
import { FORMATION_CONFIG } from '../../data/formationConfig';

export interface FormationSlice {
  // State
  formationSystem: FormationSystem;

  // Formation Management
  createFormation: (formation: Omit<Formation, 'id' | 'isUnlocked' | 'createdAt'>) => string;
  updateFormation: (formationId: string, updates: Partial<Formation>) => void;
  deleteFormation: (formationId: string) => void;
  activateFormation: (formationId: string, teamMembers: string[]) => boolean;
  deactivateFormation: () => void;
  duplicateFormation: (formationId: string, newName: string) => string;

  // Formation Library
  getFormation: (formationId: string) => Formation | null;
  getAvailableFormations: () => Formation[];
  getFormationsByCategory: (category: string) => Formation[];
  getRecommendedFormations: (teamMembers: string[]) => Formation[];
  unlockFormation: (formationId: string) => void;

  // Team Positioning
  assignCharacterToPosition: (characterId: string, position: number) => boolean;
  removeCharacterFromPosition: (position: number) => void;
  swapCharacterPositions: (position1: number, position2: number) => boolean;
  optimizePositions: (teamMembers: string[], formationId?: string) => { [position: number]: string };
  validatePositioning: (teamMembers: string[], formationId: string) => boolean;

  // Synergy System
  calculateSynergies: (teamMembers: string[], formationId?: string) => ElementalSynergy[];
  getActiveSynergies: () => ElementalSynergy[];
  discoverSynergy: (synergyId: string) => void;
  upgradeSynergy: (synergyId: string) => boolean;
  getSynergyBonuses: (teamMembers: string[], formationId?: string) => SynergyBonus[];
  calculateElementalEffectiveness: (elements: MagicalElement[]) => number;

  // Formation Analysis
  analyzeFormation: (teamMembers: string[], formationId: string) => FormationAnalysis;
  calculateFormationEffectiveness: (teamMembers: string[], formationId: string) => FormationEffectiveness;
  getFormationScore: (teamMembers: string[], formationId: string) => number;
  identifyFormationWeaknesses: (teamMembers: string[], formationId: string) => string[];
  generateRecommendations: (teamMembers: string[], formationId: string) => BuilderRecommendation[];

  // Formation Builder
  initializeBuilder: (constraints?: any) => void;
  updateBuilderConstraints: (constraints: any) => void;
  addCharacterToBuilder: (characterId: string, position?: number) => boolean;
  removeCharacterFromBuilder: (characterId: string) => void;
  previewFormationChanges: () => FormationPreview;
  saveBuilderFormation: (name: string, description: string) => string;
  resetBuilder: () => void;

  // Performance Tracking
  recordFormationPerformance: (record: Omit<FormationRecord, 'id' | 'timestamp'>) => void;
  getFormationHistory: (formationId?: string, limit?: number) => FormationRecord[];
  getFormationStatistics: (formationId?: string) => FormationStatistics;
  getTopPerformingFormations: (category?: string, limit?: number) => Formation[];
  getMostUsedSynergies: (limit?: number) => { synergyId: string; usage: number }[];

  // Auto-Formation Features
  generateAutoFormation: (teamMembers: string[], objective?: string) => Formation;
  suggestFormationImprovements: (formationId: string, teamMembers: string[]) => string[];
  autoOptimizeFormation: (formationId: string, teamMembers: string[]) => boolean;
  smartPositioning: (teamMembers: string[], formationId: string) => { [position: number]: string };

  // Events and Notifications
  addFormationEvent: (event: Omit<FormationEvent, 'timestamp'>) => void;
  getRecentEvents: (limit?: number) => FormationEvent[];
  clearEvents: () => void;

  // Settings
  updateFormationSettings: (settings: Partial<FormationSettings>) => void;

  // Utility
  getCharacterOptimalPositions: (characterId: string, formationId: string) => number[];
  calculatePositionSuitability: (characterId: string, position: number, formationId: string) => number;
  getElementalSynergyTypes: () => ElementalSynergyType[];
  validateFormationRequirements: (teamMembers: string[], formationId: string) => ValidationResult;
  exportFormation: (formationId: string) => string;
  importFormation: (formationData: string) => boolean;
}

export interface FormationStatistics {
  totalBattles: number;
  winRate: number;
  averageEffectiveness: number;
  mostUsedPositions: { position: number; usage: number }[];
  topSynergies: { synergyId: string; frequency: number }[];
  averageBattleDuration: number;
  bestPerformance: FormationRecord | null;
  recentTrends: TrendData[];
}

export interface TrendData {
  date: string;
  winRate: number;
  usage: number;
  effectiveness: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

export interface ValidationError {
  type: 'missing_role' | 'invalid_position' | 'requirement_not_met' | 'banned_combination';
  message: string;
  severity: 'error' | 'critical';
  positions?: number[];
}

export interface ValidationWarning {
  type: 'suboptimal' | 'weak_synergy' | 'level_mismatch' | 'element_imbalance';
  message: string;
  impact: 'low' | 'medium' | 'high';
  suggestions: string[];
}

export const createFormationSlice: StateCreator<
  FormationSlice & {
    addNotification: (notification: any) => void;
    gameState: { magicalGirls: MagicalGirl[] };
  },
  [],
  [],
  FormationSlice
> = (set, get) => ({
  formationSystem: {
    formations: FORMATION_CONFIG.defaultFormations,
    activeFormation: null,
    formationHistory: [],
    elementalSynergies: FORMATION_CONFIG.elementalSynergies,
    formationTemplates: FORMATION_CONFIG.formationTemplates,
    formationSettings: {
      autoFormationEnabled: false,
      autoOptimizeForBattle: true,
      autoSynergyDetection: true,
      autoPositionOptimization: false,
      showFormationHints: true,
      showSynergyPreview: true,
      showEffectivenessRating: true,
      showPositionRecommendations: true,
      highlightSynergies: true,
      showPositionLines: false,
      animateFormationChanges: true,
      showElementalConnections: true,
      alertOnLowSynergy: true,
      alertOnSuboptimalFormation: false,
      alertOnMissingRoles: true,
      alertOnElementImbalance: false,
      calculateFormationEffectiveness: true,
      trackFormationPerformance: true,
      saveFormationHistory: true,
      enableAdvancedAnalytics: false,
      enableExperimentalFormations: false,
      allowCustomSynergies: false,
      enableAIFormationSuggestions: true,
      participateInFormationSharing: false
    }
  },

  createFormation: (formation) => {
    const formationId = `formation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newFormation: Formation = {
      ...formation,
      id: formationId,
      isUnlocked: true,
      isCustom: true,
      createdAt: Date.now(),
      popularityScore: 0,
      winRate: 0
    };

    set(state => ({
      formationSystem: {
        ...state.formationSystem,
        formations: [...state.formationSystem.formations, newFormation]
      }
    }));

    get().addFormationEvent({
      type: 'formation_created',
      formationId,
      data: { name: formation.name, category: formation.category }
    });

    get().addNotification({
      type: 'success',
      title: 'Formation Created',
      message: `${formation.name} has been added to your formation library`,
      icon: '🎯'
    });

    return formationId;
  },

  updateFormation: (formationId, updates) => {
    set(state => ({
      formationSystem: {
        ...state.formationSystem,
        formations: state.formationSystem.formations.map(formation =>
          formation.id === formationId
            ? { ...formation, ...updates }
            : formation
        )
      }
    }));

    get().addFormationEvent({
      type: 'formation_modified',
      formationId,
      data: { updates: Object.keys(updates) }
    });
  },

  deleteFormation: (formationId) => {
    const formation = get().getFormation(formationId);
    if (!formation) return;

    // Don't allow deletion of default formations
    if (!formation.isCustom) {
      get().addNotification({
        type: 'error',
        title: 'Cannot Delete',
        message: 'Default formations cannot be deleted',
        icon: '🚫'
      });
      return;
    }

    set(state => ({
      formationSystem: {
        ...state.formationSystem,
        formations: state.formationSystem.formations.filter(f => f.id !== formationId),
        activeFormation: state.formationSystem.activeFormation === formationId ? null : state.formationSystem.activeFormation
      }
    }));

    get().addNotification({
      type: 'info',
      title: 'Formation Deleted',
      message: `${formation.name} has been removed`,
      icon: '🗑️'
    });
  },

  activateFormation: (formationId, teamMembers) => {
    const formation = get().getFormation(formationId);
    if (!formation) return false;

    // Validate formation requirements
    const validation = get().validateFormationRequirements(teamMembers, formationId);
    if (!validation.isValid) {
      get().addNotification({
        type: 'error',
        title: 'Formation Requirements Not Met',
        message: validation.errors[0]?.message || 'Formation cannot be activated',
        icon: '⚠️'
      });
      return false;
    }

    set(state => ({
      formationSystem: {
        ...state.formationSystem,
        activeFormation: formationId
      }
    }));

    get().addFormationEvent({
      type: 'formation_activated',
      formationId,
      data: { teamSize: teamMembers.length, teamMembers }
    });

    get().addNotification({
      type: 'success',
      title: 'Formation Activated',
      message: `${formation.name} is now active`,
      icon: '✅'
    });

    return true;
  },

  deactivateFormation: () => {
    const currentFormation = get().formationSystem.activeFormation;
    if (!currentFormation) return;

    set(state => ({
      formationSystem: {
        ...state.formationSystem,
        activeFormation: null
      }
    }));

    get().addNotification({
      type: 'info',
      title: 'Formation Deactivated',
      message: 'No formation is currently active',
      icon: 'ℹ️'
    });
  },

  duplicateFormation: (formationId, newName) => {
    const originalFormation = get().getFormation(formationId);
    if (!originalFormation) return '';

    const duplicatedFormation = {
      ...originalFormation,
      name: newName,
      description: `Copy of ${originalFormation.description}`,
      isCustom: true
    };

    // Remove id and metadata fields that should be regenerated
    delete (duplicatedFormation as any).id;
    delete (duplicatedFormation as any).createdAt;
    delete (duplicatedFormation as any).popularityScore;
    delete (duplicatedFormation as any).winRate;

    return get().createFormation(duplicatedFormation);
  },

  getFormation: (formationId) => {
    return get().formationSystem.formations.find(f => f.id === formationId) || null;
  },

  getAvailableFormations: () => {
    return get().formationSystem.formations.filter(f => f.isUnlocked);
  },

  getFormationsByCategory: (category) => {
    return get().formationSystem.formations.filter(f =>
      f.isUnlocked && f.category === category
    );
  },

  getRecommendedFormations: (teamMembers) => {
    const characters = teamMembers.map(id =>
      get().gameState.magicalGirls.find(girl => girl.id === id)
    ).filter(Boolean) as MagicalGirl[];

    const availableFormations = get().getAvailableFormations();

    // Score formations based on team composition
    const scoredFormations = availableFormations.map(formation => {
      const score = get().getFormationScore(teamMembers, formation.id);
      return { formation, score };
    });

    // Sort by score and return top formations
    return scoredFormations
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.formation);
  },

  unlockFormation: (formationId) => {
    set(state => ({
      formationSystem: {
        ...state.formationSystem,
        formations: state.formationSystem.formations.map(formation =>
          formation.id === formationId
            ? { ...formation, isUnlocked: true }
            : formation
        )
      }
    }));

    const formation = get().getFormation(formationId);
    if (formation) {
      get().addNotification({
        type: 'success',
        title: 'Formation Unlocked!',
        message: `${formation.name} is now available`,
        icon: '🔓'
      });
    }
  },

  assignCharacterToPosition: (characterId, position) => {
    // TODO: Implement character assignment logic
    // This would involve updating the active formation's team composition
    return true;
  },

  removeCharacterFromPosition: (position) => {
    // TODO: Implement character removal logic
  },

  swapCharacterPositions: (position1, position2) => {
    // TODO: Implement position swapping logic
    return true;
  },

  optimizePositions: (teamMembers, formationId) => {
    const formation = formationId ? get().getFormation(formationId) : null;
    if (!formation) return {};

    const characters = teamMembers.map(id =>
      get().gameState.magicalGirls.find(girl => girl.id === id)
    ).filter(Boolean) as MagicalGirl[];

    const optimizedPositions: { [position: number]: string } = {};

    // Simple optimization algorithm
    formation.positions.forEach((formationPos, index) => {
      if (index < characters.length) {
        // Find best character for this position
        const bestCharacter = characters.find(char => {
          // Check role compatibility
          const roleMatch = formationPos.preferredRole === get().getCharacterRole(char);
          const elementMatch = formationPos.preferredElements.includes(char.element);
          return roleMatch || elementMatch;
        }) || characters[index];

        optimizedPositions[formationPos.row * 3 + formationPos.column] = bestCharacter.id;
      }
    });

    return optimizedPositions;
  },

  validatePositioning: (teamMembers, formationId) => {
    const validation = get().validateFormationRequirements(teamMembers, formationId);
    return validation.isValid;
  },

  calculateSynergies: (teamMembers, formationId) => {
    const characters = teamMembers.map(id =>
      get().gameState.magicalGirls.find(girl => girl.id === id)
    ).filter(Boolean) as MagicalGirl[];

    const availableSynergies = get().formationSystem.elementalSynergies;
    const activeSynergies: ElementalSynergy[] = [];

    // Check each synergy for activation
    availableSynergies.forEach(synergy => {
      if (!synergy.isUnlocked) return;

      const elements = characters.map(char => char.element);
      const elementCounts: { [element in MagicalElement]?: number } = {};

      elements.forEach(element => {
        elementCounts[element] = (elementCounts[element] || 0) + 1;
      });

      // Check if synergy requirements are met
      const hasRequiredElements = synergy.secondaryElements.every(element =>
        (elementCounts[element] || 0) >= 1
      );

      const meetsMinimumCharacters = characters.length >= synergy.minimumCharacters;

      if (hasRequiredElements && meetsMinimumCharacters) {
        // Calculate synergy level based on participation
        const participatingCharacters = characters.filter(char =>
          [synergy.primaryElement, ...synergy.secondaryElements].includes(char.element)
        );

        const synergyLevel = Math.min(
          participatingCharacters.length,
          synergy.maximumCharacters || participatingCharacters.length
        );

        activeSynergies.push({
          ...synergy,
          currentTier: Math.min(synergyLevel, synergy.tiers.length - 1)
        });
      }
    });

    return activeSynergies;
  },

  getActiveSynergies: () => {
    // TODO: Return currently active synergies based on current team
    return [];
  },

  discoverSynergy: (synergyId) => {
    set(state => ({
      formationSystem: {
        ...state.formationSystem,
        elementalSynergies: state.formationSystem.elementalSynergies.map(synergy =>
          synergy.id === synergyId
            ? { ...synergy, isDiscovered: true, isUnlocked: true }
            : synergy
        )
      }
    }));

    get().addFormationEvent({
      type: 'synergy_discovered',
      data: { synergyId }
    });

    const synergy = get().formationSystem.elementalSynergies.find(s => s.id === synergyId);
    if (synergy) {
      get().addNotification({
        type: 'success',
        title: 'New Synergy Discovered!',
        message: `${synergy.name} - ${synergy.description}`,
        icon: '✨'
      });
    }
  },

  upgradeSynergy: (synergyId) => {
    const synergy = get().formationSystem.elementalSynergies.find(s => s.id === synergyId);
    if (!synergy || synergy.currentTier >= synergy.tiers.length - 1) return false;

    const nextTier = synergy.tiers[synergy.currentTier + 1];
    if (synergy.experience < nextTier.requiredExperience) return false;

    set(state => ({
      formationSystem: {
        ...state.formationSystem,
        elementalSynergies: state.formationSystem.elementalSynergies.map(s =>
          s.id === synergyId
            ? {
                ...s,
                currentTier: s.currentTier + 1,
                experience: s.experience - nextTier.requiredExperience
              }
            : s
        )
      }
    }));

    get().addNotification({
      type: 'success',
      title: 'Synergy Upgraded!',
      message: `${synergy.name} reached ${nextTier.name} tier`,
      icon: '⭐'
    });

    return true;
  },

  getSynergyBonuses: (teamMembers, formationId) => {
    const activeSynergies = get().calculateSynergies(teamMembers, formationId);
    const bonuses: SynergyBonus[] = [];

    activeSynergies.forEach(synergy => {
      const tierData = synergy.tiers[synergy.currentTier];
      if (tierData) {
        bonuses.push(...synergy.bonuses);
      }
    });

    return bonuses;
  },

  calculateElementalEffectiveness: (elements) => {
    const uniqueElements = new Set(elements);
    const elementCount = uniqueElements.size;
    const totalCharacters = elements.length;

    // Calculate diversity bonus
    const diversityScore = (elementCount / totalCharacters) * 100;

    // Calculate synergy potential
    const synergyScore = get().formationSystem.elementalSynergies
      .filter(synergy => synergy.isUnlocked)
      .reduce((score, synergy) => {
        const hasElements = synergy.secondaryElements.some(element =>
          uniqueElements.has(element)
        );
        return hasElements ? score + 10 : score;
      }, 0);

    return Math.min(100, diversityScore + synergyScore / 10);
  },

  analyzeFormation: (teamMembers, formationId) => {
    const formation = get().getFormation(formationId);
    if (!formation) {
      throw new Error('Formation not found');
    }

    const characters = teamMembers.map(id =>
      get().gameState.magicalGirls.find(girl => girl.id === id)
    ).filter(Boolean) as MagicalGirl[];

    const effectiveness = get().calculateFormationEffectiveness(teamMembers, formationId);
    const synergies = get().calculateSynergies(teamMembers, formationId);
    const score = get().getFormationScore(teamMembers, formationId);

    // TODO: Implement comprehensive formation analysis
    const analysis: FormationAnalysis = {
      formationId,
      teamComposition: {
        roles: {} as any,
        elements: {} as any,
        levels: {
          average: characters.reduce((sum, char) => sum + char.level, 0) / characters.length,
          minimum: Math.min(...characters.map(char => char.level)),
          maximum: Math.max(...characters.map(char => char.level)),
          variance: 0,
          gaps: []
        },
        stats: {} as any,
        balance: {
          roleBalance: 85,
          elementBalance: get().calculateElementalEffectiveness(characters.map(char => char.element)),
          levelBalance: 75,
          statBalance: 80,
          overall: 80
        }
      },
      effectiveness,
      synergies: synergies.map(synergy => ({
        synergyId: synergy.id,
        level: synergy.currentTier,
        participants: teamMembers,
        contribution: 75,
        potential: 90,
        recommendations: ['Consider adding more characters of complementary elements']
      })),
      weaknesses: [],
      recommendations: [],
      alternatives: [],
      score: {
        overall: score,
        components: {
          teamComposition: 80,
          synergy: 75,
          balance: 85,
          effectiveness: effectiveness.overall,
          flexibility: 70,
          potential: 80
        },
        breakdown: {
          bonuses: [],
          penalties: [],
          factors: []
        },
        ranking: {
          percentile: 75,
          rank: 25,
          totalFormations: 100,
          category: formation.category,
          improvements: []
        }
      }
    };

    return analysis;
  },

  calculateFormationEffectiveness: (teamMembers, formationId) => {
    const formation = get().getFormation(formationId);
    if (!formation) {
      return {
        overall: 0,
        offensive: 0,
        defensive: 0,
        utility: 0,
        flexibility: 0,
        synergy: 0,
        earlyGame: 0,
        midGame: 0,
        lateGame: 0,
        singleTarget: 0,
        multiTarget: 0,
        bossEncounter: 0,
        pvpBattle: 0
      };
    }

    const characters = teamMembers.map(id =>
      get().gameState.magicalGirls.find(girl => girl.id === id)
    ).filter(Boolean) as MagicalGirl[];

    const synergies = get().calculateSynergies(teamMembers, formationId);
    const synergyBonus = synergies.length * 10;

    // Calculate base effectiveness
    const baseOffensive = characters.reduce((sum, char) => sum + char.stats.power, 0) / characters.length;
    const baseDefensive = characters.reduce((sum, char) => sum + char.stats.defense, 0) / characters.length;
    const baseUtility = characters.reduce((sum, char) => sum + char.stats.magic, 0) / characters.length;

    const effectiveness: FormationEffectiveness = {
      overall: Math.min(100, (baseOffensive + baseDefensive + baseUtility) / 3 + synergyBonus),
      offensive: Math.min(100, baseOffensive + synergyBonus * 0.5),
      defensive: Math.min(100, baseDefensive + synergyBonus * 0.5),
      utility: Math.min(100, baseUtility + synergyBonus * 0.5),
      flexibility: formation.positions.length > 4 ? 80 : 60,
      synergy: Math.min(100, synergies.length * 25),
      earlyGame: characters.every(char => char.level <= 20) ? 90 : 70,
      midGame: 80,
      lateGame: characters.every(char => char.level >= 50) ? 90 : 60,
      singleTarget: formation.category === 'Offensive' ? 90 : 70,
      multiTarget: formation.category === 'Balanced' ? 85 : 75,
      bossEncounter: formation.category === 'Defensive' ? 90 : 80,
      pvpBattle: 75
    };

    return effectiveness;
  },

  getFormationScore: (teamMembers, formationId) => {
    const effectiveness = get().calculateFormationEffectiveness(teamMembers, formationId);
    const synergies = get().calculateSynergies(teamMembers, formationId);
    const validation = get().validateFormationRequirements(teamMembers, formationId);

    let score = effectiveness.overall;

    // Synergy bonus
    score += synergies.length * 5;

    // Validation penalty
    if (!validation.isValid) {
      score -= validation.errors.length * 10;
    }
    score -= validation.warnings.length * 2;

    return Math.max(0, Math.min(100, score));
  },

  identifyFormationWeaknesses: (teamMembers, formationId) => {
    const validation = get().validateFormationRequirements(teamMembers, formationId);
    const weaknesses: string[] = [];

    validation.errors.forEach(error => {
      weaknesses.push(error.message);
    });

    validation.warnings.forEach(warning => {
      if (warning.impact === 'high') {
        weaknesses.push(warning.message);
      }
    });

    return weaknesses;
  },

  generateRecommendations: (teamMembers, formationId) => {
    const recommendations: BuilderRecommendation[] = [];
    const validation = get().validateFormationRequirements(teamMembers, formationId);

    // Generate recommendations based on validation results
    validation.warnings.forEach(warning => {
      recommendations.push({
        type: 'optimization',
        priority: warning.impact === 'high' ? 3 : warning.impact === 'medium' ? 2 : 1,
        title: `Address ${warning.type}`,
        description: warning.message,
        action: {
          type: 'add_character',
          parameters: { suggestions: warning.suggestions },
          expectedBenefit: warning.impact === 'high' ? 20 : warning.impact === 'medium' ? 10 : 5
        }
      });
    });

    return recommendations;
  },

  initializeBuilder: (constraints) => {
    // TODO: Initialize formation builder with constraints
  },

  updateBuilderConstraints: (constraints) => {
    // TODO: Update builder constraints
  },

  addCharacterToBuilder: (characterId, position) => {
    // TODO: Add character to builder
    return true;
  },

  removeCharacterFromBuilder: (characterId) => {
    // TODO: Remove character from builder
  },

  previewFormationChanges: () => {
    // TODO: Generate formation preview
    return {} as FormationPreview;
  },

  saveBuilderFormation: (name, description) => {
    // TODO: Save formation from builder
    return '';
  },

  resetBuilder: () => {
    // TODO: Reset formation builder
  },

  recordFormationPerformance: (record) => {
    const performanceRecord: FormationRecord = {
      ...record,
      id: `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    set(state => ({
      formationSystem: {
        ...state.formationSystem,
        formationHistory: [...state.formationSystem.formationHistory, performanceRecord].slice(-500)
      }
    }));

    // Update formation win rate and popularity
    get().updateFormationStats(record.formationId, record.result === 'victory');
  },

  updateFormationStats: (formationId: string, isVictory: boolean) => {
    set(state => ({
      formationSystem: {
        ...state.formationSystem,
        formations: state.formationSystem.formations.map(formation => {
          if (formation.id !== formationId) return formation;

          const history = state.formationSystem.formationHistory.filter(
            record => record.formationId === formationId
          );
          const victories = history.filter(record => record.result === 'victory').length;
          const totalBattles = history.length;
          const winRate = totalBattles > 0 ? (victories / totalBattles) * 100 : 0;

          return {
            ...formation,
            winRate,
            popularityScore: formation.popularityScore + 1
          };
        })
      }
    }));
  },

  getFormationHistory: (formationId, limit = 50) => {
    const history = formationId
      ? get().formationSystem.formationHistory.filter(record => record.formationId === formationId)
      : get().formationSystem.formationHistory;

    return history.slice(-limit).reverse();
  },

  getFormationStatistics: (formationId) => {
    const history = formationId
      ? get().formationSystem.formationHistory.filter(record => record.formationId === formationId)
      : get().formationSystem.formationHistory;

    const totalBattles = history.length;
    const victories = history.filter(record => record.result === 'victory').length;
    const winRate = totalBattles > 0 ? (victories / totalBattles) * 100 : 0;

    const avgEffectiveness = totalBattles > 0
      ? history.reduce((sum, record) => sum + record.effectiveness, 0) / totalBattles
      : 0;

    const avgDuration = totalBattles > 0
      ? history.reduce((sum, record) => sum + record.duration, 0) / totalBattles
      : 0;

    return {
      totalBattles,
      winRate,
      averageEffectiveness: avgEffectiveness,
      mostUsedPositions: [],
      topSynergies: [],
      averageBattleDuration: avgDuration,
      bestPerformance: history.reduce((best, record) =>
        !best || record.effectiveness > best.effectiveness ? record : best,
        null as FormationRecord | null
      ),
      recentTrends: []
    };
  },

  getTopPerformingFormations: (category, limit = 10) => {
    let formations = get().getAvailableFormations();

    if (category) {
      formations = formations.filter(f => f.category === category);
    }

    return formations
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, limit);
  },

  getMostUsedSynergies: (limit = 10) => {
    const synergyUsage: { [synergyId: string]: number } = {};

    get().formationSystem.formationHistory.forEach(record => {
      record.activeSynergies.forEach(synergyId => {
        synergyUsage[synergyId] = (synergyUsage[synergyId] || 0) + 1;
      });
    });

    return Object.entries(synergyUsage)
      .map(([synergyId, usage]) => ({ synergyId, usage }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, limit);
  },

  generateAutoFormation: (teamMembers, objective = 'balanced') => {
    const characters = teamMembers.map(id =>
      get().gameState.magicalGirls.find(girl => girl.id === id)
    ).filter(Boolean) as MagicalGirl[];

    // Simple auto-formation generation
    const formation: Formation = {
      id: `auto_${Date.now()}`,
      name: `Auto Formation (${objective})`,
      description: `Automatically generated formation for ${objective} gameplay`,
      category: objective === 'offensive' ? 'Offensive' :
                 objective === 'defensive' ? 'Defensive' : 'Balanced',
      type: 'Standard',
      icon: '🤖',
      color: '#4A90E2',
      pattern: {
        shape: 'Triangle',
        frontLine: 1,
        midLine: 2,
        backLine: 1,
        flexibility: 50
      },
      positions: characters.map((char, index) => ({
        id: `pos_${index}`,
        row: index < 1 ? 1 : index < 3 ? 2 : 3,
        column: (index % 3) + 1,
        priority: 5,
        preferredRole: get().getCharacterRole(char),
        alternativeRoles: [],
        roleFlexibility: 30,
        preferredElements: [char.element],
        bannedElements: [],
        elementalWeight: 70,
        minStats: {},
        preferredStats: {},
        statWeights: [],
        modifiers: [],
        adjacencyBonuses: [],
        isLeaderPosition: index === 0,
        canBeEmpty: false,
        isFlexible: true,
        specialRules: []
      })),
      teamSize: characters.length,
      minTeamSize: 1,
      maxTeamSize: 6,
      requirements: [],
      restrictions: [],
      elementRequirements: [],
      bonuses: [],
      synergies: [],
      penalties: [],
      tacticalEffects: [],
      positionModifiers: [],
      combatEffects: [],
      isUnlocked: true,
      isCustom: true,
      difficulty: 'Beginner',
      effectiveness: get().calculateFormationEffectiveness(teamMembers, ''),
      popularityScore: 0,
      winRate: 0
    };

    return formation;
  },

  suggestFormationImprovements: (formationId, teamMembers) => {
    const recommendations = get().generateRecommendations(teamMembers, formationId);
    return recommendations.map(rec => rec.description);
  },

  autoOptimizeFormation: (formationId, teamMembers) => {
    const optimizedPositions = get().optimizePositions(teamMembers, formationId);
    // TODO: Apply optimized positions
    return true;
  },

  smartPositioning: (teamMembers, formationId) => {
    return get().optimizePositions(teamMembers, formationId);
  },

  addFormationEvent: (event) => {
    const formationEvent: FormationEvent = {
      ...event,
      timestamp: Date.now()
    };

    // Events could be stored in state for this implementation
    // For now, just trigger notifications for important events
    if (event.type === 'synergy_discovered' || event.type === 'formation_created') {
      // Events are handled by their respective methods
    }
  },

  getRecentEvents: (limit = 20) => {
    // TODO: Implement event storage and retrieval
    return [];
  },

  clearEvents: () => {
    // TODO: Implement event clearing
  },

  updateFormationSettings: (settings) => {
    set(state => ({
      formationSystem: {
        ...state.formationSystem,
        formationSettings: {
          ...state.formationSystem.formationSettings,
          ...settings
        }
      }
    }));
  },

  getCharacterOptimalPositions: (characterId, formationId) => {
    const character = get().gameState.magicalGirls.find(girl => girl.id === characterId);
    const formation = get().getFormation(formationId);

    if (!character || !formation) return [];

    const characterRole = get().getCharacterRole(character);

    return formation.positions
      .map((pos, index) => ({
        position: index,
        suitability: get().calculatePositionSuitability(characterId, index, formationId)
      }))
      .filter(item => item.suitability > 50)
      .sort((a, b) => b.suitability - a.suitability)
      .map(item => item.position);
  },

  calculatePositionSuitability: (characterId, position, formationId) => {
    const character = get().gameState.magicalGirls.find(girl => girl.id === characterId);
    const formation = get().getFormation(formationId);

    if (!character || !formation || position >= formation.positions.length) return 0;

    const formationPos = formation.positions[position];
    const characterRole = get().getCharacterRole(character);

    let suitability = 50; // Base suitability

    // Role compatibility
    if (formationPos.preferredRole === characterRole) {
      suitability += 30;
    } else if (formationPos.alternativeRoles.includes(characterRole)) {
      suitability += 15;
    }

    // Element compatibility
    if (formationPos.preferredElements.includes(character.element)) {
      suitability += 20;
    }
    if (formationPos.bannedElements.includes(character.element)) {
      suitability -= 40;
    }

    return Math.max(0, Math.min(100, suitability));
  },

  getCharacterRole: (character: MagicalGirl): TeamRole => {
    const { power, defense, magic, speed } = character.stats;

    if (defense > power && defense > magic) return 'Tank';
    if (magic > power && magic > defense) {
      return character.specialization === 'Healer' ? 'Healer' : 'Support';
    }
    if (power > defense && power > magic) return 'Damage';
    if (speed > 80) return 'Utility';

    return 'Support';
  },

  getElementalSynergyTypes: () => {
    return [
      'Elemental_Harmony',
      'Elemental_Contrast',
      'Elemental_Trinity',
      'Elemental_Spectrum',
      'Prismatic_Unity',
      'Void_Resonance',
      'Natural_Cycle',
      'Celestial_Alignment'
    ] as ElementalSynergyType[];
  },

  validateFormationRequirements: (teamMembers, formationId) => {
    const formation = get().getFormation(formationId);
    const characters = teamMembers.map(id =>
      get().gameState.magicalGirls.find(girl => girl.id === id)
    ).filter(Boolean) as MagicalGirl[];

    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: []
    };

    if (!formation) {
      result.isValid = false;
      result.errors.push({
        type: 'missing_role',
        message: 'Formation not found',
        severity: 'critical'
      });
      return result;
    }

    // Check team size
    if (characters.length < formation.minTeamSize) {
      result.isValid = false;
      result.errors.push({
        type: 'missing_role',
        message: `Team needs at least ${formation.minTeamSize} members`,
        severity: 'error'
      });
    }

    if (characters.length > formation.maxTeamSize) {
      result.isValid = false;
      result.errors.push({
        type: 'invalid_position',
        message: `Team cannot exceed ${formation.maxTeamSize} members`,
        severity: 'error'
      });
    }

    // Check element requirements
    formation.elementRequirements.forEach(req => {
      const elementCount = characters.filter(char => char.element === req.element).length;
      if (elementCount < req.minimum) {
        result.warnings.push({
          type: 'element_imbalance',
          message: `Formation works better with at least ${req.minimum} ${req.element} characters`,
          impact: 'medium',
          suggestions: [`Add more ${req.element} element characters`]
        });
      }
    });

    // Check role distribution
    const roles = characters.map(char => get().getCharacterRole(char));
    const roleCount: { [role in TeamRole]?: number } = {};
    roles.forEach(role => {
      roleCount[role] = (roleCount[role] || 0) + 1;
    });

    if (!roleCount['Tank'] && formation.category !== 'Offensive') {
      result.warnings.push({
        type: 'suboptimal',
        message: 'Consider adding a Tank for better survivability',
        impact: 'medium',
        suggestions: ['Add a character with high defense stats']
      });
    }

    if (!roleCount['Healer'] && formation.category === 'Defensive') {
      result.warnings.push({
        type: 'suboptimal',
        message: 'Defensive formations benefit from having a Healer',
        impact: 'high',
        suggestions: ['Add a character with healing abilities']
      });
    }

    return result;
  },

  exportFormation: (formationId) => {
    const formation = get().getFormation(formationId);
    if (!formation) return '';

    // Remove runtime properties and create exportable data
    const exportData = {
      ...formation,
      exportedAt: Date.now(),
      version: '1.0'
    };

    return JSON.stringify(exportData, null, 2);
  },

  importFormation: (formationData) => {
    try {
      const formation = JSON.parse(formationData);

      // Validate formation structure
      if (!formation.name || !formation.positions) {
        get().addNotification({
          type: 'error',
          title: 'Import Failed',
          message: 'Invalid formation data',
          icon: '❌'
        });
        return false;
      }

      // Create formation without conflicting IDs
      const formationToCreate = {
        ...formation,
        name: `${formation.name} (Imported)`,
        isCustom: true
      };

      delete formationToCreate.id;
      delete formationToCreate.createdAt;
      delete formationToCreate.exportedAt;
      delete formationToCreate.version;

      get().createFormation(formationToCreate);
      return true;
    } catch (error) {
      get().addNotification({
        type: 'error',
        title: 'Import Failed',
        message: 'Could not parse formation data',
        icon: '❌'
      });
      return false;
    }
  }
});