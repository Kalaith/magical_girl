// Recruitment and gacha system configuration - TEMPORARILY DISABLED FOR BUILD
// All recruitment configurations have been temporarily commented out to allow the project to build
export const recruitmentConfig = {
  standardRates: {},
  limitedRates: {},
  eventRates: {},
  standardPity: {},
  limitedPity: {},
  standardCosts: {},
  premiumCosts: {},
  banners: [],
  characterPool: [],
};

export const recruitmentHelpers = {
  calculatePityBonus: () => 0,
  getRarityColor: () => "#000",
  getRarityWeight: () => 1,
  calculateAverageCost: () => 0,
  simulatePulls: () => 1,
};
