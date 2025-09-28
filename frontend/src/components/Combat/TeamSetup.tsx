import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import type { MagicalGirl, BattleType } from "../../types";

interface TeamSetupProps {
  availableGirls: MagicalGirl[];
  selectedTeam: string[];
  onTeamChange: (team: string[]) => void;
  battleType: BattleType;
  onBattleTypeChange: (type: BattleType) => void;
  onStartBattle: () => void;
}

interface CharacterCardProps {
  girl: MagicalGirl;
  isSelected: boolean;
  onToggle: () => void;
  index: number;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  girl,
  isSelected,
  onToggle,
  index,
}) => {
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

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Mythical":
        return "from-red-500 to-pink-600";
      case "Legendary":
        return "from-yellow-400 to-orange-500";
      case "Epic":
        return "from-purple-500 to-purple-700";
      case "Rare":
        return "from-blue-500 to-blue-700";
      case "Uncommon":
        return "from-green-500 to-green-700";
      default:
        return "from-gray-500 to-gray-700";
    }
  };

  const totalPower = Object.values(girl.stats).reduce(
    (sum, stat) => sum + stat,
    0,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`
        relative cursor-pointer transition-all duration-200
        ${isSelected ? "transform scale-105" : ""}
      `}
      onClick={onToggle}
    >
      <Card
        className={`p-4 ${
          isSelected
            ? "border-yellow-400 bg-yellow-400 bg-opacity-20 shadow-lg"
            : "border-gray-600 hover:border-gray-500"
        }`}
        hoverable
      >
        {/* Rarity Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(girl.rarity)} opacity-10 rounded-lg`}
        />

        {/* Character Info */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getElementIcon(girl.element)}</span>
              <div>
                <h3 className="font-bold text-white text-sm">{girl.name}</h3>
                <div className="text-xs text-gray-400">
                  Lv.{girl.level} • {girl.element}
                </div>
              </div>
            </div>

            {/* Rarity Stars */}
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i <
                    [
                      "Common",
                      "Uncommon",
                      "Rare",
                      "Epic",
                      "Legendary",
                      "Mythical",
                    ].indexOf(girl.rarity) +
                      1
                      ? "text-yellow-400"
                      : "text-gray-600"
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>

          {/* Specialization */}
          <div className="mb-3">
            <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
              {girl.specialization}
            </span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Power:</span>
              <span className="text-white font-semibold">
                {girl.stats.power}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Defense:</span>
              <span className="text-white font-semibold">
                {girl.stats.defense}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Speed:</span>
              <span className="text-white font-semibold">
                {girl.stats.speed}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Magic:</span>
              <span className="text-white font-semibold">
                {girl.stats.magic}
              </span>
            </div>
          </div>

          {/* Total Power */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Total Power:</span>
            <span className="text-lg font-bold text-purple-400">
              {totalPower}
            </span>
          </div>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 border-2 border-yellow-400 rounded-lg"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}

        {/* Selection Checkmark */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-400 text-black rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">✓</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export const TeamSetup: React.FC<TeamSetupProps> = ({
  availableGirls,
  selectedTeam,
  onTeamChange,
  battleType,
  onBattleTypeChange,
  onStartBattle,
}) => {
  const maxTeamSize = 4;

  const handleCharacterToggle = (girlId: string) => {
    if (selectedTeam.includes(girlId)) {
      onTeamChange(selectedTeam.filter((id) => id !== girlId));
    } else if (selectedTeam.length < maxTeamSize) {
      onTeamChange([...selectedTeam, girlId]);
    }
  };

  const getSelectedGirls = () => {
    return selectedTeam
      .map((id) => availableGirls.find((girl) => girl.id === id))
      .filter((girl) => girl !== undefined);
  };

  const calculateTeamPower = () => {
    const selectedGirls = getSelectedGirls();
    return selectedGirls.reduce((total, girl) => {
      return (
        total + Object.values(girl.stats).reduce((sum, stat) => sum + stat, 0)
      );
    }, 0);
  };

  const getTeamElements = () => {
    const selectedGirls = getSelectedGirls();
    const elements = selectedGirls.map((girl) => girl.element);
    return Array.from(new Set(elements));
  };

  const battleTypes: {
    value: BattleType;
    label: string;
    description: string;
  }[] = [
    {
      value: "Training",
      label: "Training Battle",
      description: "Practice battle with moderate difficulty",
    },
    {
      value: "Mission",
      label: "Mission Battle",
      description: "Story-based combat encounter",
    },
    {
      value: "Arena",
      label: "Arena Battle",
      description: "Competitive battle with ranking",
    },
    {
      value: "Boss",
      label: "Boss Battle",
      description: "Challenging encounter against powerful foes",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Battle Type Selection */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-white mb-4">Battle Type</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {battleTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onBattleTypeChange(type.value)}
              className={`
                p-4 rounded-lg border-2 text-left transition-all duration-200
                ${
                  battleType === type.value
                    ? "border-purple-400 bg-purple-400 bg-opacity-20"
                    : "border-gray-600 hover:border-gray-500"
                }
              `}
            >
              <div className="font-semibold text-white mb-1">{type.label}</div>
              <div className="text-sm text-gray-400 leading-tight">
                {type.description}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Team Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Selected Team</h2>
          <Button
            variant="magical"
            onClick={onStartBattle}
            disabled={selectedTeam.length === 0}
            className="px-6 py-2"
          >
            Start Battle
          </Button>
        </div>

        {selectedTeam.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">👥</div>
            <p className="text-gray-400">No characters selected</p>
            <p className="text-gray-500 text-sm">
              Select up to {maxTeamSize} characters for your team
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Team Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-800 bg-opacity-50 rounded-lg">
              <div>
                <div className="text-gray-400 text-sm">Team Size</div>
                <div className="text-white font-bold">
                  {selectedTeam.length}/{maxTeamSize}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Total Power</div>
                <div className="text-purple-400 font-bold">
                  {calculateTeamPower()}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Elements</div>
                <div className="text-white font-bold">
                  {getTeamElements().length}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Average Level</div>
                <div className="text-white font-bold">
                  {Math.round(
                    getSelectedGirls().reduce(
                      (sum, girl) => sum + girl.level,
                      0,
                    ) / selectedTeam.length,
                  )}
                </div>
              </div>
            </div>

            {/* Selected Characters Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {getSelectedGirls().map((girl) => (
                <div
                  key={girl.id}
                  className="p-3 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">
                      {girl.element === "Fire"
                        ? "🔥"
                        : girl.element === "Water"
                          ? "💧"
                          : girl.element === "Earth"
                            ? "🌱"
                            : girl.element === "Air"
                              ? "💨"
                              : girl.element === "Light"
                                ? "☀️"
                                : girl.element === "Darkness"
                                  ? "🌙"
                                  : "✨"}
                    </span>
                    <div>
                      <div className="text-white font-semibold text-sm">
                        {girl.name}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Lv.{girl.level}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-purple-400">
                    Power:{" "}
                    {Object.values(girl.stats).reduce(
                      (sum, stat) => sum + stat,
                      0,
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Character Selection */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Available Characters</h2>
          <div className="text-sm text-gray-400">
            {availableGirls.length} available • {selectedTeam.length}/
            {maxTeamSize} selected
          </div>
        </div>

        {availableGirls.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">
              No Characters Available
            </h3>
            <p className="text-gray-500">
              Recruit magical girls to build your team!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {availableGirls.map((girl, index) => (
                <CharacterCard
                  key={girl.id}
                  girl={girl}
                  isSelected={selectedTeam.includes(girl.id)}
                  onToggle={() => handleCharacterToggle(girl.id)}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Team Size Warning */}
        {selectedTeam.length >= maxTeamSize && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-lg"
          >
            <div className="text-yellow-400 font-semibold">Team Full</div>
            <div className="text-gray-300 text-sm">
              Maximum team size reached. Deselect a character to add a different
              one.
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
};
