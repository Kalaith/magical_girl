import React from "react";
import { motion } from "framer-motion";
import type { CombatBattle, CombatParticipant } from "../../types/combat";

interface BattleGridProps {
  battle: CombatBattle;
  selectedParticipant: string | null;
  onParticipantSelect: (participantId: string) => void;
  onPositionHover: (position: { row: number; column: number } | null) => void;
  hoveredPosition: { row: number; column: number } | null;
  targetMode: boolean;
  canTarget: (row: number, column: number) => boolean;
}

interface PositionProps {
  row: number;
  column: number;
  participant: CombatParticipant | null;
  isSelected: boolean;
  isHovered: boolean;
  isTargetable: boolean;
  targetMode: boolean;
  onClick: () => void;
  onHover: () => void;
  onLeave: () => void;
}

const Position: React.FC<PositionProps> = ({
  row,
  column,
  participant,
  isSelected,
  isHovered,
  isTargetable,
  targetMode,
  onClick,
  onHover,
  onLeave,
}) => {
  const getHealthPercentage = () => {
    if (!participant) return 0;
    return (
      (participant.currentStats.health / participant.maxStats.health) * 100
    );
  };

  const getManaPercentage = () => {
    if (!participant) return 0;
    return (participant.currentStats.mana / participant.maxStats.mana) * 100;
  };

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

  const isPlayerTeam = participant?.position.team === "player";
  const isDead = participant && participant.currentStats.health <= 0;

  return (
    <motion.div
      className={`
        relative aspect-square border-2 rounded-lg cursor-pointer transition-all duration-200
        ${participant ? "border-gray-600" : "border-gray-700 border-dashed"}
        ${isSelected ? "ring-4 ring-blue-400 border-blue-400" : ""}
        ${isHovered ? "bg-gray-700 border-gray-500" : ""}
        ${targetMode && isTargetable ? "ring-2 ring-green-400 border-green-400" : ""}
        ${targetMode && !isTargetable && participant ? "opacity-50" : ""}
        ${isDead ? "opacity-60 grayscale" : ""}
      `}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ scale: participant ? 1.05 : 1.02 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Position Background */}
      <div
        className={`
        absolute inset-0 rounded-lg
        ${isPlayerTeam ? "bg-blue-900 bg-opacity-30" : "bg-red-900 bg-opacity-30"}
        ${!participant ? "bg-gray-800 bg-opacity-50" : ""}
      `}
      />

      {/* Grid Coordinates */}
      <div className="absolute top-1 left-1 text-xs text-gray-500">
        {row},{column}
      </div>

      {participant && (
        <>
          {/* Character Avatar */}
          <div className="absolute inset-2 flex flex-col items-center justify-center">
            {/* Element Icon */}
            <div className="text-2xl mb-1">
              {getElementIcon(participant.character.element)}
            </div>

            {/* Character Name */}
            <div className="text-xs font-semibold text-white text-center leading-tight">
              {participant.character.name
                .split(" ")
                .map((word) => word.slice(0, 4))
                .join(" ")}
            </div>

            {/* Level */}
            <div className="text-xs text-gray-400">
              Lv.{participant.character.level}
            </div>
          </div>

          {/* Health Bar */}
          <div className="absolute bottom-8 left-2 right-2">
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <motion.div
                className="bg-green-500 h-1.5 rounded-full"
                initial={{ width: "100%" }}
                animate={{ width: `${getHealthPercentage()}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Mana Bar */}
          <div className="absolute bottom-5 left-2 right-2">
            <div className="w-full bg-gray-700 rounded-full h-1">
              <motion.div
                className="bg-blue-500 h-1 rounded-full"
                initial={{ width: "100%" }}
                animate={{ width: `${getManaPercentage()}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Status Effects */}
          {participant.statusEffects.length > 0 && (
            <div className="absolute top-6 right-1 flex flex-col space-y-1">
              {participant.statusEffects.slice(0, 3).map((effect) => (
                <div
                  key={effect.id}
                  className={`w-3 h-3 rounded-full text-xs flex items-center justify-center ${
                    effect.type === "Buff"
                      ? "bg-green-500"
                      : effect.type === "Debuff"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                  }`}
                  title={effect.name}
                >
                  {effect.stacks > 1 && (
                    <span className="text-white text-xs font-bold">
                      {effect.stacks}
                    </span>
                  )}
                </div>
              ))}
              {participant.statusEffects.length > 3 && (
                <div className="w-3 h-3 bg-gray-500 rounded-full text-xs flex items-center justify-center">
                  <span className="text-white text-xs">+</span>
                </div>
              )}
            </div>
          )}

          {/* Death Overlay */}
          {isDead && (
            <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center">
              <span className="text-red-400 text-xs font-bold">KO</span>
            </div>
          )}

          {/* Transformation Indicator */}
          {participant.isTransformed && (
            <div className="absolute top-1 right-1">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
            </div>
          )}

          {/* Target Indicator */}
          {targetMode && isTargetable && (
            <motion.div
              className="absolute inset-0 border-2 border-green-400 rounded-lg"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}

          {/* HP/MP Display on Hover */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-12 left-0 right-0 bg-black bg-opacity-80 text-white text-xs p-1 rounded"
            >
              <div>
                HP: {participant.currentStats.health}/
                {participant.maxStats.health}
              </div>
              <div>
                MP: {participant.currentStats.mana}/{participant.maxStats.mana}
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Empty Position Placeholder */}
      {!participant && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs">
          Empty
        </div>
      )}
    </motion.div>
  );
};

export const BattleGrid: React.FC<BattleGridProps> = ({
  battle,
  selectedParticipant,
  onParticipantSelect,
  onPositionHover,
  hoveredPosition,
  targetMode,
  canTarget,
}) => {
  const getParticipantAtPosition = (row: number, column: number) => {
    return [...battle.playerTeam, ...battle.enemyTeam].find(
      (p) => p.position.row === row && p.position.column === column,
    );
  };

  const handlePositionClick = (row: number, column: number) => {
    const participant = getParticipantAtPosition(row, column);
    if (participant) {
      onParticipantSelect(participant.id);
    }
  };

  const handlePositionHover = (row: number, column: number) => {
    onPositionHover({ row, column });
  };

  const handlePositionLeave = () => {
    onPositionHover(null);
  };

  return (
    <div className="space-y-6">
      {/* Enemy Team Area */}
      <div>
        <h4 className="text-sm font-semibold text-red-400 mb-2">Enemy Team</h4>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((row) =>
            [1, 2, 3].map((column) => {
              const participant = getParticipantAtPosition(row, column);
              const isEnemyPosition =
                !participant || participant.position.team === "enemy";

              if (!isEnemyPosition) return null;

              return (
                <Position
                  key={`enemy-${row}-${column}`}
                  row={row}
                  column={column}
                  participant={participant || null}
                  isSelected={selectedParticipant === participant?.id}
                  isHovered={
                    hoveredPosition?.row === row &&
                    hoveredPosition?.column === column
                  }
                  isTargetable={canTarget(row, column)}
                  targetMode={targetMode}
                  onClick={() => handlePositionClick(row, column)}
                  onHover={() => handlePositionHover(row, column)}
                  onLeave={handlePositionLeave}
                />
              );
            }),
          )}
        </div>
      </div>

      {/* Battle Field Separator */}
      <div className="flex items-center">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
        <span className="px-4 text-gray-500 text-sm">Battlefield</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
      </div>

      {/* Player Team Area */}
      <div>
        <h4 className="text-sm font-semibold text-blue-400 mb-2">Your Team</h4>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((row) =>
            [1, 2, 3].map((column) => {
              const participant = getParticipantAtPosition(4 - row, column); // Flip for player side
              const isPlayerPosition =
                !participant || participant.position.team === "player";

              if (!isPlayerPosition) return null;

              return (
                <Position
                  key={`player-${4 - row}-${column}`}
                  row={4 - row}
                  column={column}
                  participant={participant || null}
                  isSelected={selectedParticipant === participant?.id}
                  isHovered={
                    hoveredPosition?.row === 4 - row &&
                    hoveredPosition?.column === column
                  }
                  isTargetable={canTarget(4 - row, column)}
                  targetMode={targetMode}
                  onClick={() => handlePositionClick(4 - row, column)}
                  onHover={() => handlePositionHover(4 - row, column)}
                  onLeave={handlePositionLeave}
                />
              );
            }),
          )}
        </div>
      </div>

      {/* Grid Legend */}
      <div className="flex justify-center space-x-6 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-900 border border-blue-600 rounded" />
          <span>Player</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-900 border border-red-600 rounded" />
          <span>Enemy</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span>Health</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span>Mana</span>
        </div>
      </div>
    </div>
  );
};
