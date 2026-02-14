import React from 'react';
import type { CombatBattle } from '../../types/combat';

interface TurnOrderProps {
  battle: CombatBattle;
  className?: string;
}

const TurnOrder: React.FC<TurnOrderProps> = ({ battle, className = '' }) => {
  const { turnOrder } = battle;

  const getParticipantName = (participantId: string) => {
    const participant = [...battle.playerTeam, ...battle.enemyTeam].find(
      p => p.id === participantId
    );
    return participant?.character.name || 'Unknown';
  };

  const getParticipantTeam = (participantId: string) => {
    const participant = [...battle.playerTeam, ...battle.enemyTeam].find(
      p => p.id === participantId
    );
    return participant?.position.team || 'unknown';
  };

  const getParticipantHealth = (participantId: string) => {
    const participant = [...battle.playerTeam, ...battle.enemyTeam].find(
      p => p.id === participantId
    );
    return participant ? participant.currentStats.health : 0;
  };

  return (
    <div className={`bg-white border rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Turn Order</h3>

      <div className="space-y-2">
        {turnOrder.participants.map((entry, index) => {
          const isCurrent = index === turnOrder.currentIndex;
          const isAlive = getParticipantHealth(entry.participantId) > 0;
          const team = getParticipantTeam(entry.participantId);

          return (
            <div
              key={entry.participantId}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                isCurrent
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : team === 'player'
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
              } ${!isAlive ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCurrent
                      ? 'bg-blue-500 text-white'
                      : team === 'player'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                  }`}
                >
                  {index + 1}
                </div>

                <div>
                  <div className={`font-medium text-sm ${!isAlive ? 'line-through' : ''}`}>
                    {getParticipantName(entry.participantId)}
                  </div>
                  <div className="text-xs text-gray-600">
                    SPD: {entry.speed} • Team: {team}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-sm font-medium ${isAlive ? 'text-gray-800' : 'text-red-600'}`}
                >
                  {isAlive ? 'Ready' : 'Defeated'}
                </div>
                {entry.delayedTurns > 0 && (
                  <div className="text-xs text-orange-600">Delayed ({entry.delayedTurns})</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-gray-600">
        <div>
          Phase: <span className="font-medium">{turnOrder.phase}</span>
        </div>
        <div>
          Tiebreaker: <span className="font-medium">{turnOrder.speedTiebreaker}</span>
        </div>
      </div>
    </div>
  );
};

export default TurnOrder;
