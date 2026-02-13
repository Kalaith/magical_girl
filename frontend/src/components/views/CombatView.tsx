import React from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../../stores/gameStore";
import BattleArena from "../Combat/BattleArena";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

export const CombatView: React.FC = () => {
  const { combatSystem, startMission } = useGameStore();
  const { activeBattle, battles } = combatSystem;

  // If there's an active battle, show the battle arena
  if (activeBattle) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-magical-primary mb-2"
          >
            Combat Arena
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600"
          >
            Battle fiercely to protect the innocent!
          </motion.p>
        </div>

        <BattleArena />
      </div>
    );
  }

  // If no active battle, show combat history and options
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-magical-primary mb-2"
        >
          Combat Arena
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600"
        >
          Engage in epic battles and hone your skills
        </motion.p>
      </div>

      {/* Quick Battle Options */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4 text-center">Quick Battle</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => startMission("combat-1", [])}
            className="p-4 h-auto flex flex-col items-center"
            variant="primary"
          >
            <span className="text-lg font-bold">Training Battle</span>
            <span className="text-sm text-gray-600 mt-1">
              Practice your skills
            </span>
          </Button>

          <Button
            onClick={() => startMission("combat-1", [])}
            className="p-4 h-auto flex flex-col items-center"
            variant="secondary"
          >
            <span className="text-lg font-bold">Story Mission</span>
            <span className="text-sm text-gray-600 mt-1">
              Follow the main quest
            </span>
          </Button>

          <Button
            onClick={() => startMission("combat-1", [])}
            className="p-4 h-auto flex flex-col items-center"
            variant="secondary"
          >
            <span className="text-lg font-bold">Challenge Mode</span>
            <span className="text-sm text-gray-600 mt-1">Test your limits</span>
          </Button>
        </div>
      </Card>

      {/* Recent Battles */}
      {battles.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Recent Battles</h3>
          <div className="space-y-3">
            {battles.slice(0, 5).map((battle) => (
              <div
                key={battle.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium">{battle.name}</div>
                  <div className="text-sm text-gray-600">
                    {battle.type} • {battle.status} • {battle.currentTurn} turns
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${
                      battle.winner === "player"
                        ? "text-green-600"
                        : battle.winner === "enemy"
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {battle.winner
                      ? battle.winner.toUpperCase()
                      : "IN PROGRESS"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(battle.startTime).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Combat Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-magical-primary">
            {battles.filter((b) => b.winner === "player").length}
          </div>
          <div className="text-sm text-gray-600">Victories</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-magical-secondary">
            {battles.length}
          </div>
          <div className="text-sm text-gray-600">Total Battles</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-magical-accent">
            {battles.length > 0
              ? Math.round(
                  (battles.filter((b) => b.winner === "player").length /
                    battles.length) *
                    100,
                )
              : 0}
            %
          </div>
          <div className="text-sm text-gray-600">Win Rate</div>
        </Card>
      </div>
    </div>
  );
};
