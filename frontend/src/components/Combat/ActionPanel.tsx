import React from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import type { CombatParticipant, CombatAction } from "../../types/combat";

interface ActionPanelProps {
  participant: CombatParticipant;
  availableActions: CombatAction[];
  selectedAction: CombatAction | null;
  onActionSelect: (action: CombatAction) => void;
  targetMode: boolean;
  onCancelTarget: () => void;
}

interface ActionButtonProps {
  action: CombatAction;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
  participant: CombatParticipant;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  isSelected,
  isDisabled,
  onClick,
  participant,
}) => {
  const getActionColor = (type: string) => {
    switch (type) {
      case "Attack":
        return "from-red-600 to-red-700";
      case "Spell":
        return "from-purple-600 to-purple-700";
      case "Ability":
        return "from-blue-600 to-blue-700";
      case "Item":
        return "from-green-600 to-green-700";
      case "Special":
        return "from-yellow-600 to-yellow-700";
      default:
        return "from-gray-600 to-gray-700";
    }
  };

  const canAfford = () => {
    // Check if participant can afford the action costs
    return action.costs.every((cost) => {
      switch (cost.resource) {
        case "mana":
          return participant.currentStats.mana >= cost.amount;
        case "health":
          return participant.currentStats.health >= cost.amount;
        default:
          return true;
      }
    });
  };

  const isOnCooldown = action.currentCooldown > 0;
  const affordable = canAfford();
  const disabled = isDisabled || !affordable || isOnCooldown;

  return (
    <motion.button
      className={`
        relative p-3 rounded-lg border-2 text-left transition-all duration-200
        ${
          isSelected
            ? "border-yellow-400 bg-yellow-400 bg-opacity-20"
            : "border-gray-600 hover:border-gray-500"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      disabled={disabled}
    >
      {/* Action Icon and Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getActionColor(action.type)} opacity-20 rounded-lg`}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{action.icon}</span>
            <span className="font-semibold text-white">{action.name}</span>
          </div>

          {/* Action Type Badge */}
          <div
            className={`px-2 py-1 rounded text-xs font-bold bg-gradient-to-r ${getActionColor(action.type)}`}
          >
            {action.type}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 mb-3 leading-tight">
          {action.description}
        </p>

        {/* Costs */}
        {action.costs.length > 0 && (
          <div className="flex items-center space-x-3 mb-2">
            {action.costs.map((cost, index) => (
              <div key={index} className="flex items-center space-x-1 text-xs">
                <span className="text-gray-400">{cost.resource}:</span>
                <span
                  className={`font-semibold ${
                    cost.resource === "mana" &&
                    participant.currentStats.mana < cost.amount
                      ? "text-red-400"
                      : cost.resource === "health" &&
                          participant.currentStats.health < cost.amount
                        ? "text-red-400"
                        : "text-white"
                  }`}
                >
                  {cost.amount}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Additional Info */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-3">
            {action.range > 0 && <span>Range: {action.range}</span>}
            {action.cooldown > 0 && <span>Cooldown: {action.cooldown}</span>}
          </div>

          {/* Current Cooldown */}
          {action.currentCooldown > 0 && (
            <span className="text-red-400 font-semibold">
              {action.currentCooldown} turns
            </span>
          )}
        </div>

        {/* Cast Time Indicator */}
        {action.castTime > 0 && (
          <div className="mt-2 flex items-center space-x-1 text-xs text-yellow-400">
            <span>⏳</span>
            <span>Cast Time: {action.castTime / 1000}s</span>
          </div>
        )}

        {/* Targeting Info */}
        <div className="mt-2 text-xs text-gray-500">
          Target: {action.targeting.type}
          {action.targeting.count && ` (${action.targeting.count})`}
        </div>
      </div>

      {/* Selection Glow */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 border-2 border-yellow-400 rounded-lg"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};

export const ActionPanel: React.FC<ActionPanelProps> = ({
  participant,
  availableActions,
  selectedAction,
  onActionSelect,
  targetMode,
  onCancelTarget,
}) => {
  const getHealthPercentage = () => {
    return (
      (participant.currentStats.health / participant.maxStats.health) * 100
    );
  };

  const getManaPercentage = () => {
    return (participant.currentStats.mana / participant.maxStats.mana) * 100;
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Character Info */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white">
              {participant.character.name}
            </h3>
            <div className="text-sm text-gray-400">
              Lv.{participant.character.level}
            </div>
          </div>

          {/* Health Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-red-400">Health</span>
              <span className="text-white">
                {participant.currentStats.health}/{participant.maxStats.health}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-red-500 h-2 rounded-full"
                initial={{ width: "100%" }}
                animate={{ width: `${getHealthPercentage()}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Mana Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-blue-400">Mana</span>
              <span className="text-white">
                {participant.currentStats.mana}/{participant.maxStats.mana}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: "100%" }}
                animate={{ width: `${getManaPercentage()}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Target Mode Indicator */}
        {targetMode && selectedAction && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-yellow-400 font-semibold">
                  Select Target for {selectedAction.name}
                </div>
                <div className="text-gray-400 text-sm">
                  {selectedAction.targeting.type} targeting
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={onCancelTarget}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div>
          <h4 className="text-md font-semibold text-white mb-3">
            Available Actions
          </h4>

          {availableActions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">⚔️</div>
              <p className="text-gray-400">No actions available</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableActions.map((action) => (
                <ActionButton
                  key={action.id}
                  action={action}
                  isSelected={selectedAction?.id === action.id}
                  isDisabled={targetMode && selectedAction?.id !== action.id}
                  onClick={() => onActionSelect(action)}
                  participant={participant}
                />
              ))}
            </div>
          )}
        </div>

        {/* Transformation Status */}
        {participant.isTransformed && (
          <div className="p-3 bg-purple-900 bg-opacity-50 border border-purple-600 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-purple-400">✨</span>
              <span className="text-purple-400 font-semibold">Transformed</span>
              <div className="flex-1" />
              <span className="text-sm text-gray-400">
                {participant.transformationCharges}/
                {participant.maxTransformationCharges} charges
              </span>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-gray-400">Attack</div>
            <div className="text-white font-semibold">
              {participant.currentStats.attack}
            </div>
          </div>
          <div>
            <div className="text-gray-400">Defense</div>
            <div className="text-white font-semibold">
              {participant.currentStats.defense}
            </div>
          </div>
          <div>
            <div className="text-gray-400">Speed</div>
            <div className="text-white font-semibold">
              {participant.currentStats.speed}
            </div>
          </div>
          <div>
            <div className="text-gray-400">Accuracy</div>
            <div className="text-white font-semibold">
              {participant.currentStats.accuracy}%
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
