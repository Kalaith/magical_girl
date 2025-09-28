// Combat system slice - Turn-based battle management
import type { StateCreator } from "zustand";
import type {
  CombatSystem,
  CombatBattle,
  CombatParticipant,
  CombatAction,
  CombatFormation,
  CombatSettings,
  BattleType,
  CombatLogEntry,
  CombatRecord,
  CombatEffect,
  StatusEffect,
} from "../../types/combat";
import type { MagicalGirl } from "../../types/magicalGirl";
import { COMBAT_CONFIG } from "../../data/combatConfig";

// Extended QueuedAction type that includes targets as string IDs for easier serialization
interface ExtendedQueuedAction {
  action: CombatAction;
  targets: string[];
  priority: number;
  queueTime: number;
}

export interface CombatSlice {
  // State
  combatSystem: CombatSystem;

  // Battle Management
  startBattle: (
    type: BattleType,
    enemyTeam: MagicalGirl[],
    playerTeam: MagicalGirl[],
    environmentId?: string,
  ) => Promise<string>;
  endBattle: (
    battleId: string,
    winner: "player" | "enemy" | "draw",
    reason?: string,
  ) => void;
  pauseBattle: (battleId: string) => void;
  resumeBattle: (battleId: string) => void;
  abandonBattle: (battleId: string) => void;

  // Turn Management
  nextTurn: () => void;
  endTurn: (participantId: string) => void;
  calculateTurnOrder: () => void;
  getCurrentParticipant: () => CombatParticipant | null;

  // Action System
  queueAction: (
    participantId: string,
    action: CombatAction,
    targets?: string[],
  ) => boolean;
  executeAction: (participantId: string, actionId: string) => Promise<void>;
  executeActionEffect: (
    participantId: string,
    effect: CombatEffect,
    targets: string[],
  ) => Promise<void>;
  cancelAction: (participantId: string) => void;
  getAvailableActions: (participantId: string) => CombatAction[];
  validateAction: (
    participantId: string,
    action: CombatAction,
    targets?: string[],
  ) => boolean;

  // Combat Calculations
  calculateDamage: (
    attacker: CombatParticipant,
    target: CombatParticipant,
    action: CombatAction,
  ) => number;
  calculateHealing: (
    caster: CombatParticipant,
    target: CombatParticipant,
    action: CombatAction,
  ) => number;
  applyEffect: (
    target: CombatParticipant,
    effect: CombatEffect,
    source: string,
  ) => void;

  // Status Effects
  addStatusEffect: (participantId: string, effect: StatusEffect) => void;
  removeStatusEffect: (participantId: string, effectId: string) => void;
  updateStatusEffects: () => void;
  clearStatusEffects: (participantId: string, type?: string) => void;

  // Formation System
  setFormation: (formationId: string) => void;
  createCustomFormation: (formation: Omit<CombatFormation, "id">) => string;
  updateFormation: (
    formationId: string,
    formation: Partial<CombatFormation>,
  ) => void;
  deleteFormation: (formationId: string) => void;
  getFormationBonuses: (
    formationId: string,
    team: CombatParticipant[],
  ) => CombatAction[];

  // AI System
  executeAITurn: (participantId: string) => Promise<void>;
  updateAIKnowledge: (participantId: string, event: string, data: Record<string, unknown>) => void;

  // Combat Log
  addLogEntry: (entry: Omit<CombatLogEntry, "id" | "timestamp">) => void;
  getCombatLog: (battleId?: string) => CombatLogEntry[];
  clearCombatLog: (battleId?: string) => void;

  // Statistics and Records
  recordBattle: (record: Omit<CombatRecord, "id" | "timestamp">) => void;
  getCombatHistory: (limit?: number) => CombatRecord[];
  getCombatAnalytics: () => {
    totalBattles: number;
    winRate: number;
    averageTurnLength: number;
    mostUsedActions: string[];
  };

  // Settings
  updateCombatSettings: (settings: Partial<CombatSettings>) => void;

  // Utility
  getParticipant: (participantId: string) => CombatParticipant | null;
  getParticipantsByTeam: (team: "player" | "enemy") => CombatParticipant[];
  getBattleById: (battleId: string) => CombatBattle | null;
  getElementalEffectiveness: (
    attackElement: string,
    targetElement: string,
  ) => number;

  // Transformation System
  transformCharacter: (participantId: string, formId?: string) => boolean;
  revertTransformation: (participantId: string) => boolean;
}

export const createCombatSlice: StateCreator<
  CombatSlice & {
    addNotification: (notification: { type: string; title: string; message: string; }) => void;
    addResources: (resources: Record<string, number>) => void;
  },
  [],
  [],
  CombatSlice
> = (set, get) => ({
  combatSystem: {
    battles: [],
    activeBattle: null,
    formations: COMBAT_CONFIG.defaultFormations,
    activeFormation: "balanced",
    combatHistory: [],
    combatSettings: {
      autoMode: false,
      animationSpeed: 1.0,
      skipAnimations: false,
      pauseOnPlayerTurn: true,
      showDamageNumbers: true,
      showStatusEffects: true,
      combatLog: true,
      tutorialMode: true,
      difficulty: "Normal",
      aiDelay: 1000,
      confirmActions: true,
      quickCombat: false,
    },
  },

  startBattle: async (
    type,
    enemyTeam,
    playerTeam,
    environmentId = "default",
  ) => {
    const battleId = `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Convert MagicalGirls to CombatParticipants
    const playerParticipants: CombatParticipant[] = playerTeam.map(
      (girl, index) => ({
        id: `player_${girl.id}`,
        source: "player",
        character: girl,
        position: {
          row: Math.floor(index / 3) + 1,
          column: (index % 3) + 1,
          team: "player",
          modifiers: [],
        },
        currentStats: {
          health: girl.stats.endurance * 10,
          mana: girl.stats.magic * 5,
          attack: girl.stats.power,
          defense: girl.stats.defense,
          speed: girl.stats.speed,
          accuracy: 90 + girl.stats.focus,
          evasion: 5 + girl.stats.speed / 10,
          criticalRate: 5 + girl.stats.luck / 10,
          criticalDamage: 150,
          elementalPower: girl.stats.magic,
          elementalResistance: {
            Light: 0,
            Darkness: 0,
            Fire: 0,
            Water: 0,
            Earth: 0,
            Air: 0,
            Ice: 0,
            Lightning: 0,
            Nature: 0,
            Celestial: 0,
            Void: 0,
            Crystal: 0,
          },
        },
        maxStats: {
          health: girl.stats.endurance * 10,
          mana: girl.stats.magic * 5,
          attack: girl.stats.power,
          defense: girl.stats.defense,
          speed: girl.stats.speed,
          accuracy: 90 + girl.stats.focus,
          evasion: 5 + girl.stats.speed / 10,
          criticalRate: 5 + girl.stats.luck / 10,
          criticalDamage: 150,
          elementalPower: girl.stats.magic,
          elementalResistance: {
            Light: 0,
            Darkness: 0,
            Fire: 0,
            Water: 0,
            Earth: 0,
            Air: 0,
            Ice: 0,
            Lightning: 0,
            Nature: 0,
            Celestial: 0,
            Void: 0,
            Crystal: 0,
          },
        },
        statusEffects: [],
        equipment: {
          weapon: undefined,
          armor: undefined,
          accessories: [],
          temporaryItems: [],
        },
        availableActions: COMBAT_CONFIG.getBasicActions(girl),
        actionQueue: [],
        isTransformed: false,
        transformationCharges: 3,
        maxTransformationCharges: 3,
        shields: [],
        barriers: [],
      }),
    );

    const enemyParticipants: CombatParticipant[] = enemyTeam.map(
      (enemy, index) => ({
        id: `enemy_${enemy.id}`,
        source: "ai",
        character: enemy,
        position: {
          row: Math.floor(index / 3) + 1,
          column: (index % 3) + 1,
          team: "enemy",
          modifiers: [],
        },
        currentStats: {
          health: enemy.stats.endurance * 10,
          mana: enemy.stats.magic * 5,
          attack: enemy.stats.power,
          defense: enemy.stats.defense,
          speed: enemy.stats.speed,
          accuracy: 90 + enemy.stats.focus,
          evasion: 5 + enemy.stats.speed / 10,
          criticalRate: 5 + enemy.stats.luck / 10,
          criticalDamage: 150,
          elementalPower: enemy.stats.magic,
          elementalResistance: {
            Light: 0,
            Darkness: 0,
            Fire: 0,
            Water: 0,
            Earth: 0,
            Air: 0,
            Ice: 0,
            Lightning: 0,
            Nature: 0,
            Celestial: 0,
            Void: 0,
            Crystal: 0,
          },
        },
        maxStats: {
          health: enemy.stats.endurance * 10,
          mana: enemy.stats.magic * 5,
          attack: enemy.stats.power,
          defense: enemy.stats.defense,
          speed: enemy.stats.speed,
          accuracy: 90 + enemy.stats.focus,
          evasion: 5 + enemy.stats.speed / 10,
          criticalRate: 5 + enemy.stats.luck / 10,
          criticalDamage: 150,
          elementalPower: enemy.stats.magic,
          elementalResistance: {
            Light: 0,
            Darkness: 0,
            Fire: 0,
            Water: 0,
            Earth: 0,
            Air: 0,
            Ice: 0,
            Lightning: 0,
            Nature: 0,
            Celestial: 0,
            Void: 0,
            Crystal: 0,
          },
        },
        statusEffects: [],
        equipment: {
          weapon: undefined,
          armor: undefined,
          accessories: [],
          temporaryItems: [],
        },
        availableActions: COMBAT_CONFIG.getBasicActions(enemy),
        actionQueue: [],
        ai: COMBAT_CONFIG.getDefaultAI(enemy),
        isTransformed: false,
        transformationCharges: 3,
        maxTransformationCharges: 3,
        shields: [],
        barriers: [],
      }),
    );

    const battle: CombatBattle = {
      id: battleId,
      name: `${type} Battle`,
      type,
      status: "Preparing",
      playerTeam: playerParticipants,
      enemyTeam: enemyParticipants,
      environment: COMBAT_CONFIG.getEnvironment(environmentId),
      turnOrder: {
        participants: [],
        currentIndex: 0,
        phase: "Start",
        speedTiebreaker: "random",
      },
      currentTurn: 1,
      maxTurns: 50,
      turnTimer: 30000,
      maxTurnTimer: 30000,
      conditions: COMBAT_CONFIG.getVictoryConditions(type),
      rewards: COMBAT_CONFIG.getBattleRewards(type),
      penalties: [],
      startTime: Date.now(),
      combatLog: [],
    };

    set((state) => ({
      combatSystem: {
        ...state.combatSystem,
        battles: [...state.combatSystem.battles, battle],
        activeBattle: battle,
      },
    }));

    // Calculate initial turn order
    get().calculateTurnOrder();

    // Add start battle log entry
    get().addLogEntry({
      turn: 0,
      phase: "Start",
      type: "System",
      description: `${type} battle has begun!`,
      details: { playerCount: playerTeam.length, enemyCount: enemyTeam.length },
    });

    // Start battle
    set((state) => ({
      combatSystem: {
        ...state.combatSystem,
        activeBattle: state.combatSystem.activeBattle
          ? {
              ...state.combatSystem.activeBattle,
              status: "Active",
            }
          : null,
      },
    }));

    get().addNotification({
      type: "info",
      title: "Battle Started!",
      message: `${type} battle has begun`,
    });

    return battleId;
  },

  endBattle: (battleId, winner, reason = "Victory") => {
    set((state) => {
      const battle = state.combatSystem.battles.find((b) => b.id === battleId);
      if (!battle) return state;

      const updatedBattle = {
        ...battle,
        status: "Completed" as const,
        endTime: Date.now(),
        winner,
        reason: reason as any,
      };

      // Record battle for history
      get().recordBattle({
        battleId,
        duration: (updatedBattle.endTime || Date.now()) - battle.startTime,
        type: battle.type,
        playerTeam: battle.playerTeam.map((p) => p.character.id),
        enemyTeam: battle.enemyTeam.map((p) => p.character.id),
        result:
          winner === "player"
            ? "Victory"
            : winner === "enemy"
              ? "Defeat"
              : "Draw",
        turns: battle.currentTurn,
        damageDealt: 0, // TODO: Calculate from log
        damageReceived: 0, // TODO: Calculate from log
        healingDone: 0, // TODO: Calculate from log
        criticalHits: 0, // TODO: Calculate from log
        abilitiesUsed: 0, // TODO: Calculate from log
        itemsUsed: 0, // TODO: Calculate from log
        transformations: 0, // TODO: Calculate from log
        mvp: battle.playerTeam[0]?.character.id || "",
        rewards: battle.rewards,
        experience: 100, // TODO: Calculate based on battle
        rating: 3, // TODO: Calculate based on performance
      });

      return {
        combatSystem: {
          ...state.combatSystem,
          battles: state.combatSystem.battles.map((b) =>
            b.id === battleId ? updatedBattle : b,
          ),
          activeBattle:
            state.combatSystem.activeBattle?.id === battleId
              ? null
              : state.combatSystem.activeBattle,
        },
      };
    });

    get().addLogEntry({
      turn: get().combatSystem.activeBattle?.currentTurn || 0,
      phase: "End",
      type: winner === "player" ? "Victory" : "Defeat",
      description: `Battle ended: ${winner} ${reason}`,
      details: { winner, reason },
    });

    get().addNotification({
      type: winner === "player" ? "success" : "error",
      title: winner === "player" ? "Victory!" : "Defeat...",
      message: `Battle ended in ${winner === "player" ? "victory" : winner === "enemy" ? "defeat" : "a draw"}`,
    });
  },

  pauseBattle: (battleId) => {
    set((state) => ({
      combatSystem: {
        ...state.combatSystem,
        battles: state.combatSystem.battles.map((battle) =>
          battle.id === battleId
            ? { ...battle, status: "Paused" as const }
            : battle,
        ),
        activeBattle:
          state.combatSystem.activeBattle?.id === battleId
            ? { ...state.combatSystem.activeBattle, status: "Paused" as const }
            : state.combatSystem.activeBattle,
      },
    }));
  },

  resumeBattle: (battleId) => {
    set((state) => ({
      combatSystem: {
        ...state.combatSystem,
        battles: state.combatSystem.battles.map((battle) =>
          battle.id === battleId
            ? { ...battle, status: "Active" as const }
            : battle,
        ),
        activeBattle:
          state.combatSystem.activeBattle?.id === battleId
            ? { ...state.combatSystem.activeBattle, status: "Active" as const }
            : state.combatSystem.activeBattle,
      },
    }));
  },

  abandonBattle: (battleId) => {
    get().endBattle(battleId, "enemy", "Abandon");
  },

  nextTurn: () => {
    set((state) => {
      const battle = state.combatSystem.activeBattle;
      if (!battle || battle.status !== "Active") return state;

      const nextIndex =
        (battle.turnOrder.currentIndex + 1) %
        battle.turnOrder.participants.length;
      const isNewRound = nextIndex === 0;

      return {
        combatSystem: {
          ...state.combatSystem,
          activeBattle: {
            ...battle,
            turnOrder: {
              ...battle.turnOrder,
              currentIndex: nextIndex,
              phase: "Action",
            },
            currentTurn: isNewRound
              ? battle.currentTurn + 1
              : battle.currentTurn,
          },
        },
      };
    });

    // Process end-of-turn effects
    get().updateStatusEffects();

    // Check victory conditions
    const battle = get().combatSystem.activeBattle;
    if (battle) {
      // Check if all enemies are defeated
      const aliveEnemies = battle.enemyTeam.filter(
        (p) => p.currentStats.health > 0,
      );
      const aliveAllies = battle.playerTeam.filter(
        (p) => p.currentStats.health > 0,
      );

      if (aliveEnemies.length === 0) {
        get().endBattle(battle.id, "player", "Victory");
        return;
      }

      if (aliveAllies.length === 0) {
        get().endBattle(battle.id, "enemy", "Defeat");
        return;
      }

      // Check turn limit
      if (battle.currentTurn >= battle.maxTurns) {
        get().endBattle(battle.id, "draw", "Timeout");
        return;
      }
    }

    // Execute AI turn if current participant is AI
    const currentParticipant = get().getCurrentParticipant();
    if (currentParticipant?.source === "ai") {
      setTimeout(() => {
        get().executeAITurn(currentParticipant.id);
      }, get().combatSystem.combatSettings.aiDelay);
    }
  },

  endTurn: (participantId) => {
    set((state) => {
      const battle = state.combatSystem.activeBattle;
      if (!battle) return state;

      const turnEntry = battle.turnOrder.participants.find(
        (p) => p.participantId === participantId,
      );
      if (turnEntry) {
        turnEntry.hasActed = true;
      }

      return {
        combatSystem: {
          ...state.combatSystem,
          activeBattle: {
            ...battle,
            turnOrder: {
              ...battle.turnOrder,
              participants: battle.turnOrder.participants.map((p) =>
                p.participantId === participantId
                  ? { ...p, hasActed: true }
                  : p,
              ),
            },
          },
        },
      };
    });

    get().nextTurn();
  },

  calculateTurnOrder: () => {
    set((state) => {
      const battle = state.combatSystem.activeBattle;
      if (!battle) return state;

      const allParticipants = [...battle.playerTeam, ...battle.enemyTeam];
      const turnEntries = allParticipants
        .filter((p) => p.currentStats.health > 0)
        .map((p) => ({
          participantId: p.id,
          speed: p.currentStats.speed,
          initiative: p.currentStats.speed + Math.random() * 10,
          delayedTurns: 0,
          hasActed: false,
          canAct: true,
        }))
        .sort((a, b) => b.initiative - a.initiative);

      return {
        combatSystem: {
          ...state.combatSystem,
          activeBattle: {
            ...battle,
            turnOrder: {
              ...battle.turnOrder,
              participants: turnEntries,
              currentIndex: 0,
              phase: "Action",
            },
          },
        },
      };
    });
  },

  getCurrentParticipant: () => {
    const battle = get().combatSystem.activeBattle;
    if (!battle) return null;

    const currentEntry =
      battle.turnOrder.participants[battle.turnOrder.currentIndex];
    if (!currentEntry) return null;

    return get().getParticipant(currentEntry.participantId);
  },

  queueAction: (participantId, action, targets = []) => {
    const participant = get().getParticipant(participantId);
    if (!participant) return false;

    // Validate action
    if (!get().validateAction(participantId, action, targets)) {
      return false;
    }

    // Add to action queue
    set((state) => {
      const battle = state.combatSystem.activeBattle;
      if (!battle) return state;

      const updateParticipant = (participants: CombatParticipant[]) =>
        participants.map((p) =>
          p.id === participantId
            ? {
                ...p,
                actionQueue: [
                  ...p.actionQueue,
                  {
                    action,
                    targets,
                    priority: action.priority || 0,
                    queueTime: Date.now(),
                  } as ExtendedQueuedAction,
                ],
              }
            : p,
        );

      return {
        combatSystem: {
          ...state.combatSystem,
          activeBattle: {
            ...battle,
            playerTeam: updateParticipant(battle.playerTeam),
            enemyTeam: updateParticipant(battle.enemyTeam),
          },
        },
      };
    });

    get().addLogEntry({
      turn: get().combatSystem.activeBattle?.currentTurn || 0,
      phase: "Action",
      type: "Action",
      description: `${participant.character.name} queued ${action.name}`,
      details: { participantId, actionId: action.id, targets },
    });

    return true;
  },

  executeAction: async (participantId, actionId) => {
    const participant = get().getParticipant(participantId);
    if (!participant) return;

    const action = participant.availableActions.find((a) => a.id === actionId);
    if (!action) return;

    // Get the queued action with targets
    const queuedAction = participant.actionQueue.find(
      (qa) => qa.action.id === actionId,
    ) as ExtendedQueuedAction;
    if (!queuedAction) return;

    const { targets } = queuedAction;
    const battle = get().combatSystem.activeBattle;
    if (!battle) return;

    // Check resource costs
    const manaCost =
      action.costs.find((c) => c.resource === "mana")?.amount || 0;
    if (manaCost > participant.currentStats.mana) {
      get().addLogEntry({
        turn: battle.currentTurn,
        phase: "Action",
        type: "System",
        description: `${participant.character.name} doesn't have enough mana for ${action.name}`,
        details: {
          required: manaCost,
          available: participant.currentStats.mana,
        },
      });
      return;
    }

    // Consume resources
    set((state) => {
      const battle = state.combatSystem.activeBattle;
      if (!battle) return state;

      const updateParticipant = (participants: CombatParticipant[]) =>
        participants.map((p) =>
          p.id === participantId
            ? {
                ...p,
                currentStats: {
                  ...p.currentStats,
                  mana: Math.max(0, p.currentStats.mana - manaCost),
                },
                actionQueue: p.actionQueue.filter(
                  (qa) => qa.action.id !== actionId,
                ),
              }
            : p,
        );

      return {
        combatSystem: {
          ...state.combatSystem,
          activeBattle: {
            ...battle,
            playerTeam: updateParticipant(battle.playerTeam),
            enemyTeam: updateParticipant(battle.enemyTeam),
          },
        },
      };
    });

    // Execute action effects
    for (const effect of action.effects) {
      await get().executeActionEffect(participantId, effect, targets);
    }

    get().addLogEntry({
      turn: battle.currentTurn,
      phase: "Action",
      type: "Action",
      description: `${participant.character.name} used ${action.name}`,
      details: {
        participantId,
        actionId,
        targets,
        effects: action.effects.length,
      },
    });

    // End turn after action execution
    get().endTurn(participantId);
  },

  executeActionEffect: async (participantId, effect, targets) => {
    const participant = get().getParticipant(participantId);
    if (!participant) return;

    const battle = get().combatSystem.activeBattle;
    if (!battle) return;

    // Get target participants
    const allParticipants = [...battle.playerTeam, ...battle.enemyTeam];
    const targetParticipants = targets
      .map((targetId) => allParticipants.find((p) => p.id === targetId))
      .filter((p) => p !== undefined);

    if (targetParticipants.length === 0) return;

    // Calculate effect values
    for (const target of targetParticipants) {
      let effectValue = effect.calculation.baseValue;

      // Apply scaling based on caster stats
      if (effect.calculation.scalingStat) {
        for (const [stat, multiplier] of Object.entries(
          effect.calculation.scalingStat,
        )) {
          if (
            participant.currentStats[
              stat as keyof typeof participant.currentStats
            ]
          ) {
            effectValue +=
              (participant.currentStats[
                stat as keyof typeof participant.currentStats
              ] as number) * multiplier;
          }
        }
      }

      // Apply element effectiveness
      if (effect.elementalTypes && effect.elementalTypes.length > 0) {
        const targetElement = target.character.element;
        const effectElement = effect.elementalTypes[0];

        // Simplified elemental effectiveness
        const effectiveness = get().getElementalEffectiveness(
          effectElement,
          targetElement,
        );
        effectValue *= effectiveness;
      }

      // Apply random variance
      if (effect.calculation.variance) {
        const variance = effect.calculation.variance;
        effectValue *= 1 - variance + Math.random() * variance * 2;
      }

      effectValue = Math.floor(effectValue);

      // Create effect with calculated value
      const calculatedEffect = {
        ...effect,
        calculation: {
          ...effect.calculation,
          baseValue: effectValue,
        },
      };

      // Apply the effect
      get().applyEffect(target, calculatedEffect, participant.id);

      // Handle special effect types
      if (effect.type === "Status") {
        // Create a status effect from the combat effect
        const statusEffect: StatusEffect = {
          id: `status_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: `${effect.type} Effect`,
          type: effectValue > 0 ? "Buff" : "Debuff",
          category: "Magical",
          description: `${effect.type} effect applied by ${participant.character.name}`,
          icon: "✨",
          duration: 3,
          maxDuration: 3,
          stacks: 1,
          maxStacks: 5,
          effects: [
            {
              stat: effect.calculation.scalingStat || "attack",
              modification: effectValue,
              type: "flat",
              operation: "add",
            },
          ],
          dispellable: true,
          source: participant.id,
          appliedAt: Date.now(),
        };
        get().addStatusEffect(target.id, statusEffect);
      }
    }

    // Add animation delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 500));
  },

  cancelAction: (participantId) => {
    set((state) => {
      const battle = state.combatSystem.activeBattle;
      if (!battle) return state;

      const updateParticipant = (participants: CombatParticipant[]) =>
        participants.map((p) =>
          p.id === participantId ? { ...p, actionQueue: [] } : p,
        );

      return {
        combatSystem: {
          ...state.combatSystem,
          activeBattle: {
            ...battle,
            playerTeam: updateParticipant(battle.playerTeam),
            enemyTeam: updateParticipant(battle.enemyTeam),
          },
        },
      };
    });

    const participant = get().getParticipant(participantId);
    if (participant) {
      get().addLogEntry({
        turn: get().combatSystem.activeBattle?.currentTurn || 0,
        phase: "Action",
        type: "System",
        description: `${participant.character.name} cancelled their action`,
        details: { participantId },
      });
    }
  },

  getAvailableActions: (participantId) => {
    const participant = get().getParticipant(participantId);
    return participant?.availableActions || [];
  },

  validateAction: (participantId, action, targets = []) => {
    const participant = get().getParticipant(participantId);
    if (!participant) return false;

    const battle = get().combatSystem.activeBattle;
    if (!battle || battle.status !== "Active") return false;

    // Check if it's the participant's turn
    const currentParticipant = get().getCurrentParticipant();
    if (currentParticipant?.id !== participantId) return false;

    // Check if participant can act
    const turnEntry = battle.turnOrder.participants.find(
      (p) => p.participantId === participantId,
    );
    if (!turnEntry?.canAct || turnEntry.hasActed) return false;

    // Check if participant is alive
    if (participant.currentStats.health <= 0) return false;

    // Check resource costs
    const manaCost =
      action.costs.find((c) => c.resource === "mana")?.amount || 0;
    if (manaCost > participant.currentStats.mana) return false;

    // Check cooldowns
    const now = Date.now();
    const lastUsed =
      (
        participant.actionQueue.find(
          (qa) => qa.action.id === action.id,
        ) as ExtendedQueuedAction
      )?.queueTime || 0;
    if (action.cooldown && now - lastUsed < action.cooldown * 1000)
      return false;

    // Validate targets based on targeting type
    if (action.targeting.type === "Single") {
      const restrictions = action.targeting.restrictions || [];
      const teamRestriction = restrictions.find((r) => r.type === "team");

      if (teamRestriction) {
        if (teamRestriction.value === "enemy") {
          const enemyTeam =
            participant.position.team === "player"
              ? battle.enemyTeam
              : battle.playerTeam;
          const validTargets = targets.filter((targetId) =>
            enemyTeam.some(
              (p) => p.id === targetId && p.currentStats.health > 0,
            ),
          );
          if (validTargets.length === 0) return false;
        } else if (teamRestriction.value === "ally") {
          const allyTeam =
            participant.position.team === "player"
              ? battle.playerTeam
              : battle.enemyTeam;
          const validTargets = targets.filter((targetId) =>
            allyTeam.some(
              (p) => p.id === targetId && p.currentStats.health > 0,
            ),
          );
          if (validTargets.length === 0) return false;
        }
      }
    }

    // Check status effect restrictions
    const restrictiveEffects = participant.statusEffects.filter((e) =>
      e.effects.some(
        (eff) => eff.stat === "actions" && eff.operation === "disable",
      ),
    );
    if (restrictiveEffects.length > 0) return false;

    return true;
  },

  calculateDamage: (attacker, target, action) => {
    // Simplified damage calculation
    const baseDamage =
      action.effects.find((e) => e.type === "Damage")?.calculation.baseValue ||
      0;
    const attackPower = attacker.currentStats.attack;
    const defense = target.currentStats.defense;

    const damage = Math.max(1, baseDamage + attackPower - defense);
    return Math.floor(damage * (0.8 + Math.random() * 0.4)); // Random variance
  },

  calculateHealing: (caster, target, action) => {
    // Simplified healing calculation
    const baseHealing =
      action.effects.find((e) => e.type === "Healing")?.calculation.baseValue ||
      0;
    const magicPower = caster.currentStats.elementalPower;

    return Math.floor(baseHealing + magicPower * 0.5);
  },

  applyEffect: (target, effect, source) => {
    set((state) => {
      const battle = state.combatSystem.activeBattle;
      if (!battle) return state;

      const updateParticipant = (participants: CombatParticipant[]) =>
        participants.map((p) => {
          if (p.id !== target.id) return p;

          const newStats = { ...p.currentStats };

          // Apply stat modifications
          switch (effect.type) {
            case "Damage":
              newStats.health = Math.max(
                0,
                newStats.health - effect.calculation.baseValue,
              );
              break;
            case "Healing":
              newStats.health = Math.min(
                p.maxStats.health,
                newStats.health + effect.calculation.baseValue,
              );
              break;
            case "Mana":
              if (effect.calculation.baseValue > 0) {
                newStats.mana = Math.min(
                  p.maxStats.mana,
                  newStats.mana + effect.calculation.baseValue,
                );
              } else {
                newStats.mana = Math.max(
                  0,
                  newStats.mana + effect.calculation.baseValue,
                );
              }
              break;
            case "StatModifier":
              // Handle stat modifications through status effects
              break;
          }

          return {
            ...p,
            currentStats: newStats,
          };
        });

      return {
        combatSystem: {
          ...state.combatSystem,
          activeBattle: {
            ...battle,
            playerTeam: updateParticipant(battle.playerTeam),
            enemyTeam: updateParticipant(battle.enemyTeam),
          },
        },
      };
    });

    // Log the effect
    get().addLogEntry({
      turn: get().combatSystem.activeBattle?.currentTurn || 0,
      phase: "Action",
      type:
        effect.type === "Damage"
          ? "Damage"
          : effect.type === "Healing"
            ? "Healing"
            : "Status",
      description: `${target.character.name} ${effect.type === "Damage" ? "takes" : "receives"} ${effect.calculation.baseValue} ${effect.type.toLowerCase()}`,
      details: {
        targetId: target.id,
        effectType: effect.type,
        value: effect.calculation.baseValue,
        source,
      },
      value:
        effect.type === "Damage"
          ? -effect.calculation.baseValue
          : effect.calculation.baseValue,
    });
  },

  addStatusEffect: (participantId, effect) => {
    set((state) => {
      const battle = state.combatSystem.activeBattle;
      if (!battle) return state;

      const updateParticipant = (participants: CombatParticipant[]) =>
        participants.map((p) =>
          p.id === participantId
            ? { ...p, statusEffects: [...p.statusEffects, effect] }
            : p,
        );

      return {
        combatSystem: {
          ...state.combatSystem,
          activeBattle: {
            ...battle,
            playerTeam: updateParticipant(battle.playerTeam),
            enemyTeam: updateParticipant(battle.enemyTeam),
          },
        },
      };
    });
  },

  removeStatusEffect: (participantId, effectId) => {
    set((state) => {
      const battle = state.combatSystem.activeBattle;
      if (!battle) return state;

      const updateParticipant = (participants: CombatParticipant[]) =>
        participants.map((p) =>
          p.id === participantId
            ? {
                ...p,
                statusEffects: p.statusEffects.filter((e) => e.id !== effectId),
              }
            : p,
        );

      return {
        combatSystem: {
          ...state.combatSystem,
          activeBattle: {
            ...battle,
            playerTeam: updateParticipant(battle.playerTeam),
            enemyTeam: updateParticipant(battle.enemyTeam),
          },
        },
      };
    });
  },

  updateStatusEffects: () => {
    set((state) => {
      const battle = state.combatSystem.activeBattle;
      if (!battle) return state;

      const updateParticipantEffects = (participants: CombatParticipant[]) =>
        participants.map((p) => {
          const updatedEffects = p.statusEffects
            .map((effect) => {
              // Reduce duration by 1
              const newDuration = effect.duration - 1;

              // Apply tick effects if applicable
              if (
                effect.tickInterval &&
                Date.now() - effect.appliedAt >= effect.tickInterval
              ) {
                for (const eff of effect.effects) {
                  if (eff.operation === "tick") {
                    // Apply tick damage/healing
                    const newStats = { ...p.currentStats };
                    if (eff.stat === "health") {
                      newStats.health = Math.max(
                        0,
                        Math.min(
                          p.maxStats.health,
                          newStats.health + eff.modification,
                        ),
                      );
                    }
                    p.currentStats = newStats;
                  }
                }
              }

              return { ...effect, duration: newDuration };
            })
            .filter((effect) => effect.duration > 0); // Remove expired effects

          return { ...p, statusEffects: updatedEffects };
        });

      return {
        combatSystem: {
          ...state.combatSystem,
          activeBattle: {
            ...battle,
            playerTeam: updateParticipantEffects(battle.playerTeam),
            enemyTeam: updateParticipantEffects(battle.enemyTeam),
          },
        },
      };
    });
  },

  clearStatusEffects: (participantId, type) => {
    set((state) => {
      const battle = state.combatSystem.activeBattle;
      if (!battle) return state;

      const updateParticipant = (participants: CombatParticipant[]) =>
        participants.map((p) =>
          p.id === participantId
            ? {
                ...p,
                statusEffects: type
                  ? p.statusEffects.filter((e) => e.type !== type)
                  : [],
              }
            : p,
        );

      return {
        combatSystem: {
          ...state.combatSystem,
          activeBattle: {
            ...battle,
            playerTeam: updateParticipant(battle.playerTeam),
            enemyTeam: updateParticipant(battle.enemyTeam),
          },
        },
      };
    });
  },

  setFormation: (formationId) => {
    set((state) => ({
      combatSystem: {
        ...state.combatSystem,
        activeFormation: formationId,
      },
    }));
  },

  createCustomFormation: (formation) => {
    const formationId = `custom_${Date.now()}`;
    const newFormation = { ...formation, id: formationId };

    set((state) => ({
      combatSystem: {
        ...state.combatSystem,
        formations: [...state.combatSystem.formations, newFormation],
      },
    }));

    return formationId;
  },

  updateFormation: (formationId, updates) => {
    set((state) => ({
      combatSystem: {
        ...state.combatSystem,
        formations: state.combatSystem.formations.map((f) =>
          f.id === formationId ? { ...f, ...updates } : f,
        ),
      },
    }));
  },

  deleteFormation: (formationId) => {
    set((state) => ({
      combatSystem: {
        ...state.combatSystem,
        formations: state.combatSystem.formations.filter(
          (f) => f.id !== formationId,
        ),
      },
    }));
  },

  getFormationBonuses: (formationId, team) => {
    const formation = get().combatSystem.formations.find(
      (f) => f.id === formationId,
    );
    if (!formation) return [];

    const activeBonuses = [];

    // Check formation requirements
    for (const bonus of formation.bonuses) {
      let requirementsMet = true;

      // Check if team meets formation position requirements
      const positionedMembers = team.filter((member) => {
        return formation.positions.some(
          (pos) =>
            pos.row === member.position.row &&
            pos.column === member.position.column,
        );
      });

      if (positionedMembers.length < formation.positions.length) {
        requirementsMet = false;
      }

      // Check element requirements
      const teamElements = team.map((m) => m.character.element);
      const uniqueElements = new Set(teamElements);

      if (bonus.requirements && bonus.requirements.elements) {
        const requiredElements = bonus.requirements.elements;
        if (!requiredElements.every((element) => uniqueElements.has(element))) {
          requirementsMet = false;
        }
      }

      if (requirementsMet) {
        activeBonuses.push(bonus);
      }
    }

    return activeBonuses;
  },

  executeAITurn: async (participantId) => {
    const participant = get().getParticipant(participantId);
    if (!participant || !participant.ai) {
      get().endTurn(participantId);
      return;
    }

    const battle = get().combatSystem.activeBattle;
    if (!battle) return;

    // Get available actions
    const availableActions = get().getAvailableActions(participantId);
    if (availableActions.length === 0) {
      get().endTurn(participantId);
      return;
    }

    // Simple AI decision making based on AI personality
    const { type: aiType, difficulty } = participant.ai;

    let chosenAction: CombatAction;
    let targets: string[] = [];

    // AI decision logic based on AI type
    switch (aiType) {
      case "Aggressive":
        // Prioritize damage actions
        chosenAction =
          availableActions.filter((a) =>
            a.effects.some((e) => e.type === "Damage"),
          )[0] || availableActions[0];
        break;

      case "Defensive":
        // Prioritize healing/support actions
        chosenAction =
          availableActions.filter((a) =>
            a.effects.some((e) => e.type === "Healing" || e.type === "Status"),
          )[0] || availableActions[0];
        break;

      case "Balanced":
      default:
        // Random selection weighted by action priority
        chosenAction =
          availableActions[Math.floor(Math.random() * availableActions.length)];
        break;
    }

    // Select targets based on targeting rules
    if (chosenAction.targeting.type === "Self") {
      targets = [participantId];
    } else if (chosenAction.targeting.type === "Single") {
      const restrictions = chosenAction.targeting.restrictions || [];
      const teamRestriction = restrictions.find((r) => r.type === "team");

      if (teamRestriction?.value === "enemy") {
        const enemyTeam =
          participant.position.team === "player"
            ? battle.enemyTeam
            : battle.playerTeam;
        const validTargets = enemyTeam.filter((p) => p.currentStats.health > 0);
        if (validTargets.length > 0) {
          targets = [
            validTargets[Math.floor(Math.random() * validTargets.length)].id,
          ];
        }
      } else if (teamRestriction?.value === "ally") {
        const allyTeam =
          participant.position.team === "player"
            ? battle.playerTeam
            : battle.enemyTeam;
        const validTargets = allyTeam.filter((p) => p.currentStats.health > 0);
        if (validTargets.length > 0) {
          // Prioritize injured allies for healing
          const injuredAllies = validTargets.filter(
            (p) => p.currentStats.health < p.maxStats.health,
          );
          const targetPool =
            injuredAllies.length > 0 ? injuredAllies : validTargets;
          targets = [
            targetPool[Math.floor(Math.random() * targetPool.length)].id,
          ];
        }
      }
    }

    // Execute the chosen action
    if (get().queueAction(participantId, chosenAction, targets)) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // AI thinking delay
      await get().executeAction(participantId, chosenAction.id);
    } else {
      get().endTurn(participantId);
    }
  },

  updateAIKnowledge: (participantId, event, data) => {
    set((state) => {
      const battle = state.combatSystem.activeBattle;
      if (!battle) return state;

      const updateParticipant = (participants: CombatParticipant[]) =>
        participants.map((p) => {
          if (p.id !== participantId || !p.ai) return p;

          const updatedKnowledge = { ...p.ai.knowledge };

          switch (event) {
            case "damage_taken":
              updatedKnowledge.threatLevel = Math.min(
                10,
                (updatedKnowledge.threatLevel || 0) + data.amount / 100,
              );
              break;
            case "action_used":
              if (!updatedKnowledge.enemyActions) {
                updatedKnowledge.enemyActions = [];
              }
              updatedKnowledge.enemyActions.push({
                actionId: data.actionId,
                effectiveness: data.effectiveness || 1,
                timestamp: Date.now(),
              });
              break;
            case "status_applied":
              updatedKnowledge.statusEffectCount =
                (updatedKnowledge.statusEffectCount || 0) + 1;
              break;
          }

          return {
            ...p,
            ai: {
              ...p.ai,
              knowledge: updatedKnowledge,
            },
          };
        });

      return {
        combatSystem: {
          ...state.combatSystem,
          activeBattle: {
            ...battle,
            playerTeam: updateParticipant(battle.playerTeam),
            enemyTeam: updateParticipant(battle.enemyTeam),
          },
        },
      };
    });
  },

  addLogEntry: (entry) => {
    const logEntry: CombatLogEntry = {
      ...entry,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    set((state) => {
      const battle = state.combatSystem.activeBattle;
      if (!battle) return state;

      return {
        combatSystem: {
          ...state.combatSystem,
          activeBattle: {
            ...battle,
            combatLog: [...battle.combatLog, logEntry],
          },
        },
      };
    });
  },

  getCombatLog: (battleId) => {
    const battle = battleId
      ? get().combatSystem.battles.find((b) => b.id === battleId)
      : get().combatSystem.activeBattle;

    return battle?.combatLog || [];
  },

  clearCombatLog: (battleId) => {
    set((state) => {
      if (battleId) {
        // Clear specific battle log
        const battle = state.combatSystem.battles.find(
          (b) => b.id === battleId,
        );
        if (battle) {
          battle.combatLog = [];
        }
      } else {
        // Clear active battle log
        const battle = state.combatSystem.activeBattle;
        if (battle) {
          battle.combatLog = [];
        }
      }

      return {
        combatSystem: {
          ...state.combatSystem,
          battles: state.combatSystem.battles.map((b) =>
            b.id === battleId ? { ...b, combatLog: [] } : b,
          ),
          activeBattle:
            state.combatSystem.activeBattle && !battleId
              ? { ...state.combatSystem.activeBattle, combatLog: [] }
              : state.combatSystem.activeBattle,
        },
      };
    });
  },

  recordBattle: (record) => {
    const combatRecord: CombatRecord = {
      ...record,
      id: `record_${Date.now()}`,
      timestamp: Date.now(),
    };

    set((state) => ({
      combatSystem: {
        ...state.combatSystem,
        combatHistory: [
          ...state.combatSystem.combatHistory,
          combatRecord,
        ].slice(-100),
      },
    }));
  },

  getCombatHistory: (limit = 50) => {
    return get().combatSystem.combatHistory.slice(-limit).reverse();
  },

  getCombatAnalytics: () => {
    const history = get().combatSystem.combatHistory;

    return {
      totalBattles: history.length,
      victories: history.filter((r) => r.result === "Victory").length,
      defeats: history.filter((r) => r.result === "Defeat").length,
      winRate:
        history.length > 0
          ? (history.filter((r) => r.result === "Victory").length /
              history.length) *
            100
          : 0,
      averageTurns:
        history.length > 0
          ? history.reduce((sum, r) => sum + r.turns, 0) / history.length
          : 0,
      averageDuration:
        history.length > 0
          ? history.reduce((sum, r) => sum + r.duration, 0) / history.length
          : 0,
    };
  },

  updateCombatSettings: (settings) => {
    set((state) => ({
      combatSystem: {
        ...state.combatSystem,
        combatSettings: {
          ...state.combatSystem.combatSettings,
          ...settings,
        },
      },
    }));
  },

  getParticipant: (participantId) => {
    const battle = get().combatSystem.activeBattle;
    if (!battle) return null;

    return (
      [...battle.playerTeam, ...battle.enemyTeam].find(
        (p) => p.id === participantId,
      ) || null
    );
  },

  getParticipantsByTeam: (team) => {
    const battle = get().combatSystem.activeBattle;
    if (!battle) return [];

    return team === "player" ? battle.playerTeam : battle.enemyTeam;
  },

  getBattleById: (battleId) => {
    return get().combatSystem.battles.find((b) => b.id === battleId) || null;
  },

  transformCharacter: (participantId, formId) => {
    const participant = get().getParticipant(participantId);
    if (!participant) return false;

    // Check transformation charges
    if (participant.transformationCharges <= 0) return false;

    // Check if already transformed
    if (participant.isTransformed) return false;

    set((state) => {
      const battle = state.combatSystem.activeBattle;
      if (!battle) return state;

      const updateParticipant = (participants: CombatParticipant[]) =>
        participants.map((p) =>
          p.id === participantId
            ? {
                ...p,
                isTransformed: true,
                transformationCharges: p.transformationCharges - 1,
                currentStats: {
                  ...p.currentStats,
                  // Boost stats during transformation
                  attack: Math.floor(p.currentStats.attack * 1.5),
                  elementalPower: Math.floor(
                    p.currentStats.elementalPower * 1.5,
                  ),
                  speed: Math.floor(p.currentStats.speed * 1.2),
                },
              }
            : p,
        );

      return {
        combatSystem: {
          ...state.combatSystem,
          activeBattle: {
            ...battle,
            playerTeam: updateParticipant(battle.playerTeam),
            enemyTeam: updateParticipant(battle.enemyTeam),
          },
        },
      };
    });

    get().addLogEntry({
      turn: get().combatSystem.activeBattle?.currentTurn || 0,
      phase: "Action",
      type: "System",
      description: `${participant.character.name} transforms!`,
      details: { participantId, formId },
    });

    return true;
  },

  revertTransformation: (participantId) => {
    const participant = get().getParticipant(participantId);
    if (!participant || !participant.isTransformed) return false;

    set((state) => {
      const battle = state.combatSystem.activeBattle;
      if (!battle) return state;

      const updateParticipant = (participants: CombatParticipant[]) =>
        participants.map((p) =>
          p.id === participantId
            ? {
                ...p,
                isTransformed: false,
                currentStats: {
                  ...p.maxStats,
                  health: p.currentStats.health, // Keep current health
                  mana: p.currentStats.mana, // Keep current mana
                },
              }
            : p,
        );

      return {
        combatSystem: {
          ...state.combatSystem,
          activeBattle: {
            ...battle,
            playerTeam: updateParticipant(battle.playerTeam),
            enemyTeam: updateParticipant(battle.enemyTeam),
          },
        },
      };
    });

    get().addLogEntry({
      turn: get().combatSystem.activeBattle?.currentTurn || 0,
      phase: "Action",
      type: "System",
      description: `${participant.character.name} reverts transformation`,
      details: { participantId },
    });

    return true;
  },

  getElementalEffectiveness: (attackElement, targetElement) => {
    // Elemental effectiveness chart
    const effectiveness: { [key: string]: { [key: string]: number } } = {
      Fire: { Ice: 1.5, Nature: 1.5, Water: 0.5, Earth: 0.5 },
      Water: { Fire: 1.5, Earth: 1.5, Nature: 0.5, Lightning: 0.5 },
      Earth: { Lightning: 1.5, Fire: 1.5, Air: 0.5, Nature: 0.5 },
      Air: { Earth: 1.5, Water: 1.5, Ice: 0.5, Lightning: 0.5 },
      Ice: { Water: 1.5, Air: 1.5, Fire: 0.5, Light: 0.5 },
      Lightning: { Water: 1.5, Air: 1.5, Earth: 0.5, Nature: 0.5 },
      Light: { Darkness: 1.5, Void: 1.5, Crystal: 0.5, Celestial: 0.5 },
      Darkness: { Light: 1.5, Celestial: 1.5, Void: 0.5, Crystal: 0.5 },
      Nature: { Earth: 1.5, Water: 1.5, Fire: 0.5, Lightning: 0.5 },
      Celestial: { Darkness: 1.5, Void: 1.5, Light: 0.5, Crystal: 0.5 },
      Void: { Light: 1.5, Celestial: 1.5, Darkness: 0.5, Crystal: 0.5 },
      Crystal: { Light: 1.5, Darkness: 1.5, Celestial: 0.5, Void: 0.5 },
    };

    return effectiveness[attackElement]?.[targetElement] || 1.0;
  },
});
