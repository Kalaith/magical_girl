import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../stores/gameStore";
import { BattleArena } from "../Combat/BattleArena";
import { TeamSetup } from "../Combat/TeamSetup";
import { CombatLog } from "../Combat/CombatLog";
import { FormationManager } from "../Combat/FormationManager";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import type { BattleType, CombatParticipant } from "../../types/combat";
import type { MagicalGirl } from "../../types/magicalGirl";

export const CombatView: React.FC = () => {
  const {
    combatSystem,
    magicalGirls,
    startBattle,
    setFormation,
    addNotification,
  } = useGameStore();

  const [selectedTab, setSelectedTab] = useState<
    "arena" | "setup" | "formations" | "history"
  >("arena");
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);
  const [battleType, setBattleType] = useState<BattleType>("Training");

  const availableGirls = magicalGirls.filter((girl) => girl.isUnlocked);

  const handleStartBattle = async () => {
    if (selectedTeam.length === 0) {
      addNotification({
        type: "warning",
        title: "No Team Selected",
        message: "Please select at least one magical girl for your team",
      });
      return;
    }

    const playerTeam = selectedTeam
      .map((id) => magicalGirls.find((girl) => girl.id === id))
      .filter((girl) => girl !== undefined);

    // Generate enemy team based on battle type
    const enemyTeam = generateEnemyTeam(battleType, playerTeam);

    try {
      const battleId = await startBattle(battleType, enemyTeam, playerTeam);
      setSelectedTab("arena");

      addNotification({
        type: "success",
        title: "Battle Started!",
        message: `${battleType} battle has begun!`,
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: "Battle Failed",
        message: "Unable to start battle. Please try again.",
      });
    }
  };

  const generateEnemyTeam = (type: BattleType, playerTeam: MagicalGirl[]) => {
    // Generate enemy team based on player team strength and battle type
    const enemyCount = Math.min(playerTeam.length, 3);
    const enemies = [];

    for (let i = 0; i < enemyCount; i++) {
      const playerGirl = playerTeam[i % playerTeam.length];
      const enemy = {
        ...playerGirl,
        id: `enemy_${i}_${Date.now()}`,
        name: `Dark ${playerGirl.name}`,
        stats: {
          ...playerGirl.stats,
          power: Math.floor(playerGirl.stats.power * 0.9),
          defense: Math.floor(playerGirl.stats.defense * 0.9),
          speed: Math.floor(playerGirl.stats.speed * 0.9),
          magic: Math.floor(playerGirl.stats.magic * 0.9),
        },
      };
      enemies.push(enemy);
    }

    return enemies;
  };

  const tabs = [
    { id: "arena" as const, name: "Battle Arena", icon: "⚔️" },
    { id: "setup" as const, name: "Team Setup", icon: "👥" },
    { id: "formations" as const, name: "Formations", icon: "🔷" },
    { id: "history" as const, name: "History", icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black bg-opacity-50 backdrop-blur-md border-b border-red-500 border-opacity-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">⚔️ Combat Arena</h1>
              <p className="text-red-200 text-sm">
                Engage in strategic turn-based battles!
              </p>
            </div>

            {/* Quick Battle Setup */}
            {!combatSystem.activeBattle && (
              <div className="flex items-center space-x-4">
                <select
                  value={battleType}
                  onChange={(e) => setBattleType(e.target.value as BattleType)}
                  className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600"
                >
                  <option value="Training">Training</option>
                  <option value="Mission">Mission</option>
                  <option value="Arena">Arena</option>
                  <option value="Boss">Boss Battle</option>
                </select>
                <Button
                  variant="magical"
                  onClick={handleStartBattle}
                  disabled={selectedTeam.length === 0}
                  className="px-6 py-2"
                >
                  Start Battle
                </Button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  selectedTab === tab.id
                    ? "bg-red-600 text-white shadow-lg"
                    : "bg-red-800 bg-opacity-50 text-red-200 hover:bg-red-700 hover:bg-opacity-70"
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {selectedTab === "arena" && (
            <motion.div
              key="arena"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {combatSystem.activeBattle ? (
                <BattleArena battle={combatSystem.activeBattle} />
              ) : (
                <Card className="text-center py-12">
                  <div className="text-6xl mb-4">⚔️</div>
                  <h3 className="text-xl font-bold text-gray-300 mb-2">
                    No Active Battle
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Set up your team and start a battle to begin combat!
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setSelectedTab("setup")}
                    className="px-6 py-3"
                  >
                    Setup Team
                  </Button>
                </Card>
              )}
            </motion.div>
          )}

          {selectedTab === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TeamSetup
                availableGirls={availableGirls}
                selectedTeam={selectedTeam}
                onTeamChange={setSelectedTeam}
                battleType={battleType}
                onBattleTypeChange={setBattleType}
                onStartBattle={handleStartBattle}
              />
            </motion.div>
          )}

          {selectedTab === "formations" && (
            <motion.div
              key="formations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FormationManager
                formations={combatSystem.formations}
                activeFormation={combatSystem.activeFormation}
                onSetFormation={setFormation}
              />
            </motion.div>
          )}

          {selectedTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CombatLog combatLog={combatSystem.activeBattle?.combatLog || []} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Battle Status Bar */}
      {combatSystem.activeBattle && (
        <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-80 backdrop-blur-md border-t border-red-500 border-opacity-30 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-white">
                <span className="text-red-400 font-semibold">Turn:</span>{" "}
                {combatSystem.activeBattle.currentTurn}
              </div>
              <div className="text-white">
                <span className="text-purple-400 font-semibold">Phase:</span>{" "}
                {combatSystem.activeBattle.turnOrder.phase}
              </div>
              <div className="text-white">
                <span className="text-yellow-400 font-semibold">Status:</span>{" "}
                {combatSystem.activeBattle.status}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                onClick={() => {
                  // TODO: Implement pause functionality
                }}
                size="sm"
              >
                Pause
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  if (combatSystem.activeBattle) {
                    // TODO: Implement surrender functionality
                  }
                }}
                size="sm"
              >
                Surrender
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
