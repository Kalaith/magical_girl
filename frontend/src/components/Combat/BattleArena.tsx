import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../stores/gameStore";
import { BattleGrid } from "./BattleGrid";
import { ActionPanel } from "./ActionPanel";
import { CombatLog } from "./CombatLog";
import { TurnOrder } from "./TurnOrder";
import { StatusEffects } from "./StatusEffects";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import type { CombatBattle, CombatAction } from "../../types/combat";

interface BattleArenaProps {
  battle: CombatBattle;
}

export const BattleArena: React.FC<BattleArenaProps> = ({ battle }) => {
  const {
    endBattle,
    getCurrentParticipant,
    executeAction,
    getAvailableActions,
    endTurn,
    addNotification,
  } = useGameStore();

  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(
    null,
  );
  const [selectedAction, setSelectedAction] = useState<CombatAction | null>(
    null,
  );
  const [targetMode, setTargetMode] = useState(false);
  const [hoveredPosition, setHoveredPosition] = useState<{
    row: number;
    column: number;
  } | null>(null);

  const currentParticipant = getCurrentParticipant();
  const isPlayerTurn = currentParticipant?.source === "player";
  const availableActions = currentParticipant
    ? getAvailableActions(currentParticipant.id)
    : [];

  // Auto-select current participant if it's player turn
  useEffect(() => {
    if (isPlayerTurn && currentParticipant) {
      setSelectedParticipant(currentParticipant.id);
    } else {
      setSelectedParticipant(null);
    }
  }, [isPlayerTurn, currentParticipant]);

  const handleActionSelect = (action: CombatAction) => {
    setSelectedAction(action);

    // If action targets self, execute immediately
    if (action.targeting.type === "Self") {
      handleExecuteAction(action, []);
    } else {
      setTargetMode(true);
    }
  };

  const handleTargetSelect = (participantId: string) => {
    if (selectedAction && targetMode) {
      handleExecuteAction(selectedAction, [participantId]);
    } else {
      setSelectedParticipant(participantId);
    }
  };

  const handleExecuteAction = async (
    action: CombatAction,
    _targets: string[],
  ) => {
    if (!currentParticipant) return;

    try {
      await executeAction(currentParticipant.id, action.id);

      setSelectedAction(null);
      setTargetMode(false);

      // End turn after action
      endTurn(currentParticipant.id);

      addNotification({
        type: "info",
        title: "Action Executed",
        message: `${currentParticipant.character.name} used ${action.name}!`,
      });
    } catch {
      addNotification({
        type: "error",
        title: "Action Failed",
        message: "Unable to execute action",
      });
    }
  };

  const handleEndTurn = () => {
    if (currentParticipant) {
      endTurn(currentParticipant.id);
      setSelectedAction(null);
      setTargetMode(false);
    }
  };

  const handleSurrender = () => {
    endBattle(battle.id, "enemy", "Surrender");
  };

  const getParticipantAtPosition = (row: number, column: number) => {
    return [...battle.playerTeam, ...battle.enemyTeam].find(
      (p) => p.position.row === row && p.position.column === column,
    );
  };

  const canTargetPosition = (row: number, column: number): boolean => {
    if (!selectedAction || !targetMode) return false;

    const participant = getParticipantAtPosition(row, column);
    if (!participant) return false;

    // Simple targeting validation
    const targeting = selectedAction.targeting;

    if (targeting.type === "Single") {
      const teamRestriction = targeting.restrictions.find(
        (r) => r.type === "team",
      );
      if (teamRestriction) {
        if (teamRestriction.value === "enemy") {
          return (
            participant.position.team !== currentParticipant?.position.team
          );
        }
        if (teamRestriction.value === "ally") {
          return (
            participant.position.team === currentParticipant?.position.team
          );
        }
      }
    }

    return true;
  };

  return (
    <div className="space-y-6">
      {/* Battle Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">{battle.name}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>
                Turn {battle.currentTurn}/{battle.maxTurns}
              </span>
              <span>•</span>
              <span>{battle.environment.name}</span>
              <span>•</span>
              <span
                className={`font-semibold ${
                  battle.status === "Active"
                    ? "text-green-400"
                    : battle.status === "Paused"
                      ? "text-yellow-400"
                      : "text-red-400"
                }`}
              >
                {battle.status}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isPlayerTurn && (
              <>
                <Button
                  variant="secondary"
                  onClick={handleEndTurn}
                  size="sm"
                  disabled={!currentParticipant}
                >
                  End Turn
                </Button>
                <Button variant="danger" onClick={handleSurrender} size="sm">
                  Surrender
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Main Battle Area */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Battle Grid */}
        <div className="xl:col-span-2">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">Battle Field</h3>
            <BattleGrid
              battle={battle}
              selectedParticipant={selectedParticipant}
              onParticipantSelect={handleTargetSelect}
              onPositionHover={setHoveredPosition}
              hoveredPosition={hoveredPosition}
              targetMode={targetMode}
              canTarget={canTargetPosition}
            />
          </Card>
        </div>

        {/* Side Panels */}
        <div className="xl:col-span-2 space-y-6">
          {/* Turn Order */}
          <TurnOrder
            turnOrder={battle.turnOrder}
            participants={[...battle.playerTeam, ...battle.enemyTeam]}
          />

          {/* Action Panel */}
          {isPlayerTurn && currentParticipant && (
            <ActionPanel
              participant={currentParticipant}
              availableActions={availableActions}
              selectedAction={selectedAction}
              onActionSelect={handleActionSelect}
              targetMode={targetMode}
              onCancelTarget={() => {
                setSelectedAction(null);
                setTargetMode(false);
              }}
            />
          )}

          {/* Status Effects */}
          {selectedParticipant && (
            <StatusEffects
              participant={
                [...battle.playerTeam, ...battle.enemyTeam].find(
                  (p) => p.id === selectedParticipant,
                ) || null
              }
            />
          )}
        </div>
      </div>

      {/* Combat Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CombatLog combatLog={battle.combatLog} maxEntries={10} />

        {/* Battle Environment Info */}
        <Card className="p-4">
          <h3 className="text-lg font-bold text-white mb-3">Environment</h3>
          <div className="space-y-3">
            <div>
              <div className="text-purple-400 font-semibold">
                {battle.environment.name}
              </div>
              <div className="text-gray-400 text-sm">
                {battle.environment.description}
              </div>
            </div>

            {battle.environment.weather.type !== "Clear" && (
              <div>
                <div className="text-blue-400 font-semibold">Weather</div>
                <div className="text-gray-400 text-sm">
                  {battle.environment.weather.type} (Intensity:{" "}
                  {battle.environment.weather.intensity})
                </div>
              </div>
            )}

            {battle.environment.effects.length > 0 && (
              <div>
                <div className="text-green-400 font-semibold">
                  Active Effects
                </div>
                <div className="space-y-1">
                  {battle.environment.effects.map((effect, index) => (
                    <div key={index} className="text-gray-400 text-sm">
                      • {effect.name}: {effect.description}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {battle.environment.bonuses.length > 0 && (
              <div>
                <div className="text-yellow-400 font-semibold">
                  Environmental Bonuses
                </div>
                <div className="space-y-1">
                  {battle.environment.bonuses.map((bonus, index) => (
                    <div key={index} className="text-gray-400 text-sm">
                      • {bonus.name}: {bonus.description}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Target Mode Overlay */}
      <AnimatePresence>
        {targetMode && selectedAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          >
            <Card className="p-6 max-w-md mx-4">
              <h3 className="text-xl font-bold text-white mb-4">
                Select Target for {selectedAction.name}
              </h3>
              <p className="text-gray-400 mb-6">{selectedAction.description}</p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedAction(null);
                    setTargetMode(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
