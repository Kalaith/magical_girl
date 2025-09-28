import React from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/Card";
import type { CombatTurnOrder, CombatParticipant } from "../../types/combat";

interface TurnOrderProps {
  turnOrder: CombatTurnOrder;
  participants: CombatParticipant[];
}

interface TurnEntryProps {
  participant: CombatParticipant;
  isActive: boolean;
  hasActed: boolean;
  canAct: boolean;
  position: number;
}

const TurnEntry: React.FC<TurnEntryProps> = ({
  participant,
  isActive,
  hasActed,
  canAct,
  position,
}) => {
  const getElementIcon = (element: string) => {
    const icons: { [key: string]: string } = {
      Fire: "🔥",
      Water: "💧",
      Earth: "🌱",
      Air: "💨",
      Ice: "❄️",
      Lightning: "⚡",
      Light: "☀️",
      Darkness: "🌙",
      Nature: "🌿",
      Celestial: "⭐",
      Void: "🌌",
      Crystal: "💎",
    };
    return icons[element] || "✨";
  };

  const getHealthPercentage = () => {
    return (
      (participant.currentStats.health / participant.maxStats.health) * 100
    );
  };

  const isPlayerTeam = participant.position.team === "player";
  const isDead = participant.currentStats.health <= 0;

  return (
    <motion.div
      className={`
        relative p-3 rounded-lg border transition-all duration-200
        ${
          isActive
            ? "border-yellow-400 bg-yellow-400 bg-opacity-20 shadow-lg"
            : hasActed
              ? "border-gray-600 bg-gray-800 bg-opacity-50 opacity-60"
              : "border-gray-600 bg-gray-800 bg-opacity-30"
        }
        ${!canAct || isDead ? "opacity-50" : ""}
      `}
      animate={{
        scale: isActive ? 1.05 : 1,
        y: isActive ? -2 : 0,
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Position Number */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-gray-700 border border-gray-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
        {position + 1}
      </div>

      {/* Active Turn Indicator */}
      {isActive && (
        <motion.div
          className="absolute inset-0 border-2 border-yellow-400 rounded-lg"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}

      <div className="flex items-center space-x-3">
        {/* Character Avatar */}
        <div
          className={`
          relative w-12 h-12 rounded-lg flex items-center justify-center border-2
          ${isPlayerTeam ? "border-blue-400 bg-blue-900 bg-opacity-30" : "border-red-400 bg-red-900 bg-opacity-30"}
        `}
        >
          <span className="text-lg">
            {getElementIcon(participant.character.element)}
          </span>

          {/* Transformation Indicator */}
          {participant.isTransformed && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
          )}
        </div>

        {/* Character Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-white truncate">
              {participant.character.name}
            </h4>
            <span className="text-xs text-gray-400">
              Lv.{participant.character.level}
            </span>
          </div>

          {/* Health Bar */}
          <div className="mt-1">
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <motion.div
                className={`h-1.5 rounded-full ${
                  getHealthPercentage() > 50
                    ? "bg-green-500"
                    : getHealthPercentage() > 25
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                initial={{ width: "100%" }}
                animate={{ width: `${getHealthPercentage()}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Speed/Initiative */}
          <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
            <span>Speed: {participant.currentStats.speed}</span>
            <span>{isPlayerTeam ? "Player" : "Enemy"}</span>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center justify-between mt-2">
        {/* Status Effects */}
        <div className="flex space-x-1">
          {participant.statusEffects.slice(0, 4).map((effect) => (
            <div
              key={effect.id}
              className={`w-4 h-4 rounded text-xs flex items-center justify-center ${
                effect.type === "Buff"
                  ? "bg-green-500"
                  : effect.type === "Debuff"
                    ? "bg-red-500"
                    : "bg-yellow-500"
              }`}
              title={`${effect.name} (${effect.duration} turns)`}
            >
              {effect.stacks > 1 && (
                <span className="text-white text-xs font-bold">
                  {effect.stacks}
                </span>
              )}
            </div>
          ))}
          {participant.statusEffects.length > 4 && (
            <div className="w-4 h-4 bg-gray-500 rounded text-xs flex items-center justify-center">
              <span className="text-white">+</span>
            </div>
          )}
        </div>

        {/* Action Status */}
        <div className="flex items-center space-x-1 text-xs">
          {hasActed && <span className="text-green-400">✓ Acted</span>}
          {isActive && (
            <span className="text-yellow-400 animate-pulse">● Active</span>
          )}
          {isDead && <span className="text-red-400">✗ KO</span>}
          {!canAct && !isDead && (
            <span className="text-gray-400">⏸ Disabled</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const TurnOrder: React.FC<TurnOrderProps> = ({
  turnOrder,
  participants,
}) => {
  const getParticipantById = (id: string) => {
    return participants.find((p) => p.id === id);
  };

  const sortedEntries = turnOrder.participants
    .map((entry, index) => ({
      ...entry,
      participant: getParticipantById(entry.participantId),
      originalIndex: index,
    }))
    .filter((entry) => entry.participant !== undefined);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Turn Order</h3>
          <div className="text-sm text-gray-400">
            Phase: <span className="text-yellow-400">{turnOrder.phase}</span>
          </div>
        </div>

        {/* Turn Queue */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {sortedEntries.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">⏳</div>
              <p className="text-gray-400">Calculating turn order...</p>
            </div>
          ) : (
            sortedEntries.map((entry, displayIndex) => (
              <TurnEntry
                key={entry.participantId}
                participant={entry.participant!}
                isActive={turnOrder.currentIndex === entry.originalIndex}
                hasActed={entry.hasActed}
                canAct={entry.canAct}
                position={displayIndex}
              />
            ))
          )}
        </div>

        {/* Turn Order Info */}
        <div className="pt-3 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Current Turn</div>
              <div className="text-white font-semibold">
                {turnOrder.currentIndex + 1} / {turnOrder.participants.length}
              </div>
            </div>
            <div>
              <div className="text-gray-400">Speed Tiebreaker</div>
              <div className="text-white font-semibold capitalize">
                {turnOrder.speedTiebreaker.replace("_", " ")}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="pt-3 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 border-2 border-blue-400 rounded" />
              <span>Player</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 border-2 border-red-400 rounded" />
              <span>Enemy</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span>Buff</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded" />
              <span>Debuff</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
