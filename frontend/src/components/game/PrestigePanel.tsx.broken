import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../stores/gameStore";
import type {
  CharacterPrestige,
  PrestigePerk,
  PrestigeMilestone,
  PrestigeGoal,
  PrestigeSimulation,
} from "../../types";

interface PrestigeTierCardProps {
  tier: "prestige" | "rebirth" | "transcendence";
  character: CharacterPrestige;
  onPrestige: () => void;
  canPrestige: boolean;
  costs: {
    currency: string;
    amount: number;
    type: string;
  }[];
}

const PrestigeTierCard: React.FC<PrestigeTierCardProps> = ({
  tier,
  character,
  onPrestige,
  canPrestige,
  costs,
}) => {
  const tierData = {
    prestige: {
      title: "Prestige",
      color: "from-blue-500 to-purple-600",
      icon: "⭐",
      description: "Reset progress to gain permanent bonuses",
    },
    rebirth: {
      title: "Rebirth",
      color: "from-purple-500 to-pink-600",
      icon: "🔮",
      description: "Advanced reset with enhanced rewards",
    },
    transcendence: {
      title: "Transcendence",
      color: "from-pink-500 to-red-600",
      icon: "✨",
      description: "Ultimate evolution beyond mortal limits",
    },
  };

  const data = tierData[tier];
  const currentLevel = character[`${tier}Level`] || 0;

  return (
    <motion.div
      className={`p-6 rounded-xl bg-gradient-to-br ${data.color} bg-opacity-20 border border-opacity-30 border-white`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-center mb-4">
        <div className="text-4xl mb-2">{data.icon}</div>
        <h3 className="text-xl font-bold text-white">{data.title}</h3>
        <p className="text-sm text-gray-300">{data.description}</p>
      </div>

      <div className="space-y-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            Level {currentLevel}
          </div>
          {currentLevel > 0 && (
            <div className="text-sm text-gray-300">
              Total {data.title}s:{" "}
              {character[
                `total${data.title.charAt(0).toUpperCase() + data.title.slice(1)}s`
              ] || 0}
            </div>
          )}
        </div>

        {costs && (
          <div className="bg-gray-800 bg-opacity-50 p-3 rounded">
            <h4 className="font-semibold text-gray-300 mb-2">Requirements:</h4>
            <div className="space-y-1 text-sm">
              {Object.entries(costs).map(([resource, amount]) => (
                <div key={resource} className="flex justify-between">
                  <span className="text-gray-400 capitalize">{resource}:</span>
                  <span className="text-white">{amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onPrestige}
          disabled={!canPrestige}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
            canPrestige
              ? `bg-gradient-to-r ${data.color} hover:scale-105 text-white`
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          {canPrestige ? `${data.title} Now!` : `Cannot ${data.title} Yet`}
        </button>
      </div>
    </motion.div>
  );
};

interface PrestigePerkCardProps {
  perk: PrestigePerk;
  isUnlocked: boolean;
  canUnlock: boolean;
  onUnlock: (perkId: string) => void;
}

const PrestigePerkCard: React.FC<PrestigePerkCardProps> = ({
  perk,
  isUnlocked,
  canUnlock,
  onUnlock,
}) => {
  const rarityColors = {
    common: "border-gray-500 bg-gray-800",
    uncommon: "border-green-500 bg-green-900 bg-opacity-20",
    rare: "border-blue-500 bg-blue-900 bg-opacity-20",
    epic: "border-purple-500 bg-purple-900 bg-opacity-20",
    legendary: "border-yellow-500 bg-yellow-900 bg-opacity-20",
  };

  return (
    <motion.div
      className={`p-4 rounded-lg border-2 ${rarityColors[perk.rarity]} ${
        isUnlocked ? "ring-2 ring-green-400" : ""
      }`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-white">{perk.name}</h4>
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            perk.rarity === "common"
              ? "bg-gray-600 text-white"
              : perk.rarity === "uncommon"
                ? "bg-green-600 text-white"
                : perk.rarity === "rare"
                  ? "bg-blue-600 text-white"
                  : perk.rarity === "epic"
                    ? "bg-purple-600 text-white"
                    : "bg-yellow-600 text-black"
          }`}
        >
          {perk.rarity.toUpperCase()}
        </span>
      </div>

      <p className="text-gray-300 text-sm mb-3">{perk.description}</p>

      {perk.effects && perk.effects.length > 0 && (
        <div className="mb-3">
          <h5 className="text-xs font-semibold text-gray-400 mb-1">Effects:</h5>
          <ul className="space-y-1">
            {perk.effects.map((effect, index) => (
              <li key={index} className="text-xs text-green-400">
                • {effect.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-sm">
          <span className="text-gray-400">Cost: </span>
          <span className="text-yellow-400">{perk.cost} PP</span>
        </div>

        {!isUnlocked && (
          <button
            onClick={() => onUnlock(perk.id)}
            disabled={!canUnlock}
            className={`px-3 py-1 rounded text-sm font-semibold ${
              canUnlock
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            Unlock
          </button>
        )}

        {isUnlocked && (
          <span className="text-green-400 text-sm font-semibold">
            ✓ Unlocked
          </span>
        )}
      </div>
    </motion.div>
  );
};

interface MilestoneProgressProps {
  milestone: PrestigeMilestone;
  currentProgress: number;
}

const MilestoneProgress: React.FC<MilestoneProgressProps> = ({
  milestone,
  currentProgress,
}) => {
  const progress = Math.min(currentProgress / milestone.requirement, 1);
  const isCompleted = progress >= 1;

  return (
    <motion.div
      className={`p-4 rounded-lg border ${
        isCompleted
          ? "border-green-500 bg-green-900 bg-opacity-20"
          : "border-gray-600 bg-gray-800"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-white">{milestone.name}</h4>
        {isCompleted && <span className="text-green-400">✓</span>}
      </div>

      <p className="text-gray-300 text-sm mb-3">{milestone.description}</p>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Progress</span>
          <span className="text-white">
            {currentProgress.toLocaleString()} /{" "}
            {milestone.requirement.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${isCompleted ? "bg-green-500" : "bg-blue-500"}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {milestone.rewards && milestone.rewards.length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-gray-400 mb-1">Rewards:</h5>
          <ul className="space-y-1">
            {milestone.rewards.map((reward, index) => (
              <li key={index} className="text-xs text-yellow-400">
                • {reward.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export const PrestigePanel: React.FC = () => {
  // Temporary mock data until store methods are implemented
  const prestigeState = {
    characters: [
      {
        characterId: "1",
        prestigeLevel: 0,
        rebirthLevel: 0,
        transcendenceLevel: 0,
        prestigePoints: 100,
        eternityShards: 0,
        transcendentEssence: 0,
        permanentBonuses: [],
        unlockedPerks: [],
        totalPrestiges: 0,
        totalRebirths: 0,
        totalTranscendences: 0,
      },
    ],
    availablePerks: [],
    activeMilestones: [],
  };
  const availablePerks: PrestigePerk[] = [];
  const activeMilestones: PrestigeMilestone[] = [];

  const canPrestige = (id: string) => false;
  const canRebirth = (id: string) => false;
  const canTranscend = (id: string) => false;
  const prestigeCharacter = (id: string) => console.log("prestige", id);
  const rebirthCharacter = (id: string) => console.log("rebirth", id);
  const transcendCharacter = (id: string) => console.log("transcend", id);
  const unlockPrestigePerk = (id: string) => console.log("unlock perk", id);
  const simulatePrestige = (id: string, type: string) => ({
    prestigePointsGained: 100,
    timeToBreakeven: 60,
    bonusesAfterPrestige: [],
    recommendation: "wait" as const,
  });
  const generatePrestigeStrategy = () => console.log("generate strategy");

  const [activeTab, setActiveTab] = useState<
    "overview" | "perks" | "milestones" | "strategy"
  >("overview");
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("");
  const [simulation, setSimulation] = useState<PrestigeSimulation | null>(null);
  const [showSimulation, setShowSimulation] = useState(false);

  const selectedCharacter =
    prestigeState.characters.find(
      (c) => c.characterId === selectedCharacterId,
    ) || prestigeState.characters[0];

  const handlePrestige = useCallback(() => {
    if (selectedCharacter && canPrestige(selectedCharacter.characterId)) {
      prestigeCharacter(selectedCharacter.characterId);
    }
  }, [selectedCharacter, canPrestige, prestigeCharacter]);

  const handleRebirth = useCallback(() => {
    if (selectedCharacter && canRebirth(selectedCharacter.characterId)) {
      rebirthCharacter(selectedCharacter.characterId);
    }
  }, [selectedCharacter, canRebirth, rebirthCharacter]);

  const handleTranscend = useCallback(() => {
    if (selectedCharacter && canTranscend(selectedCharacter.characterId)) {
      transcendCharacter(selectedCharacter.characterId);
    }
  }, [selectedCharacter, canTranscend, transcendCharacter]);

  const handleSimulate = useCallback(() => {
    if (selectedCharacter) {
      const result = simulatePrestige(
        selectedCharacter.characterId,
        "prestige",
      );
      setSimulation(result);
      setShowSimulation(true);
    }
  }, [selectedCharacter, simulatePrestige]);

  const availablePerks = prestigeState.availablePerks || [];
  const activeMilestones = prestigeState.activeMilestones || [];

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">
            Prestige System
          </h1>

          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
              {[
                { id: "overview", label: "Overview" },
                { id: "perks", label: "Perks" },
                { id: "milestones", label: "Milestones" },
                { id: "strategy", label: "Strategy" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as string)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={selectedCharacterId}
                onChange={(e) => setSelectedCharacterId(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
              >
                {prestigeState.characters.map((character) => (
                  <option
                    key={character.characterId}
                    value={character.characterId}
                  >
                    Character {character.characterId}
                  </option>
                ))}
              </select>

              <button
                onClick={handleSimulate}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold"
              >
                Simulate
              </button>
            </div>
          </div>
        </div>

        {selectedCharacter && (
          <>
            {activeTab === "overview" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <PrestigeTierCard
                    tier="prestige"
                    character={selectedCharacter}
                    onPrestige={handlePrestige}
                    canPrestige={canPrestige(selectedCharacter.characterId)}
                    costs={{ level: 100, experience: 50000 }}
                  />
                  <PrestigeTierCard
                    tier="rebirth"
                    character={selectedCharacter}
                    onPrestige={handleRebirth}
                    canPrestige={canRebirth(selectedCharacter.characterId)}
                    costs={{ prestigeLevel: 10, prestigePoints: 1000 }}
                  />
                  <PrestigeTierCard
                    tier="transcendence"
                    character={selectedCharacter}
                    onPrestige={handleTranscend}
                    canPrestige={canTranscend(selectedCharacter.characterId)}
                    costs={{ rebirthLevel: 5, eternityShards: 100 }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Current Bonuses
                    </h3>
                    <div className="space-y-3">
                      {selectedCharacter.permanentBonuses.map(
                        (bonus, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-gray-400">{bonus.type}:</span>
                            <span className="text-green-400">
                              +{(bonus.value * 100).toFixed(1)}%
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Currencies
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Prestige Points:</span>
                        <span className="text-blue-400">
                          {selectedCharacter.prestigePoints.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Eternity Shards:</span>
                        <span className="text-purple-400">
                          {selectedCharacter.eternityShards.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          Transcendent Essence:
                        </span>
                        <span className="text-yellow-400">
                          {selectedCharacter.transcendentEssence.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "perks" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Prestige Perks
                  </h2>
                  <p className="text-gray-400">
                    Unlock permanent upgrades using Prestige Points
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availablePerks.map((perk) => (
                    <PrestigePerkCard
                      key={perk.id}
                      perk={perk}
                      isUnlocked={selectedCharacter.unlockedPerks.includes(
                        perk.id,
                      )}
                      canUnlock={selectedCharacter.prestigePoints >= perk.cost}
                      onUnlock={unlockPrestigePerk}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "milestones" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Prestige Milestones
                  </h2>
                  <p className="text-gray-400">
                    Long-term goals with valuable rewards
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeMilestones.map((milestone) => (
                    <MilestoneProgress
                      key={milestone.id}
                      milestone={milestone}
                      currentProgress={milestone.currentProgress || 0}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "strategy" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Prestige Strategy
                  </h2>
                  <p className="text-gray-400">
                    Optimize your prestige timing and perk selection
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-white mb-4">
                      Recommended Strategy
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-900 bg-opacity-30 rounded">
                        <h4 className="font-semibold text-blue-400">
                          Next Action
                        </h4>
                        <p className="text-gray-300">
                          Focus on reaching level 100 for your first prestige
                        </p>
                      </div>
                      <div className="p-4 bg-green-900 bg-opacity-30 rounded">
                        <h4 className="font-semibold text-green-400">
                          Optimal Timing
                        </h4>
                        <p className="text-gray-300">
                          Prestige when progress slows significantly
                        </p>
                      </div>
                      <div className="p-4 bg-purple-900 bg-opacity-30 rounded">
                        <h4 className="font-semibold text-purple-400">
                          Priority Perks
                        </h4>
                        <p className="text-gray-300">
                          Unlock experience multipliers first
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-white mb-4">
                      Statistics
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Prestiges:</span>
                        <span className="text-white">
                          {selectedCharacter.totalPrestiges}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Rebirths:</span>
                        <span className="text-white">
                          {selectedCharacter.totalRebirths}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          Total Transcendences:
                        </span>
                        <span className="text-white">
                          {selectedCharacter.totalTranscendences}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          Efficiency Rating:
                        </span>
                        <span className="text-green-400">85%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Simulation Modal */}
        <AnimatePresence>
          {showSimulation && simulation && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSimulation(false)}
            >
              <motion.div
                className="bg-gray-800 p-6 rounded-lg max-w-2xl max-h-96 overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Prestige Simulation
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-400">
                        Prestige Points Gained
                      </h4>
                      <div className="text-2xl font-bold text-blue-400">
                        +{simulation.prestigePointsGained.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-400">
                        Time to Breakeven
                      </h4>
                      <div className="text-2xl font-bold text-green-400">
                        {simulation.timeToBreakeven}h
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-400 mb-2">
                      Bonuses After Prestige
                    </h4>
                    <ul className="space-y-1">
                      {simulation.bonusesAfterPrestige.map((bonus, index) => (
                        <li key={index} className="text-sm text-gray-300">
                          • {bonus.type}: +{(bonus.value * 100).toFixed(1)}%
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-400">
                      Recommendation
                    </h4>
                    <p
                      className={`text-lg font-semibold ${
                        simulation.recommendation === "prestige_now"
                          ? "text-green-400"
                          : simulation.recommendation === "wait"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {simulation.recommendation === "prestige_now"
                        ? "Prestige Now!"
                        : simulation.recommendation === "wait"
                          ? "Wait Longer"
                          : "Not Recommended"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowSimulation(false)}
                  className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
