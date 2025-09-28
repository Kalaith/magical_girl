import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../../stores/gameStore";
import { Card } from "../ui/Card";
import type { Rarity } from "../../types/magicalGirl";

export const RecruitmentStats: React.FC = () => {
  const { recruitmentSystem, getPlayerStatistics } = useGameStore();

  const stats = useMemo(() => {
    const history = recruitmentSystem.summonHistory;

    if (history.length === 0) {
      return {
        totalPulls: 0,
        totalSessions: 0,
        averagePulls: 0,
        rarityStats: {} as Record<Rarity, number>,
        bannerStats: {} as Record<string, number>,
        newCharacters: 0,
        duplicates: 0,
        pityActivations: 0,
        featuredPulls: 0,
        guaranteedPulls: 0,
        luckiestPull: null,
        unluckiestStreak: 0,
        averageCostPerCharacter: 0,
        totalSpent: {
          friendshipPoints: 0,
          premiumGems: 0,
          summonTickets: 0,
          rareTickets: 0,
          legendaryTickets: 0,
          dreamshards: 0,
          eventTokens: 0,
        },
      };
    }

    const totalPulls = history.reduce(
      (sum, record) => sum + record.results.length,
      0,
    );
    const totalSessions = history.length;
    const averagePulls = totalPulls / totalSessions;

    // Rarity statistics
    const rarityStats = history.reduce(
      (stats, record) => {
        record.results.forEach((result) => {
          stats[result.rarity] = (stats[result.rarity] || 0) + 1;
        });
        return stats;
      },
      {} as Record<Rarity, number>,
    );

    // Banner statistics
    const bannerStats = history.reduce(
      (stats, record) => {
        if (!stats[record.bannerId]) {
          stats[record.bannerId] = {
            pullCount: 0,
            charactersObtained: [],
            pityActivations: 0,
            rarityBreakdown: {} as Record<Rarity, number>,
          };
        }

        stats[record.bannerId].pullCount += record.results.length;

        if (record.wasGuaranteed) {
          stats[record.bannerId].pityActivations++;
        }

        record.results.forEach((result) => {
          if (
            !stats[record.bannerId].charactersObtained.includes(
              result.characterId,
            )
          ) {
            stats[record.bannerId].charactersObtained.push(result.characterId);
          }

          const rarity = result.rarity;
          stats[record.bannerId].rarityBreakdown[rarity] =
            (stats[record.bannerId].rarityBreakdown[rarity] || 0) + 1;
        });

        return stats;
      },
      {} as Record<string, number>,
    );

    // Character acquisition stats
    const allResults = history.flatMap((record) => record.results);
    const newCharacters = allResults.filter((result) => result.isNew).length;
    const duplicates = allResults.filter((result) => result.isDuplicate).length;
    const pityActivations = history.filter(
      (record) => record.wasGuaranteed,
    ).length;
    const featuredPulls = allResults.filter(
      (result) => result.wasFeatured,
    ).length;
    const guaranteedPulls = allResults.filter(
      (result) => result.wasGuaranteed,
    ).length;

    // Find luckiest pull (highest rarity in fewest pulls)
    let luckiestPull = null;
    let bestRarityValue = 0;

    history.forEach((record, sessionIndex) => {
      record.results.forEach((result, pullIndex) => {
        const rarityValue =
          {
            Common: 1,
            Uncommon: 2,
            Rare: 3,
            Epic: 4,
            Legendary: 5,
            Mythical: 6,
          }[result.rarity] || 1;

        if (rarityValue > bestRarityValue) {
          bestRarityValue = rarityValue;
          luckiestPull = {
            character: result.character.name,
            rarity: result.rarity,
            pullNumber: pullIndex + 1,
            sessionNumber: sessionIndex + 1,
            timestamp: record.timestamp,
          };
        }
      });
    });

    // Calculate unluckiest streak (most pulls without Epic+)
    let unluckiestStreak = 0;
    let currentStreak = 0;

    allResults.forEach((result) => {
      if (["Epic", "Legendary", "Mythical"].includes(result.rarity)) {
        currentStreak = 0;
      } else {
        currentStreak++;
        unluckiestStreak = Math.max(unluckiestStreak, currentStreak);
      }
    });

    // Calculate spending (simplified - would need actual cost tracking)
    const totalSpent = {
      friendshipPoints: history.length * 300, // Estimated
      premiumGems: 0,
      summonTickets: 0,
      rareTickets: 0,
      legendaryTickets: 0,
      dreamshards: 0,
      eventTokens: 0,
    };

    const averageCostPerCharacter =
      newCharacters > 0 ? totalSpent.friendshipPoints / newCharacters : 0;

    return {
      totalPulls,
      totalSessions,
      averagePulls,
      rarityStats,
      bannerStats,
      newCharacters,
      duplicates,
      pityActivations,
      featuredPulls,
      guaranteedPulls,
      luckiestPull,
      unluckiestStreak,
      averageCostPerCharacter,
      totalSpent,
    };
  }, [recruitmentSystem.summonHistory]);

  const getRarityColor = (rarity: Rarity): string => {
    switch (rarity) {
      case "Mythical":
        return "text-red-400";
      case "Legendary":
        return "text-yellow-400";
      case "Epic":
        return "text-purple-400";
      case "Rare":
        return "text-blue-400";
      case "Uncommon":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const getRarityPercentage = (rarity: Rarity): number => {
    const total = Object.values(stats.rarityStats).reduce(
      (sum, count) => sum + count,
      0,
    );
    return total > 0 ? ((stats.rarityStats[rarity] || 0) / total) * 100 : 0;
  };

  if (stats.totalPulls === 0) {
    return (
      <Card className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-bold text-gray-300 mb-2">
          No Statistics Yet
        </h3>
        <p className="text-gray-500">
          Start summoning to see your recruitment statistics!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-white mb-6">
          📊 Recruitment Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {stats.totalPulls.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Pulls</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {stats.totalSessions.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {stats.newCharacters.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">New Characters</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">
              {stats.duplicates.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Duplicates</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {stats.featuredPulls.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Featured Pulls</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {stats.pityActivations.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Pity Used</div>
          </div>
        </div>
      </Card>

      {/* Rarity Distribution */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-white mb-6">
          🎲 Rarity Distribution
        </h3>
        <div className="space-y-4">
          {(
            [
              "Mythical",
              "Legendary",
              "Epic",
              "Rare",
              "Uncommon",
              "Common",
            ] as Rarity[]
          ).map((rarity) => {
            const count = stats.rarityStats[rarity] || 0;
            const percentage = getRarityPercentage(rarity);

            return (
              <div key={rarity} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold ${getRarityColor(rarity)}`}>
                      {rarity}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({count} pulls)
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      rarity === "Mythical"
                        ? "bg-red-500"
                        : rarity === "Legendary"
                          ? "bg-yellow-500"
                          : rarity === "Epic"
                            ? "bg-purple-500"
                            : rarity === "Rare"
                              ? "bg-blue-500"
                              : rarity === "Uncommon"
                                ? "bg-green-500"
                                : "bg-gray-500"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.1 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Banner Performance */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-white mb-6">
          🎭 Banner Performance
        </h3>
        {Object.keys(stats.bannerStats).length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            No banner data available
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(stats.bannerStats).map(([bannerId, bannerData]) => (
              <div
                key={bannerId}
                className="p-4 bg-gray-800 bg-opacity-50 rounded-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-white">
                      {bannerId
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </h4>
                    <div className="text-sm text-gray-400">
                      {bannerData.pullCount} pulls •{" "}
                      {bannerData.charactersObtained.length} characters
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-orange-400">
                      {bannerData.pityActivations} pity activations
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {(
                    [
                      "Mythical",
                      "Legendary",
                      "Epic",
                      "Rare",
                      "Uncommon",
                      "Common",
                    ] as Rarity[]
                  ).map((rarity) => {
                    const count = bannerData.rarityBreakdown[rarity] || 0;
                    if (count === 0) return null;

                    return (
                      <div key={rarity} className="text-center">
                        <div
                          className={`text-sm font-bold ${getRarityColor(rarity)}`}
                        >
                          {count}
                        </div>
                        <div className="text-xs text-gray-500">{rarity}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Notable Records */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Luckiest Pull */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            🍀 Luckiest Pull
          </h3>
          {stats.luckiestPull ? (
            <div className="space-y-2">
              <div
                className={`text-lg font-bold ${getRarityColor(stats.luckiestPull.rarity as Rarity)}`}
              >
                {stats.luckiestPull.character}
              </div>
              <div className="text-sm text-gray-400">
                {stats.luckiestPull.rarity} • Pull #
                {stats.luckiestPull.pullNumber}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(stats.luckiestPull.timestamp).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <p className="text-gray-400">No notable pulls yet</p>
          )}
        </Card>

        {/* Unlucky Streak */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            😅 Longest Dry Streak
          </h3>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-red-400">
              {stats.unluckiestStreak}
            </div>
            <div className="text-sm text-gray-400">
              Pulls without Epic or higher
            </div>
            {stats.unluckiestStreak > 50 && (
              <div className="text-xs text-yellow-400">
                Hang in there! Your luck will turn around! 🍀
              </div>
            )}
          </div>
        </Card>

        {/* Average Efficiency */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">⚡ Efficiency</h3>
          <div className="space-y-3">
            <div>
              <div className="text-lg font-bold text-blue-400">
                {stats.averagePulls.toFixed(1)}
              </div>
              <div className="text-sm text-gray-400">
                Average pulls per session
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">
                {stats.averageCostPerCharacter.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                Avg cost per new character
              </div>
            </div>
          </div>
        </Card>

        {/* Spending Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            💰 Total Spending
          </h3>
          <div className="space-y-2">
            {Object.entries(stats.totalSpent).map(([currency, amount]) => {
              if (amount === 0) return null;

              return (
                <div
                  key={currency}
                  className="flex justify-between items-center"
                >
                  <span className="text-sm text-gray-400 capitalize">
                    {currency.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {amount.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
