import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/Card";
import type { CombatFormation } from "../../types/combat";

interface FormationManagerProps {
  formations: CombatFormation[];
  activeFormation: string | null;
  onSetFormation: (formationId: string) => void;
}

interface FormationCardProps {
  formation: CombatFormation;
  isActive: boolean;
  onSelect: () => void;
}

const FormationCard: React.FC<FormationCardProps> = ({
  formation,
  isActive,
  onSelect,
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Offensive":
        return "from-red-600 to-red-700";
      case "Defensive":
        return "from-blue-600 to-blue-700";
      case "Balanced":
        return "from-green-600 to-green-700";
      case "Support":
        return "from-purple-600 to-purple-700";
      case "Elemental":
        return "from-yellow-600 to-yellow-700";
      case "Specialist":
        return "from-cyan-600 to-cyan-700";
      default:
        return "from-gray-600 to-gray-700";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Tank":
        return "🛡️";
      case "Damage":
        return "⚔️";
      case "Support":
        return "✨";
      case "Healer":
        return "💚";
      case "Buffer":
        return "📈";
      case "Debuffer":
        return "📉";
      default:
        return "🔄";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative cursor-pointer transition-all duration-200
        ${isActive ? "transform scale-105" : ""}
      `}
      onClick={onSelect}
    >
      <Card
        className={`p-4 ${
          isActive
            ? "border-yellow-400 bg-yellow-400 bg-opacity-20 shadow-lg"
            : "border-gray-600 hover:border-gray-500"
        }`}
      >
        {/* Category Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(formation.category)} opacity-10 rounded-lg`}
        />

        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white">{formation.name}</h3>
              <div className="text-sm text-gray-400">{formation.category}</div>
            </div>
            <div
              className={`px-2 py-1 rounded text-xs font-bold bg-gradient-to-r ${getCategoryColor(formation.category)}`}
            >
              {formation.category}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-300 leading-tight">
            {formation.description}
          </p>

          {/* Formation Grid Preview */}
          <div className="bg-gray-800 bg-opacity-50 p-3 rounded-lg">
            <div className="text-xs text-gray-400 mb-2">Formation Layout</div>
            <div className="grid grid-cols-3 gap-1">
              {[1, 2, 3].map((row) =>
                [1, 2, 3].map((column) => {
                  const position = formation.positions.find(
                    (p) => p.row === row && p.column === column,
                  );
                  return (
                    <div
                      key={`${row}-${column}`}
                      className={`
                        aspect-square rounded border flex items-center justify-center text-xs
                        ${
                          position
                            ? "border-purple-400 bg-purple-900 bg-opacity-30 text-white"
                            : "border-gray-600 bg-gray-700 bg-opacity-30 text-gray-500"
                        }
                      `}
                    >
                      {position ? (
                        <div className="text-center">
                          <div>{getRoleIcon(position.role)}</div>
                          <div className="text-xs">
                            {position.role.slice(0, 3)}
                          </div>
                        </div>
                      ) : (
                        "○"
                      )}
                    </div>
                  );
                }),
              )}
            </div>
          </div>

          {/* Formation Bonuses */}
          {formation.bonuses.length > 0 && (
            <div>
              <div className="text-sm text-yellow-400 font-semibold mb-2">
                Bonuses
              </div>
              <div className="space-y-1">
                {formation.bonuses.slice(0, 2).map((bonus, index) => (
                  <div key={index} className="text-xs text-gray-300">
                    <div className="font-semibold">{bonus.name}</div>
                    <div className="text-gray-400">{bonus.description}</div>
                  </div>
                ))}
                {formation.bonuses.length > 2 && (
                  <div className="text-xs text-gray-400">
                    +{formation.bonuses.length - 2} more bonuses
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Requirements */}
          {formation.requirements.length > 0 && (
            <div>
              <div className="text-sm text-orange-400 font-semibold mb-1">
                Requirements
              </div>
              <div className="space-y-1">
                {formation.requirements.slice(0, 2).map((req, index) => (
                  <div key={index} className="text-xs text-gray-400">
                    {req.description}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Indicators */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              {formation.isDefault && (
                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                  Default
                </span>
              )}
              {!formation.isUnlocked && (
                <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">
                  Locked
                </span>
              )}
            </div>
            {isActive && (
              <span className="text-yellow-400 text-sm font-semibold">
                Active
              </span>
            )}
          </div>
        </div>

        {/* Active Formation Indicator */}
        {isActive && (
          <motion.div
            className="absolute inset-0 border-2 border-yellow-400 rounded-lg"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </Card>
    </motion.div>
  );
};

export const FormationManager: React.FC<FormationManagerProps> = ({
  formations,
  activeFormation,
  onSetFormation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    ...Array.from(new Set(formations.map((f) => f.category))),
  ];
  const filteredFormations = formations.filter((formation) => {
    if (selectedCategory === "All") return true;
    return formation.category === selectedCategory;
  });

  const unlockedFormations = filteredFormations.filter((f) => f.isUnlocked);
  const lockedFormations = filteredFormations.filter((f) => !f.isUnlocked);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Formation Manager</h2>
            <p className="text-gray-400 text-sm">
              Choose tactical formations to gain strategic advantages in battle
            </p>
          </div>

          {/* Active Formation Info */}
          {activeFormation && (
            <div className="text-right">
              <div className="text-sm text-gray-400">Active Formation</div>
              <div className="text-lg font-semibold text-yellow-400">
                {formations.find((f) => f.id === activeFormation)?.name ||
                  "Unknown"}
              </div>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  selectedCategory === category
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </Card>

      {/* Available Formations */}
      {unlockedFormations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Available Formations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedFormations.map((formation) => (
              <FormationCard
                key={formation.id}
                formation={formation}
                isActive={activeFormation === formation.id}
                onSelect={() => onSetFormation(formation.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Locked Formations */}
      {lockedFormations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-400 mb-4">
            Locked Formations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedFormations.map((formation) => (
              <div key={formation.id} className="relative">
                <FormationCard
                  formation={formation}
                  isActive={false}
                  onSelect={() => {}}
                />
                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🔒</div>
                    <div className="text-white font-semibold">Locked</div>
                    {formation.requirements.length > 0 && (
                      <div className="text-xs text-gray-300 mt-2 max-w-xs">
                        {formation.requirements[0].description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Formations */}
      {filteredFormations.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🔷</div>
          <h3 className="text-xl font-bold text-gray-300 mb-2">
            No Formations Found
          </h3>
          <p className="text-gray-500">
            {selectedCategory === "All"
              ? "No formations are available."
              : `No formations found in the ${selectedCategory} category.`}
          </p>
        </Card>
      )}

      {/* Formation Guide */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-4">Formation Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Position Roles */}
          <div>
            <h4 className="text-md font-semibold text-purple-400 mb-3">
              Position Roles
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span>🛡️</span>
                <span className="text-white">Tank:</span>
                <span className="text-gray-400">
                  High defense, protects allies
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span>⚔️</span>
                <span className="text-white">Damage:</span>
                <span className="text-gray-400">
                  High attack, focuses on eliminating enemies
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✨</span>
                <span className="text-white">Support:</span>
                <span className="text-gray-400">
                  Provides utility and assistance
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span>💚</span>
                <span className="text-white">Healer:</span>
                <span className="text-gray-400">
                  Restores health and removes debuffs
                </span>
              </div>
            </div>
          </div>

          {/* Formation Tips */}
          <div>
            <h4 className="text-md font-semibold text-purple-400 mb-3">
              Formation Tips
            </h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div>• Front row characters receive more attacks</div>
              <div>• Back row characters are safer but have limited range</div>
              <div>• Balanced teams perform well in most situations</div>
              <div>• Element synergy provides additional bonuses</div>
              <div>• Formation bonuses stack with equipment effects</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
