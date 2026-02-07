import React, { useEffect, useRef } from 'react';
import type { CombatBattle, CombatLogEntry } from '../../types/combat';

interface CombatLogProps {
  battle: CombatBattle;
  className?: string;
  maxEntries?: number;
}

const CombatLog: React.FC<CombatLogProps> = ({
  battle,
  className = '',
  maxEntries = 20
}) => {
  const logRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [battle.combatLog]);

  const recentEntries = battle.combatLog.slice(-maxEntries);

  const getEntryIcon = (type: CombatLogEntry['type']) => {
    switch (type) {
      case 'Action': return '⚔️';
      case 'Damage': return '💥';
      case 'Healing': return '💚';
      case 'Status': return '✨';
      case 'Movement': return '🏃';
      case 'Environment': return '🌍';
      case 'System': return 'ℹ️';
      case 'Victory': return '🏆';
      case 'Defeat': return '💀';
      default: return '📝';
    }
  };

  const getEntryColor = (type: CombatLogEntry['type']) => {
    switch (type) {
      case 'Damage': return 'text-red-600';
      case 'Healing': return 'text-green-600';
      case 'Victory': return 'text-yellow-600';
      case 'Defeat': return 'text-red-800';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className={`bg-white border rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Combat Log</h3>

      <div
        ref={logRef}
        className="h-64 overflow-y-auto space-y-2 p-2 bg-gray-50 rounded"
      >
        {recentEntries.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            No combat events yet
          </div>
        ) : (
          recentEntries.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-start space-x-2 p-2 rounded text-sm ${
                entry.type === 'Action' ? 'bg-blue-50' :
                entry.type === 'Damage' ? 'bg-red-50' :
                entry.type === 'Healing' ? 'bg-green-50' :
                'bg-gray-50'
              }`}
            >
              <span className="text-lg">{getEntryIcon(entry.type)}</span>
              <div className="flex-1">
                <div className={`font-medium ${getEntryColor(entry.type)}`}>
                  {entry.description}
                </div>
                {entry.details && (
                  <div className="text-xs text-gray-600 mt-1">
                    {Object.entries(entry.details).map(([key, value]) => (
                      <span key={key} className="mr-2">
                        {key}: {String(value)}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  Turn {entry.turn} • {entry.phase}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {battle.combatLog.length > maxEntries && (
        <div className="text-xs text-gray-500 text-center mt-2">
          Showing last {maxEntries} of {battle.combatLog.length} entries
        </div>
      )}
    </div>
  );
};

export default CombatLog;