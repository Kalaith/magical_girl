// Achievements main view - Clean Architecture with component composition
import React from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Award, Target } from "lucide-react";
import { Card } from "../ui/Card";
import { AchievementCard } from "../Achievement/AchievementCard";
import { useAchievements } from "../../hooks/useAchievements";

export const AchievementsView: React.FC = () => {
  const {
    achievements,
    unlockedCount,
    totalPoints,
    achievementsByStatus,
    getNextAchievement,
    formatProgress,
    getProgressPercentage,
  } = useAchievements();

  const nextAchievement = getNextAchievement();

  const handleAchievementClick = (achievementId: string) => {
    // TODO: Implement achievement modal or details view
    console.log("Achievement clicked:", achievementId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient mb-2">
          Achievement Gallery
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
          Track your progress, unlock rewards, and showcase your accomplishments
          in your magical journey.
        </p>

        {/* Quick Stats */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 text-xs sm:text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">{totalPoints} Points</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4 text-purple-500" />
            <span className="font-medium">
              {unlockedCount} Unlocked
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4 text-blue-500" />
            <span className="font-medium">
              {achievements.length} Total
            </span>
          </div>
        </div>
      </div>

      {/* Active Achievements Section */}
      <div className="px-2 sm:px-0">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Star className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg sm:text-xl font-semibold">Active Progress</h2>
        </div>
        <Card className="p-4">
          {nextAchievement ? (
            <div className="text-center">
              <h3 className="font-semibold mb-2">Next Achievement</h3>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">{nextAchievement.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{nextAchievement.name}</div>
                  <div className="text-sm text-gray-600">
                    {formatProgress(nextAchievement.progress, nextAchievement.maxProgress)}
                    ({Math.round(getProgressPercentage(nextAchievement.progress, nextAchievement.maxProgress))}%)
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No achievements in progress
            </div>
          )}
        </Card>
      </div>

      {/* Achievement Grid */}
      <div className="px-2 sm:px-0">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">All Achievements</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onClick={() => handleAchievementClick(achievement.id)}
            />
          ))}
        </div>
      </div>

      {/* Achievement Summary */}
      <Card className="p-4 sm:p-6 mx-2 sm:mx-0">
        <div className="text-center">
          <h3 className="text-base sm:text-lg font-semibold mb-3">
            Achievement Summary
          </h3>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {achievementsByStatus.unlocked.length}
              </div>
              <div className="text-green-700">Unlocked</div>
            </div>
            <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">
                {achievementsByStatus.inProgress.length}
              </div>
              <div className="text-blue-700">In Progress</div>
            </div>
            <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-gray-600">
                {achievementsByStatus.locked.length}
              </div>
              <div className="text-gray-700">Locked</div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
