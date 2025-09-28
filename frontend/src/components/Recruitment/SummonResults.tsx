import React from 'react';
import { motion } from 'framer-motion';
import type { SummonResult, SummonSession } from '../../types/recruitment';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface SummonResultsProps {
  results: SummonResult[];
  onClose: () => void;
  sessionData?: SummonSession | null;
}

const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'Mythical':
      return 'border-red-500 bg-red-500 bg-opacity-20';
    case 'Legendary':
      return 'border-yellow-500 bg-yellow-500 bg-opacity-20';
    case 'Epic':
      return 'border-purple-500 bg-purple-500 bg-opacity-20';
    case 'Rare':
      return 'border-blue-500 bg-blue-500 bg-opacity-20';
    case 'Uncommon':
      return 'border-green-500 bg-green-500 bg-opacity-20';
    default:
      return 'border-gray-500 bg-gray-500 bg-opacity-20';
  }
};

const getRarityStars = (rarity: string): number => {
  switch (rarity) {
    case 'Mythical': return 6;
    case 'Legendary': return 5;
    case 'Epic': return 4;
    case 'Rare': return 3;
    case 'Uncommon': return 2;
    default: return 1;
  }
};

export const SummonResults: React.FC<SummonResultsProps> = ({
  results,
  onClose,
  sessionData
}) => {
  const rarityStats = results.reduce((stats, result) => {
    stats[result.rarity] = (stats[result.rarity] || 0) + 1;
    return stats;
  }, {} as Record<string, number>);

  const newCharacters = results.filter(r => r.isNew).length;
  const featuredPulls = results.filter(r => r.wasFeatured).length;
  const guaranteedPulls = results.filter(r => r.wasGuaranteed).length;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Summon Results (${results.length})`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-800 bg-opacity-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {results.length}
            </div>
            <div className="text-sm text-gray-400">Total Pulls</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {newCharacters}
            </div>
            <div className="text-sm text-gray-400">New Characters</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {featuredPulls}
            </div>
            <div className="text-sm text-gray-400">Featured</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">
              {guaranteedPulls}
            </div>
            <div className="text-sm text-gray-400">Guaranteed</div>
          </div>
        </div>

        {/* Rarity Breakdown */}
        <div className="p-4 bg-gray-800 bg-opacity-50 rounded-lg">
          <h3 className="text-lg font-bold text-white mb-3">Rarity Breakdown</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {Object.entries(rarityStats).map(([rarity, count]) => (
              <div
                key={rarity}
                className={`p-2 rounded-lg border-2 ${getRarityColor(rarity)}`}
              >
                <div className="text-center">
                  <div className="text-xs text-gray-300 mb-1">{rarity}</div>
                  <div className="text-lg font-bold text-white">{count}</div>
                  <div className="flex justify-center">
                    {Array.from({ length: getRarityStars(rarity) }, (_, i) => (
                      <span key={i} className="text-xs text-yellow-400">⭐</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Character Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Characters Obtained</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-3 rounded-lg border-2 ${getRarityColor(result.rarity)}`}
              >
                {/* Character icon/image */}
                <div className="text-center mb-2">
                  <div className="text-3xl mb-1">
                    {result.character.element === 'Fire' ? '🔥' :
                     result.character.element === 'Water' ? '💧' :
                     result.character.element === 'Earth' ? '🌱' :
                     result.character.element === 'Air' ? '💨' :
                     result.character.element === 'Light' ? '☀️' :
                     result.character.element === 'Darkness' ? '🌙' :
                     result.character.element === 'Ice' ? '❄️' :
                     result.character.element === 'Lightning' ? '⚡' :
                     result.character.element === 'Nature' ? '🌿' :
                     result.character.element === 'Celestial' ? '🌟' :
                     result.character.element === 'Void' ? '🌌' :
                     result.character.element === 'Crystal' ? '💎' :
                     '✨'}
                  </div>

                  {/* Stars */}
                  <div className="flex justify-center mb-1">
                    {Array.from({ length: getRarityStars(result.rarity) }, (_, i) => (
                      <span key={i} className="text-xs text-yellow-400">⭐</span>
                    ))}
                  </div>
                </div>

                {/* Character info */}
                <div className="text-center">
                  <div className="text-sm font-bold text-white mb-1 truncate">
                    {result.character.name}
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    {result.character.element}
                  </div>
                  <div className="text-xs text-purple-400">
                    {result.character.specialization}
                  </div>
                </div>

                {/* Status indicators */}
                <div className="absolute top-1 right-1 space-y-1">
                  {result.isNew && (
                    <div className="bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                      NEW
                    </div>
                  )}
                  {result.wasFeatured && (
                    <div className="bg-yellow-500 text-black text-xs px-1 py-0.5 rounded">
                      ⭐
                    </div>
                  )}
                  {result.wasGuaranteed && (
                    <div className="bg-orange-500 text-white text-xs px-1 py-0.5 rounded">
                      🎯
                    </div>
                  )}
                  {result.isDuplicate && (
                    <div className="bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                      DUP
                    </div>
                  )}
                </div>

                {/* Position indicator for multi-pulls */}
                {results.length > 1 && (
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                    #{result.position + 1}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Session Statistics (if available) */}
        {sessionData && (
          <div className="p-4 bg-gray-800 bg-opacity-50 rounded-lg">
            <h3 className="text-lg font-bold text-white mb-3">Session Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Duration</div>
                <div className="text-white font-semibold">
                  {sessionData.endTime && sessionData.startTime ?
                    `${Math.round((sessionData.endTime - sessionData.startTime) / 1000)}s` :
                    'Ongoing'}
                </div>
              </div>
              <div>
                <div className="text-gray-400">New Characters</div>
                <div className="text-green-400 font-semibold">
                  {sessionData.newCharacters}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Duplicates</div>
                <div className="text-blue-400 font-semibold">
                  {sessionData.duplicates}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Pity Used</div>
                <div className="text-orange-400 font-semibold">
                  {sessionData.pityActivated ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Best Pulls Highlight */}
        {results.some(r => ['Epic', 'Legendary', 'Mythical'].includes(r.rarity)) && (
          <div className="p-4 bg-gradient-to-r from-purple-800 to-pink-800 bg-opacity-50 rounded-lg">
            <h3 className="text-lg font-bold text-white mb-3">✨ Best Pulls</h3>
            <div className="flex flex-wrap gap-2">
              {results
                .filter(r => ['Epic', 'Legendary', 'Mythical'].includes(r.rarity))
                .map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${getRarityColor(result.rarity)}`}
                  >
                    <span className="text-2xl">
                      {result.character.element === 'Fire' ? '🔥' :
                       result.character.element === 'Water' ? '💧' :
                       result.character.element === 'Earth' ? '🌱' :
                       result.character.element === 'Air' ? '💨' :
                       result.character.element === 'Light' ? '☀️' :
                       result.character.element === 'Darkness' ? '🌙' :
                       '✨'}
                    </span>
                    <div>
                      <div className="text-white font-semibold text-sm">
                        {result.character.name}
                      </div>
                      <div className="text-xs text-gray-300">
                        {result.rarity} • Pull #{result.position + 1}
                      </div>
                    </div>
                    {result.isNew && (
                      <span className="text-green-400 text-xs font-bold">NEW!</span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 pt-4">
          <Button
            variant="primary"
            onClick={onClose}
            className="px-8 py-3"
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
};