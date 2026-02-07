import React from 'react';
import type { CombatParticipant } from '../../types/combat';
import { useGameStore } from '../../stores/gameStore';
import BattleGrid from './BattleGrid';
import ActionPanel from './ActionPanel';
import CombatLog from './CombatLog';
import TurnOrder from './TurnOrder';

interface BattleArenaProps {
  className?: string;
}

const BattleArena: React.FC<BattleArenaProps> = ({ className = '' }) => {
  const { combatSystem } = useGameStore();
  const { activeBattle } = combatSystem;

  if (!activeBattle) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Active Battle</h2>
          <p className="text-gray-500">Start a mission to begin combat!</p>
        </div>
      </div>
    );
  }

  const currentParticipant = activeBattle.turnOrder.participants[activeBattle.turnOrder.currentIndex];
  const isPlayerTurn = activeBattle.playerTeam.some(p => p.id === currentParticipant?.participantId);

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Battle Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {activeBattle.type} Battle
          </h2>
          <div className="text-sm text-gray-600">
            Turn {activeBattle.currentTurn} • {activeBattle.turnOrder.phase} Phase
          </div>
        </div>

        {/* Battle Status */}
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="font-medium">Status:</span> {activeBattle.status}
            </div>
            <div className="text-sm">
              <span className="font-medium">Current Turn:</span> {currentParticipant?.participantId || 'Unknown'}
            </div>
          </div>
          <div className="text-sm">
            <span className="font-medium">Player Turn:</span>
            <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
              isPlayerTurn ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isPlayerTurn ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Battle Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Player Team */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Your Team</h3>
          <div className="space-y-2">
            {activeBattle.playerTeam.map((participant) => (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                isCurrent={participant.id === currentParticipant?.participantId}
                isPlayerTeam={true}
              />
            ))}
          </div>
        </div>

        {/* Center - Battle Grid */}
        <div className="flex flex-col items-center">
          <BattleGrid battle={activeBattle} />
        </div>

        {/* Right Panel - Enemy Team */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Enemies</h3>
          <div className="space-y-2">
            {activeBattle.enemyTeam.map((participant) => (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                isCurrent={participant.id === currentParticipant?.participantId}
                isPlayerTeam={false}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action Panel */}
      {isPlayerTurn && (
        <div className="mt-6">
          <ActionPanel battle={activeBattle} />
        </div>
      )}

      {/* Turn Order and Combat Log */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TurnOrder battle={activeBattle} />
        <CombatLog battle={activeBattle} />
      </div>
    </div>
  );
};

interface ParticipantCardProps {
  participant: CombatParticipant;
  isCurrent: boolean;
  isPlayerTeam: boolean;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({
  participant,
  isCurrent,
  isPlayerTeam
}) => {
  const healthPercent = (participant.currentStats.health / participant.maxStats.health) * 100;
  const isAlive = participant.currentStats.health > 0;

  return (
    <div className={`p-3 rounded-lg border-2 transition-all ${
      isCurrent
        ? 'border-blue-500 bg-blue-50 shadow-md'
        : isPlayerTeam
          ? 'border-green-200 bg-green-50'
          : 'border-red-200 bg-red-50'
    }`}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-sm">{participant.character.name}</h4>
        <span className={`text-xs px-2 py-1 rounded ${
          isAlive
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {isAlive ? 'Alive' : 'Defeated'}
        </span>
      </div>

      {/* Health Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>HP</span>
          <span>{participant.currentStats.health}/{participant.maxStats.health}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              healthPercent > 60 ? 'bg-green-500' :
              healthPercent > 30 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${healthPercent}%` }}
          />
        </div>
      </div>

      {/* Basic Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div>ATK: {participant.currentStats.attack}</div>
        <div>DEF: {participant.currentStats.defense}</div>
        <div>SPD: {participant.currentStats.speed}</div>
        <div>MP: {participant.currentStats.mana}</div>
      </div>

      {/* Status Effects */}
      {participant.statusEffects.length > 0 && (
        <div className="mt-2">
          <div className="flex flex-wrap gap-1">
            {participant.statusEffects.slice(0, 3).map((effect) => (
              <span
                key={effect.id}
                className={`text-xs px-1 py-0.5 rounded ${
                  effect.type === 'Buff' ? 'bg-blue-100 text-blue-800' :
                  effect.type === 'Debuff' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}
                title={effect.description}
              >
                {effect.name}
              </span>
            ))}
            {participant.statusEffects.length > 3 && (
              <span className="text-xs px-1 py-0.5 rounded bg-gray-100 text-gray-800">
                +{participant.statusEffects.length - 3}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleArena;