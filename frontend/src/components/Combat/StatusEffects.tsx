import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import type { CombatParticipant, StatusEffect } from '../../types/combat';

interface StatusEffectsProps {
  participant: CombatParticipant | null;
}

interface StatusEffectCardProps {
  effect: StatusEffect;
  index: number;
}

const StatusEffectCard: React.FC<StatusEffectCardProps> = ({ effect, index }) => {
  const getEffectColor = (type: string) => {
    switch (type) {
      case 'Buff': return 'from-green-600 to-green-700';
      case 'Debuff': return 'from-red-600 to-red-700';
      case 'Neutral': return 'from-gray-600 to-gray-700';
      case 'Transform': return 'from-purple-600 to-purple-700';
      case 'Environmental': return 'from-cyan-600 to-cyan-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getEffectIcon = (category: string) => {
    switch (category) {
      case 'Physical': return '💪';
      case 'Magical': return '✨';
      case 'Mental': return '🧠';
      case 'Elemental': return '🌟';
      case 'Special': return '⭐';
      case 'Transformation': return '🦋';
      default: return '💫';
    }
  };

  const getDurationColor = (duration: number, maxDuration: number) => {
    const percentage = (duration / maxDuration) * 100;
    if (percentage > 66) return 'text-green-400';
    if (percentage > 33) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatDuration = (duration: number) => {
    if (duration === -1) return 'Permanent';
    if (duration === 0) return 'Expired';
    return `${duration} turn${duration !== 1 ? 's' : ''}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className={`
        relative p-3 rounded-lg border-2 bg-gradient-to-br ${getEffectColor(effect.type)}
        ${effect.type === 'Buff' ? 'border-green-500' :
          effect.type === 'Debuff' ? 'border-red-500' : 'border-gray-500'}
        ${effect.duration <= 1 ? 'animate-pulse' : ''}
      `}
    >
      {/* Effect Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{effect.icon || getEffectIcon(effect.category)}</span>
          <div>
            <div className="font-semibold text-white text-sm">{effect.name}</div>
            <div className="text-xs text-gray-300">{effect.category}</div>
          </div>
        </div>

        {/* Stacks */}
        {effect.stacks > 1 && (
          <div className="bg-black bg-opacity-50 px-2 py-1 rounded text-xs font-bold text-white">
            x{effect.stacks}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-200 mb-3 leading-tight">
        {effect.description}
      </p>

      {/* Duration Bar */}
      {effect.duration > 0 && effect.maxDuration > 0 && (
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-300">Duration</span>
            <span className={getDurationColor(effect.duration, effect.maxDuration)}>
              {formatDuration(effect.duration)}
            </span>
          </div>
          <div className="w-full bg-black bg-opacity-30 rounded-full h-1.5">
            <motion.div
              className={`h-1.5 rounded-full ${
                effect.duration > effect.maxDuration * 0.66 ? 'bg-green-400' :
                effect.duration > effect.maxDuration * 0.33 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              initial={{ width: '100%' }}
              animate={{ width: `${(effect.duration / effect.maxDuration) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Effects Preview */}
      {effect.effects.length > 0 && (
        <div className="space-y-1">
          {effect.effects.slice(0, 3).map((effectData, i) => (
            <div key={i} className="text-xs text-gray-300 flex justify-between">
              <span className="capitalize">{effectData.stat}:</span>
              <span className={`font-semibold ${
                effectData.operation === 'add' && effectData.modification > 0 ? 'text-green-400' :
                effectData.operation === 'subtract' || effectData.modification < 0 ? 'text-red-400' :
                'text-yellow-400'
              }`}>
                {effectData.operation === 'add' ? '+' : effectData.operation === 'subtract' ? '-' : ''}
                {Math.abs(effectData.modification)}
                {effectData.type === 'percentage' ? '%' : ''}
              </span>
            </div>
          ))}
          {effect.effects.length > 3 && (
            <div className="text-xs text-gray-400">
              +{effect.effects.length - 3} more effects
            </div>
          )}
        </div>
      )}

      {/* Dispellable Indicator */}
      {effect.dispellable && (
        <div className="absolute top-1 right-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full" title="Dispellable" />
        </div>
      )}

      {/* Tick Interval */}
      {effect.tickInterval && (
        <div className="mt-2 text-xs text-gray-400">
          Ticks every {effect.tickInterval / 1000}s
        </div>
      )}
    </motion.div>
  );
};

export const StatusEffects: React.FC<StatusEffectsProps> = ({ participant }) => {
  if (!participant) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-bold text-white mb-4">Status Effects</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">✨</div>
          <p className="text-gray-400">Select a character to view status effects</p>
        </div>
      </Card>
    );
  }

  const { statusEffects } = participant;
  const buffs = statusEffects.filter(effect => effect.type === 'Buff');
  const debuffs = statusEffects.filter(effect => effect.type === 'Debuff');
  const others = statusEffects.filter(effect => !['Buff', 'Debuff'].includes(effect.type));

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Status Effects</h3>
          <div className="text-sm text-gray-400">
            {statusEffects.length} active
          </div>
        </div>

        {/* Character Name */}
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-400">
            {participant.character.name}
          </div>
          <div className="text-sm text-gray-400">
            Lv.{participant.character.level} • {participant.character.element}
          </div>
        </div>

        {/* Status Effects */}
        {statusEffects.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">😌</div>
            <p className="text-gray-400">No active status effects</p>
            <p className="text-gray-500 text-sm">
              Character is in normal condition
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {/* Buffs */}
            {buffs.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center">
                  <span className="mr-2">💚</span>
                  Buffs ({buffs.length})
                </h4>
                <div className="space-y-2">
                  {buffs.map((effect, index) => (
                    <StatusEffectCard
                      key={effect.id}
                      effect={effect}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Debuffs */}
            {debuffs.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center">
                  <span className="mr-2">💔</span>
                  Debuffs ({debuffs.length})
                </h4>
                <div className="space-y-2">
                  {debuffs.map((effect, index) => (
                    <StatusEffectCard
                      key={effect.id}
                      effect={effect}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Effects */}
            {others.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center">
                  <span className="mr-2">✨</span>
                  Other Effects ({others.length})
                </h4>
                <div className="space-y-2">
                  {others.map((effect, index) => (
                    <StatusEffectCard
                      key={effect.id}
                      effect={effect}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats with Effects */}
        {statusEffects.length > 0 && (
          <div className="pt-3 border-t border-gray-700">
            <h4 className="text-sm font-semibold text-white mb-2">Modified Stats</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Attack:</span>
                <span className="text-white">{participant.currentStats.attack}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Defense:</span>
                <span className="text-white">{participant.currentStats.defense}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Speed:</span>
                <span className="text-white">{participant.currentStats.speed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Accuracy:</span>
                <span className="text-white">{participant.currentStats.accuracy}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};