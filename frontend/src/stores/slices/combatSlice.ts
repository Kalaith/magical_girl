import type { StateCreator } from 'zustand';
import type {
  CombatSystem,
  CombatBattle,
  CombatParticipant,
  CombatFormation,
  CombatRecord,
  CombatSettings,
  CombatAction,
  CombatLogEntry,
  BattleEndReason,
  BattleStatus,
  TurnPhase,
} from '../../types/combat';

export interface CombatSlice {
  combatSystem: CombatSystem;

  // Battle management
  startBattle: (battle: Omit<CombatBattle, 'id' | 'status' | 'startTime' | 'combatLog'>) => void;
  endBattle: (
    battleId: string,
    winner: 'player' | 'enemy' | 'draw',
    reason: BattleEndReason
  ) => void;
  pauseBattle: (battleId: string) => void;
  resumeBattle: (battleId: string) => void;

  // Turn management
  nextTurn: () => void;
  executeAction: (
    participantId: string,
    action: CombatAction,
    targets?: CombatParticipant[]
  ) => void;
  processTurn: () => void;

  // Participant management
  addParticipant: (
    battleId: string,
    participant: CombatParticipant,
    team: 'player' | 'enemy'
  ) => void;
  removeParticipant: (battleId: string, participantId: string) => void;
  updateParticipant: (
    battleId: string,
    participantId: string,
    updates: Partial<CombatParticipant>
  ) => void;

  // Formation management
  createFormation: (formation: Omit<CombatFormation, 'id'>) => void;
  updateFormation: (formationId: string, updates: Partial<CombatFormation>) => void;
  deleteFormation: (formationId: string) => void;
  setActiveFormation: (formationId: string) => void;

  // Combat settings
  updateCombatSettings: (settings: Partial<CombatSettings>) => void;

  // Combat log
  addCombatLogEntry: (battleId: string, entry: Omit<CombatLogEntry, 'id' | 'timestamp'>) => void;

  // Analytics
  getCombatAnalytics: () => {
    totalBattles: number;
    victories: number;
    defeats: number;
    winRate: number;
    averageTurns: number;
  };

  // Internal helper methods
  initializeTurnOrder: (battleId: string) => void;
  processActionEffects: (
    participantId: string,
    action: CombatAction,
    targets?: CombatParticipant[]
  ) => void;
  executeAIAction: (participantId: string) => void;
  createCombatRecord: (battle: CombatBattle) => void;
}

const initialCombatSettings: CombatSettings = {
  autoMode: false,
  animationSpeed: 1.0,
  skipAnimations: false,
  pauseOnPlayerTurn: true,
  showDamageNumbers: true,
  showStatusEffects: true,
  combatLog: true,
  tutorialMode: false,
  difficulty: 'Normal',
  aiDelay: 1000,
  confirmActions: true,
  quickCombat: false,
};

const initialCombatSystem: CombatSystem = {
  battles: [],
  activeBattle: null,
  formations: [
    {
      id: 'default',
      name: 'Standard Formation',
      description: 'Basic 3x3 formation with balanced positioning',
      positions: [
        { row: 1, column: 1, role: 'Tank', modifiers: [], restrictions: [] },
        { row: 1, column: 2, role: 'Damage', modifiers: [], restrictions: [] },
        { row: 1, column: 3, role: 'Support', modifiers: [], restrictions: [] },
        { row: 2, column: 1, role: 'Damage', modifiers: [], restrictions: [] },
        {
          row: 2,
          column: 2,
          role: 'Flexible',
          modifiers: [],
          restrictions: [],
        },
        { row: 2, column: 3, role: 'Healer', modifiers: [], restrictions: [] },
        { row: 3, column: 1, role: 'Support', modifiers: [], restrictions: [] },
        { row: 3, column: 2, role: 'Buffer', modifiers: [], restrictions: [] },
        {
          row: 3,
          column: 3,
          role: 'Debuffer',
          modifiers: [],
          restrictions: [],
        },
      ],
      bonuses: [],
      requirements: [],
      isDefault: true,
      isUnlocked: true,
      category: 'Balanced',
    },
  ],
  activeFormation: 'default',
  combatHistory: [],
  combatSettings: initialCombatSettings,
};

export const createCombatSlice: StateCreator<CombatSlice> = (set, get) => ({
  combatSystem: initialCombatSystem,

  startBattle: battleData => {
    const battle: CombatBattle = {
      ...battleData,
      id: `battle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'Active',
      startTime: Date.now(),
      combatLog: [],
    };

    set(state => ({
      combatSystem: {
        ...state.combatSystem,
        battles: [...state.combatSystem.battles, battle],
        activeBattle: battle,
      },
    }));

    // Initialize turn order
    get().initializeTurnOrder(battle.id);
  },

  endBattle: (battleId, winner, reason) => {
    set(state => ({
      combatSystem: {
        ...state.combatSystem,
        battles: state.combatSystem.battles.map(battle =>
          battle.id === battleId
            ? {
                ...battle,
                status: 'Completed' as BattleStatus,
                endTime: Date.now(),
                winner,
                reason,
              }
            : battle
        ),
        activeBattle:
          state.combatSystem.activeBattle?.id === battleId ? null : state.combatSystem.activeBattle,
      },
    }));

    // Create combat record
    const battle = get().combatSystem.battles.find(b => b.id === battleId);
    if (battle) {
      get().createCombatRecord(battle);
    }
  },

  pauseBattle: battleId => {
    set(state => ({
      combatSystem: {
        ...state.combatSystem,
        battles: state.combatSystem.battles.map(battle =>
          battle.id === battleId ? { ...battle, status: 'Paused' as BattleStatus } : battle
        ),
      },
    }));
  },

  resumeBattle: battleId => {
    set(state => ({
      combatSystem: {
        ...state.combatSystem,
        battles: state.combatSystem.battles.map(battle =>
          battle.id === battleId ? { ...battle, status: 'Active' as BattleStatus } : battle
        ),
      },
    }));
  },

  nextTurn: () => {
    const { activeBattle } = get().combatSystem;
    if (!activeBattle || activeBattle.status !== 'Active') return;

    const turnOrder = activeBattle.turnOrder;
    const nextIndex = (turnOrder.currentIndex + 1) % turnOrder.participants.length;

    set(state => ({
      combatSystem: {
        ...state.combatSystem,
        activeBattle: state.combatSystem.activeBattle
          ? {
              ...state.combatSystem.activeBattle,
              turnOrder: {
                ...state.combatSystem.activeBattle.turnOrder,
                currentIndex: nextIndex,
                phase: 'Action' as TurnPhase,
              },
              currentTurn: state.combatSystem.activeBattle.currentTurn + 1,
            }
          : null,
      },
    }));
  },

  executeAction: (participantId, action, targets) => {
    const { activeBattle } = get().combatSystem;
    if (!activeBattle) return;

    // Add action to combat log
    get().addCombatLogEntry(activeBattle.id, {
      turn: activeBattle.currentTurn,
      phase: activeBattle.turnOrder.phase,
      type: 'Action',
      actor: participantId,
      action: action.name,
      description: `${participantId} used ${action.name}`,
    });

    // Process action effects
    get().processActionEffects(participantId, action, targets);

    // Move to next turn after action
    setTimeout(() => get().nextTurn(), 1000);
  },

  processTurn: () => {
    const { activeBattle } = get().combatSystem;
    if (!activeBattle || activeBattle.status !== 'Active') return;

    const currentParticipant =
      activeBattle.turnOrder.participants[activeBattle.turnOrder.currentIndex];

    // If it's an AI participant, execute AI action
    if (currentParticipant && !currentParticipant.participantId.startsWith('player')) {
      setTimeout(() => get().executeAIAction(currentParticipant.participantId), 500);
    }
  },

  addParticipant: (battleId, participant, team) => {
    set(state => ({
      combatSystem: {
        ...state.combatSystem,
        battles: state.combatSystem.battles.map(battle =>
          battle.id === battleId
            ? {
                ...battle,
                [team === 'player' ? 'playerTeam' : 'enemyTeam']: [
                  ...(team === 'player' ? battle.playerTeam : battle.enemyTeam),
                  participant,
                ],
              }
            : battle
        ),
      },
    }));
  },

  removeParticipant: (_battleId, participantId) => {
    set(state => ({
      combatSystem: {
        ...state.combatSystem,
        battles: state.combatSystem.battles.map(battle => ({
          ...battle,
          playerTeam: battle.playerTeam.filter(p => p.id !== participantId),
          enemyTeam: battle.enemyTeam.filter(p => p.id !== participantId),
        })),
      },
    }));
  },

  updateParticipant: (_battleId, participantId, updates) => {
    set(state => ({
      combatSystem: {
        ...state.combatSystem,
        battles: state.combatSystem.battles.map(battle => ({
          ...battle,
          playerTeam: battle.playerTeam.map(p =>
            p.id === participantId ? { ...p, ...updates } : p
          ),
          enemyTeam: battle.enemyTeam.map(p => (p.id === participantId ? { ...p, ...updates } : p)),
        })),
      },
    }));
  },

  createFormation: formationData => {
    const formation: CombatFormation = {
      ...formationData,
      id: `formation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    set(state => ({
      combatSystem: {
        ...state.combatSystem,
        formations: [...state.combatSystem.formations, formation],
      },
    }));
  },

  updateFormation: (formationId, updates) => {
    set(state => ({
      combatSystem: {
        ...state.combatSystem,
        formations: state.combatSystem.formations.map(formation =>
          formation.id === formationId ? { ...formation, ...updates } : formation
        ),
      },
    }));
  },

  deleteFormation: formationId => {
    set(state => ({
      combatSystem: {
        ...state.combatSystem,
        formations: state.combatSystem.formations.filter(f => f.id !== formationId),
        activeFormation:
          state.combatSystem.activeFormation === formationId
            ? 'default'
            : state.combatSystem.activeFormation,
      },
    }));
  },

  setActiveFormation: formationId => {
    set(state => ({
      combatSystem: {
        ...state.combatSystem,
        activeFormation: formationId,
      },
    }));
  },

  updateCombatSettings: settings => {
    set(state => ({
      combatSystem: {
        ...state.combatSystem,
        combatSettings: { ...state.combatSystem.combatSettings, ...settings },
      },
    }));
  },

  addCombatLogEntry: (battleId, entryData) => {
    const entry: CombatLogEntry = {
      ...entryData,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    set(state => ({
      combatSystem: {
        ...state.combatSystem,
        battles: state.combatSystem.battles.map(battle =>
          battle.id === battleId ? { ...battle, combatLog: [...battle.combatLog, entry] } : battle
        ),
      },
    }));
  },

  getCombatAnalytics: () => {
    const { combatHistory } = get().combatSystem;
    // Basic analytics implementation
    return {
      totalBattles: combatHistory.length,
      victories: combatHistory.filter(r => r.result === 'Victory').length,
      defeats: combatHistory.filter(r => r.result === 'Defeat').length,
      winRate:
        combatHistory.length > 0
          ? (combatHistory.filter(r => r.result === 'Victory').length / combatHistory.length) * 100
          : 0,
      averageTurns:
        combatHistory.length > 0
          ? combatHistory.reduce((sum, r) => sum + r.turns, 0) / combatHistory.length
          : 0,
    };
  },

  // Internal helper methods
  initializeTurnOrder: battleId => {
    const battle = get().combatSystem.battles.find(b => b.id === battleId);
    if (!battle) return;

    const allParticipants = [...battle.playerTeam, ...battle.enemyTeam];
    const turnOrder = {
      participants: allParticipants
        .map(p => ({
          participantId: p.id,
          speed: p.currentStats.speed,
          initiative: Math.random(),
          delayedTurns: 0,
          hasActed: false,
          canAct: true,
        }))
        .sort((a, b) => b.speed - a.speed || b.initiative - a.initiative),
      currentIndex: 0,
      phase: 'Start' as TurnPhase,
      speedTiebreaker: 'random' as const,
    };

    set(state => ({
      combatSystem: {
        ...state.combatSystem,
        battles: state.combatSystem.battles.map(b => (b.id === battleId ? { ...b, turnOrder } : b)),
      },
    }));
  },

  processActionEffects: (participantId, action, targets) => {
    // Basic action processing - in a real implementation this would be much more complex
    if (!targets || targets.length === 0) return;

    targets.forEach(target => {
      action.effects.forEach(effect => {
        if (effect.type === 'Damage') {
          const damage = Math.floor(Math.random() * 50) + 10; // Placeholder damage calculation
          get().updateParticipant('', target.id, {
            currentStats: {
              ...target.currentStats,
              health: Math.max(0, target.currentStats.health - damage),
            },
          });

          // Add damage log entry
          get().addCombatLogEntry(get().combatSystem.activeBattle!.id, {
            turn: get().combatSystem.activeBattle!.currentTurn,
            phase: get().combatSystem.activeBattle!.turnOrder.phase,
            type: 'Damage',
            actor: participantId,
            target: [target.id],
            value: damage,
            description: `${participantId} dealt ${damage} damage to ${target.id}`,
          });
        }
      });
    });
  },

  executeAIAction: participantId => {
    const { activeBattle } = get().combatSystem;
    if (!activeBattle) return;

    const participant = [...activeBattle.playerTeam, ...activeBattle.enemyTeam].find(
      p => p.id === participantId
    );
    if (!participant || participant.availableActions.length === 0) return;

    // Simple AI: pick random action and target
    const action =
      participant.availableActions[Math.floor(Math.random() * participant.availableActions.length)];
    const enemyTeam =
      participant.source === 'player' ? activeBattle.enemyTeam : activeBattle.playerTeam;
    const target = enemyTeam[Math.floor(Math.random() * enemyTeam.length)];

    if (target) {
      get().executeAction(participantId, action, [target]);
    }
  },

  createCombatRecord: battle => {
    const record: CombatRecord = {
      id: `record-${battle.id}`,
      battleId: battle.id,
      timestamp: battle.endTime || Date.now(),
      duration: (battle.endTime || Date.now()) - battle.startTime,
      type: battle.type,
      playerTeam: battle.playerTeam.map(p => p.id),
      enemyTeam: battle.enemyTeam.map(p => p.id),
      result:
        battle.winner === 'player' ? 'Victory' : battle.winner === 'enemy' ? 'Defeat' : 'Draw',
      turns: battle.currentTurn,
      damageDealt: 0, // Would calculate from log
      damageReceived: 0, // Would calculate from log
      healingDone: 0, // Would calculate from log
      criticalHits: 0, // Would calculate from log
      abilitiesUsed: 0, // Would calculate from log
      itemsUsed: 0, // Would calculate from log
      transformations: 0, // Would calculate from log
      mvp: battle.playerTeam[0]?.id || '', // Would determine from performance
      rewards: battle.rewards,
      experience: 100, // Base experience
      rating: 1200, // Would calculate based on difficulty and performance
    };

    set(state => ({
      combatSystem: {
        ...state.combatSystem,
        combatHistory: [record, ...state.combatSystem.combatHistory].slice(0, 100),
      },
    }));
  },
});
