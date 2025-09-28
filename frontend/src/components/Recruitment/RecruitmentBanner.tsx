import React from "react";
import { motion } from "framer-motion";
import type { RecruitmentBanner, BannerType } from "../../types/recruitment";
import { useGameStore } from "../../stores/gameStore";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface RecruitmentBannerProps {
  banner: RecruitmentBanner;
  onSummon: (bannerId: string, count: number) => void;
  className?: string;
}

const getBannerTypeColor = (type: BannerType): string => {
  switch (type) {
    case "Standard":
      return "from-blue-500 to-blue-700";
    case "Limited":
      return "from-purple-500 to-pink-600";
    case "Event":
      return "from-green-500 to-emerald-600";
    case "Newcomer":
      return "from-cyan-500 to-blue-500";
    case "Seasonal":
      return "from-orange-500 to-red-500";
    case "Collaboration":
      return "from-indigo-500 to-purple-600";
    case "Rerun":
      return "from-gray-500 to-gray-700";
    default:
      return "from-blue-500 to-blue-700";
  }
};

const getBannerTypeBadge = (
  type: BannerType,
): { text: string; color: string } => {
  switch (type) {
    case "Limited":
      return { text: "LIMITED", color: "bg-purple-600" };
    case "Event":
      return { text: "EVENT", color: "bg-green-600" };
    case "Newcomer":
      return { text: "NEW PLAYER", color: "bg-cyan-600" };
    case "Seasonal":
      return { text: "SEASONAL", color: "bg-orange-600" };
    case "Collaboration":
      return { text: "COLLAB", color: "bg-indigo-600" };
    case "Rerun":
      return { text: "RERUN", color: "bg-gray-600" };
    default:
      return { text: "STANDARD", color: "bg-blue-600" };
  }
};

const formatTimeRemaining = (endDate: number): string => {
  const now = Date.now();
  const remaining = endDate - now;

  if (remaining <= 0) return "Expired";

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export const RecruitmentBanner: React.FC<RecruitmentBannerProps> = ({
  banner,
  onSummon,
  className,
}) => {
  const { canAffordSummon, recruitmentSystem } = useGameStore();

  const canSingle = canAffordSummon(banner.id, 1);
  const canTen = canAffordSummon(banner.id, 10);

  const pityCounter = recruitmentSystem.pityCounters[banner.id];
  const badgeInfo = getBannerTypeBadge(banner.type);

  const isExpired = banner.endDate && banner.endDate < Date.now();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${className}`}
    >
      <Card
        className={`relative overflow-hidden ${
          isExpired ? "opacity-50 grayscale" : ""
        }`}
        hoverable={!isExpired}
      >
        {/* Background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getBannerTypeColor(
            banner.type,
          )} opacity-20`}
        />

        {/* Banner type badge */}
        <div className="absolute top-4 left-4 z-10">
          <div
            className={`px-3 py-1 ${badgeInfo.color} text-white text-xs font-bold rounded-full shadow-lg`}
          >
            {badgeInfo.text}
          </div>
        </div>

        {/* Time remaining for limited banners */}
        {banner.endDate && !isExpired && (
          <div className="absolute top-4 right-4 z-10">
            <div className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
              {formatTimeRemaining(banner.endDate)}
            </div>
          </div>
        )}

        {/* Banner content */}
        <div className="relative p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
              {banner.name}
            </h3>
            <p className="text-gray-200 text-sm leading-relaxed">
              {banner.description}
            </p>
          </div>

          {/* Featured characters */}
          {banner.featuredGirls.length > 0 && (
            <div className="mb-4">
              <div className="text-yellow-300 text-sm font-semibold mb-2">
                ✨ Featured Characters
              </div>
              <div className="flex flex-wrap gap-2">
                {banner.featuredGirls.slice(0, 4).map((girlId) => (
                  <div
                    key={girlId}
                    className="px-2 py-1 bg-yellow-400 bg-opacity-20 text-yellow-200 text-xs rounded border border-yellow-400 border-opacity-30"
                  >
                    {girlId
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </div>
                ))}
                {banner.featuredGirls.length > 4 && (
                  <div className="px-2 py-1 bg-yellow-400 bg-opacity-20 text-yellow-200 text-xs rounded border border-yellow-400 border-opacity-30">
                    +{banner.featuredGirls.length - 4} more
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rates and pity info */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <div className="text-purple-300 text-sm font-semibold mb-1">
                🎲 Drop Rates
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="text-gray-300">
                    {banner.rates.Legendary}%
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-purple-400">★★★★</span>
                  <span className="text-gray-300">{banner.rates.Epic}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-blue-400">★★★</span>
                  <span className="text-gray-300">{banner.rates.Rare}%</span>
                </div>
              </div>
            </div>

            {banner.pitySystem.enabled && pityCounter && (
              <div>
                <div className="text-orange-300 text-sm font-semibold mb-1">
                  🎯 Pity Counter
                </div>
                <div className="text-xs text-gray-300">
                  <div className="flex justify-between">
                    <span>Progress:</span>
                    <span className="text-orange-400">
                      {pityCounter.current}/{pityCounter.max}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <div
                      className="bg-orange-400 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(pityCounter.current / pityCounter.max) * 100}%`,
                      }}
                    />
                  </div>
                  {pityCounter.current >=
                    (banner.pitySystem.softPity?.startAt ||
                      pityCounter.max) && (
                    <div className="text-orange-400 text-xs mt-1 animate-pulse">
                      Soft pity active!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Summon buttons */}
          {!isExpired && (
            <div className="space-y-3">
              {/* Single summon */}
              <div className="flex items-center justify-between p-3 bg-black bg-opacity-30 rounded-lg">
                <div>
                  <div className="text-white font-semibold">Single Summon</div>
                  <div className="text-xs text-gray-300">
                    {banner.costs.single.primary.amount}{" "}
                    {banner.costs.single.primary.displayName}
                  </div>
                </div>
                <Button
                  variant="magical"
                  size="sm"
                  disabled={!canSingle}
                  onClick={() => onSummon(banner.id, 1)}
                  className="min-w-[80px]"
                >
                  Summon x1
                </Button>
              </div>

              {/* Ten summon */}
              <div className="flex items-center justify-between p-3 bg-black bg-opacity-30 rounded-lg">
                <div>
                  <div className="text-white font-semibold">Ten Summon</div>
                  <div className="text-xs text-gray-300">
                    {banner.costs.ten.primary.amount}{" "}
                    {banner.costs.ten.primary.displayName}
                  </div>
                  {banner.guarantees.some(
                    (g) => g.type === "minimum_rarity",
                  ) && (
                    <div className="text-xs text-yellow-400">
                      ⭐ Guaranteed{" "}
                      {
                        banner.guarantees.find(
                          (g) => g.type === "minimum_rarity",
                        )?.reward.value
                      }
                      +
                    </div>
                  )}
                </div>
                <Button
                  variant="sparkle"
                  size="sm"
                  disabled={!canTen}
                  onClick={() => onSummon(banner.id, 10)}
                  className="min-w-[80px]"
                >
                  Summon x10
                </Button>
              </div>
            </div>
          )}

          {/* Expired overlay */}
          {isExpired && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <div className="text-white text-xl font-bold">BANNER EXPIRED</div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
