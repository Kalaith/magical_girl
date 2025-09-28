import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import type { RecruitmentCurrencies } from '../../types/recruitment';

interface CurrencyItemProps {
  name: string;
  value: number;
  icon: string;
  color: string;
}

const CurrencyItem: React.FC<CurrencyItemProps> = ({ name, value, icon, color }) => (
  <motion.div
    className={`flex items-center space-x-2 px-3 py-2 bg-black bg-opacity-30 rounded-lg border border-${color}-500 border-opacity-30`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <span className="text-lg">{icon}</span>
    <div>
      <div className={`text-${color}-300 text-xs font-medium`}>{name}</div>
      <div className="text-white font-bold">
        {value.toLocaleString()}
      </div>
    </div>
  </motion.div>
);

export const CurrencyDisplay: React.FC = () => {
  const { recruitmentSystem, resources } = useGameStore();

  const currencies = [
    {
      key: 'friendshipPoints' as keyof RecruitmentCurrencies,
      name: 'Friendship Points',
      icon: '💕',
      color: 'pink'
    },
    {
      key: 'premiumGems' as keyof RecruitmentCurrencies,
      name: 'Premium Gems',
      icon: '💎',
      color: 'purple'
    },
    {
      key: 'summonTickets' as keyof RecruitmentCurrencies,
      name: 'Summon Tickets',
      icon: '🎫',
      color: 'blue'
    },
    {
      key: 'rareTickets' as keyof RecruitmentCurrencies,
      name: 'Rare Tickets',
      icon: '🎟️',
      color: 'yellow'
    },
    {
      key: 'legendaryTickets' as keyof RecruitmentCurrencies,
      name: 'Legendary Tickets',
      icon: '🎭',
      color: 'red'
    },
    {
      key: 'dreamshards' as keyof RecruitmentCurrencies,
      name: 'Dreamshards',
      icon: '✨',
      color: 'indigo'
    }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {currencies.map(({ key, name, icon, color }) => {
        const value = recruitmentSystem.currencies[key] || resources[key] || 0;

        return (
          <CurrencyItem
            key={key}
            name={name}
            value={value}
            icon={icon}
            color={color}
          />
        );
      })}
    </div>
  );
};