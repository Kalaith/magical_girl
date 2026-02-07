import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import type { CombatBattle, CombatParticipant, CombatAction } from '../../types/combat';

interface ActionPanelProps {
  battle: CombatBattle;
  className?: string;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ battle, className = '' }) => {
  const { executeCombatAction } = useGameStore();
  const [selectedAction, setSelectedAction] = useState<CombatAction | null>(null);
  const [selectedTargets, setSelectedTargets] = useState<CombatParticipant[]>([]);

  const currentParticipant = battle.turnOrder.participants[battle.turnOrder.currentIndex];
  const participant = [...battle.playerTeam, ...battle.enemyTeam]
    .find(p => p.id === currentParticipant?.participantId);

  if (!participant) return null;

  const availableActions = participant.availableActions.filter(action =>
    action.currentCooldown === 0 &&
    (action.maxUses === undefined || action.uses < action.maxUses)
  );

  const handleActionSelect = (action: CombatAction) => {
    setSelectedAction(action);
    setSelectedTargets([]);
  };

  const handleTargetSelect = (target: CombatParticipant) => {
    if (!selectedAction) return;

    const { targeting } = selectedAction;

    if (targeting.type === 'Single') {
      setSelectedTargets([target]);
    } else if (targeting.type === 'Multiple') {
      const maxTargets = targeting.count || 3;
      if (selectedTargets.includes(target)) {
        setSelectedTargets(selectedTargets.filter(t => t.id !== target.id));
      } else if (selectedTargets.length < maxTargets) {
        setSelectedTargets([...selectedTargets, target]);
      }
    }
  };

  const handleExecuteAction = () => {
    if (!selectedAction || selectedTargets.length === 0) return;

    executeCombatAction(participant.id, selectedAction, selectedTargets);
    setSelectedAction(null);
    setSelectedTargets([]);
  };

  const canExecuteAction = selectedAction && selectedTargets.length > 0;

  return (
    <div className={`bg-white border rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        {participant.character.name}'s Turn
      </h3>

      {/* Available Actions */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Available Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          {availableActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionSelect(action)}
              className={`p-2 border rounded text-left transition-all ${
                selectedAction?.id === action.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium text-sm">{action.name}</div>
              <div className="text-xs text-gray-600">{action.description}</div>
              <div className="text-xs text-gray-500 mt-1">
                Cost: {action.costs.map(cost => `${cost.amount} ${cost.resource}`).join(', ')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Target Selection */}
      {selectedAction && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Select Targets ({selectedTargets.length}/{selectedAction.targeting.count || 1})
          </h4>
          <div className="space-y-2">
            {[...battle.playerTeam, ...battle.enemyTeam]
              .filter(p => p.currentStats.health > 0)
              .map((target) => (
                <button
                  key={target.id}
                  onClick={() => handleTargetSelect(target)}
                  className={`w-full p-2 border rounded text-left transition-all ${
                    selectedTargets.includes(target)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium text-sm">{target.character.name}</div>
                  <div className="text-xs text-gray-600">
                    HP: {target.currentStats.health}/{target.maxStats.health}
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Execute Action Button */}
      <div className="flex justify-end">
        <button
          onClick={handleExecuteAction}
          disabled={!canExecuteAction}
          className={`px-4 py-2 rounded font-medium transition-all ${
            canExecuteAction
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Execute Action
        </button>
      </div>
    </div>
  );
};

export default ActionPanel;