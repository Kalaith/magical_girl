import React from 'react';
import type { CombatBattle, CombatParticipant } from '../../types/combat';

interface BattleGridProps {
  battle: CombatBattle;
  className?: string;
}

const BattleGrid: React.FC<BattleGridProps> = ({ battle, className = '' }) => {
  // Create a 3x3 grid representation
  const grid: (CombatParticipant | null)[][] = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  // Place participants on the grid
  [...battle.playerTeam, ...battle.enemyTeam].forEach((participant) => {
    const { row, column } = participant.position;
    if (row >= 1 && row <= 3 && column >= 1 && column <= 3) {
      grid[row - 1][column - 1] = participant;
    }
  });

  return (
    <div className={`bg-gray-100 p-4 rounded-lg ${className}`}>
      <h3 className="text-center text-lg font-semibold mb-4 text-gray-700">Battle Field</h3>

      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {grid.map((row, rowIndex) =>
          row.map((participant, colIndex) => (
            <GridCell
              key={`${rowIndex}-${colIndex}`}
              participant={participant}
              position={{ row: rowIndex + 1, column: colIndex + 1 }}
            />
          ))
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center space-x-6 text-xs text-gray-600">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-200 rounded mr-1"></div>
          <span>Player Team</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-200 rounded mr-1"></div>
          <span>Enemy Team</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-200 rounded mr-1"></div>
          <span>Current Turn</span>
        </div>
      </div>
    </div>
  );
};

interface GridCellProps {
  participant: CombatParticipant | null;
  position: { row: number; column: number };
}

const GridCell: React.FC<GridCellProps> = ({ participant, position }) => {
  const isPlayerTeam = participant?.position.team === 'player';
  const isCurrentTurn = participant?.id === 'current'; // This would need to be passed down
  const isAlive = participant && participant.currentStats.health > 0;

  return (
    <div className={`
      w-16 h-16 border-2 rounded-lg flex items-center justify-center relative
      ${participant
        ? isPlayerTeam
          ? 'border-green-400 bg-green-100'
          : 'border-red-400 bg-red-100'
        : 'border-gray-300 bg-gray-50'
      }
      ${isCurrentTurn ? 'ring-2 ring-blue-400' : ''}
      transition-all hover:scale-105
    `}>
      {participant ? (
        <div className="text-center">
          <div className={`text-xs font-medium ${
            isAlive ? 'text-gray-800' : 'text-gray-400 line-through'
          }`}>
            {participant.character.name.split(' ')[0]}
          </div>
          <div className="text-xs text-gray-600">
            {participant.currentStats.health > 0
              ? `${participant.currentStats.health}`
              : '💀'
            }
          </div>
        </div>
      ) : (
        <div className="text-xs text-gray-400">
          {position.row},{position.column}
        </div>
      )}

      {/* Position indicator */}
      <div className="absolute -top-1 -right-1 text-xs bg-gray-600 text-white rounded-full w-4 h-4 flex items-center justify-center">
        {position.row}
      </div>
    </div>
  );
};

export default BattleGrid;