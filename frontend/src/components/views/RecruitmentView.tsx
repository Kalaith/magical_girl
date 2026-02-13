import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../../stores/gameStore";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { initialMagicalGirls } from "../../data/magicalGirls";
import { gameConfig } from "../../config/gameConfig";
import type { MagicalGirl } from "../../types/magicalGirl";

const rarityStyles: Record<MagicalGirl["rarity"], string> = {
  Legendary: "bg-yellow-100 text-yellow-800",
  Epic: "bg-purple-100 text-purple-800",
  Rare: "bg-blue-100 text-blue-800",
  Uncommon: "bg-green-100 text-green-800",
  Common: "bg-gray-100 text-gray-800",
  Mythical: "bg-pink-100 text-pink-800",
};

export const RecruitmentView: React.FC = () => {
  const { resources, addNotification, recruitMagicalGirl, magicalGirls } = useGameStore();
  const [isRecruiting, setIsRecruiting] = useState(false);
  const recruitmentTimeoutRef = useRef<number | null>(null);

  // Memoize calculations to prevent infinite re-renders
  const recruitmentStats = useMemo(() => {
    const ownedGirlIds = magicalGirls.map((g) => g.id);
    const availableCount = initialMagicalGirls.filter(
      (girl) => !ownedGirlIds.includes(girl.id)
    ).length;
    const recentRecruits = magicalGirls.slice(-3);
    const recruitedCount = magicalGirls.length;

    return {
      availableCount,
      recentRecruits,
      recruitedCount,
    };
  }, [magicalGirls]);

  const handleRecruit = async () => {
    if (isRecruiting) return;

    setIsRecruiting(true);

    if (recruitmentTimeoutRef.current) {
      clearTimeout(recruitmentTimeoutRef.current);
    }

    recruitmentTimeoutRef.current = window.setTimeout(async () => {
      const success = await recruitMagicalGirl();

      if (success) {
        addNotification({
          type: "success",
          title: "Recruitment Successful!",
          message: "A new magical girl has joined your team!",
        });
      } else {
        addNotification({
          type: "error",
          title: "Recruitment Failed",
          message: "Either you don't have enough Friendship Points or no new girls are available.",
        });
      }

      setIsRecruiting(false);
      recruitmentTimeoutRef.current = null;
    }, gameConfig.RECRUITMENT.RECRUITMENT_DELAY_MS);
  };

  useEffect(() => () => {
    if (recruitmentTimeoutRef.current) {
      clearTimeout(recruitmentTimeoutRef.current);
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-magical-primary mb-2"
        >
          Recruitment Center
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600"
        >
          Summon powerful magical girls to join your team
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recruitment Panel */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 text-center">Basic Recruitment</h3>

          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-magical-primary mb-1">
                {resources.friendshipPoints}
              </div>
              <div className="text-sm text-gray-600">Friendship Points</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Recruitment Cost</h4>
              <div className="flex justify-between items-center">
                <span>Friendship Points</span>
                <span className="font-bold">{gameConfig.RECRUITMENT.BASIC_COST}</span>
              </div>
            </div>

            <Button
              onClick={handleRecruit}
              disabled={isRecruiting || resources.friendshipPoints < gameConfig.RECRUITMENT.BASIC_COST || recruitmentStats.availableCount === 0}
              className="w-full"
              variant={resources.friendshipPoints >= gameConfig.RECRUITMENT.BASIC_COST && recruitmentStats.availableCount > 0 ? "primary" : "secondary"}
            >
              {isRecruiting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Recruiting...
                </div>
              ) : recruitmentStats.availableCount === 0 ? (
                "All Girls Recruited"
              ) : (
                `Recruit Magical Girl (${gameConfig.RECRUITMENT.BASIC_COST} FP)`
              )}
            </Button>

            {recruitmentStats.availableCount > 0 && (
              <p className="text-sm text-gray-600 text-center">
                {recruitmentStats.availableCount} magical girl{recruitmentStats.availableCount !== 1 ? 's' : ''} available to recruit
              </p>
            )}
          </div>
        </Card>

        {/* Stats Panel */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 text-center">Recruitment Stats</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-magical-primary">
                  {recruitmentStats.recruitedCount}
                </div>
                <div className="text-sm text-gray-600">Recruited</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-magical-secondary">
                  {recruitmentStats.availableCount}
                </div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Recent Recruits</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {recruitmentStats.recentRecruits.map((girl: MagicalGirl) => (
                  <div key={girl.id} className="flex justify-between items-center text-sm">
                    <span>{girl.name}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      rarityStyles[girl.rarity] ?? rarityStyles.Common
                    }`}>
                      {girl.rarity}
                    </span>
                  </div>
                ))}
                {recruitmentStats.recruitedCount === 0 && (
                  <p className="text-gray-500 text-sm">No recruits yet</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Info Panel */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-3">How Recruitment Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Basic Recruitment</h4>
            <ul className="space-y-1 text-gray-600">
              <li>Costs 100 Friendship Points</li>
              <li>Random magical girl from available pool</li>
              <li>Cannot recruit duplicates</li>
              <li>Instant recruitment</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Getting Friendship Points</h4>
            <ul className="space-y-1 text-gray-600">
              <li>Complete training sessions</li>
              <li>Finish missions</li>
              <li>Level up your magical girls</li>
              <li>Daily login bonuses</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
