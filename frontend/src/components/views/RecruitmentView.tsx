import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { RecruitmentBanner } from '../Recruitment/RecruitmentBanner';
import { SummonAnimation } from '../Recruitment/SummonAnimation';
import { SummonResults } from '../Recruitment/SummonResults';
import { RecruitmentStats } from '../Recruitment/RecruitmentStats';
import { CurrencyDisplay } from '../Recruitment/CurrencyDisplay';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { SummonResult } from '../../types/recruitment';

export const RecruitmentView: React.FC = () => {
  const {
    recruitmentSystem,
    getActiveBanners,
    performSummon,
    initializeRecruitment,
    isAnimating,
    animationQueue,
    nextAnimation,
    skipAnimation,
    currentSession,
    endSummonSession,
    addNotification
  } = useGameStore();

  const [selectedTab, setSelectedTab] = useState<'banners' | 'history' | 'stats'>('banners');
  const [summonResults, setSummonResults] = useState<SummonResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    initializeRecruitment();
  }, [initializeRecruitment]);

  const activeBanners = getActiveBanners();

  const handleSummon = async (bannerId: string, count: number) => {
    try {
      const results = await performSummon(bannerId, count);
      setSummonResults(results);
      setShowResults(true);

      // Show success notification
      addNotification({
        type: 'success',
        title: 'Summon Complete!',
        message: `Summoned ${count} magical girl${count > 1 ? 's' : ''}!`
      });
    } catch (error) {
      console.error('Summon failed:', error);
      addNotification({
        type: 'error',
        title: 'Summon Failed',
        message: error instanceof Error ? error.message : 'Unable to perform summon'
      });
    }
  };

  const handleSkipAnimation = () => {
    skipAnimation();
    setShowResults(true);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setSummonResults([]);
    if (currentSession) {
      endSummonSession(currentSession.id, 4); // Default satisfaction rating
    }
  };

  const tabs = [
    { id: 'banners' as const, name: 'Summon', icon: '🎭' },
    { id: 'history' as const, name: 'History', icon: '📜' },
    { id: 'stats' as const, name: 'Statistics', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black bg-opacity-50 backdrop-blur-md border-b border-purple-500 border-opacity-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                ✨ Magical Girl Recruitment
              </h1>
              <p className="text-purple-200 text-sm">
                Summon powerful magical girls to join your cause!
              </p>
            </div>
            <CurrencyDisplay />
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  selectedTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-purple-800 bg-opacity-50 text-purple-200 hover:bg-purple-700 hover:bg-opacity-70'
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
          {selectedTab === 'banners' && (
            <motion.div
              key="banners"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {activeBanners.length === 0 ? (
                <Card className="text-center py-12">
                  <div className="text-6xl mb-4">🎭</div>
                  <h3 className="text-xl font-bold text-gray-300 mb-2">
                    No Active Banners
                  </h3>
                  <p className="text-gray-500">
                    Check back later for new recruitment opportunities!
                  </p>
                </Card>
              ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                  {activeBanners.map((banner) => (
                    <RecruitmentBanner
                      key={banner.id}
                      banner={banner}
                      onSummon={handleSummon}
                    />
                  ))}
                </div>
              )}

              {/* Quick stats */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  🎯 Quick Stats
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {recruitmentSystem.summonHistory.length}
                    </div>
                    <div className="text-sm text-gray-400">Total Summons</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-400">
                      {recruitmentSystem.summonHistory.reduce(
                        (sum, record) => sum + record.results.length,
                        0
                      )}
                    </div>
                    <div className="text-sm text-gray-400">Characters Summoned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {recruitmentSystem.summonHistory.reduce(
                        (sum, record) => sum + record.results.filter(r => r.rarity === 'Legendary').length,
                        0
                      )}
                    </div>
                    <div className="text-sm text-gray-400">Legendary Pulls</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">
                      {recruitmentSystem.summonHistory.reduce(
                        (sum, record) => sum + record.results.filter(r => r.rarity === 'Mythical').length,
                        0
                      )}
                    </div>
                    <div className="text-sm text-gray-400">Mythical Pulls</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {selectedTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  📜 Summon History
                </h3>
                {recruitmentSystem.summonHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📜</div>
                    <p className="text-gray-400">No summon history yet</p>
                    <p className="text-gray-500 text-sm">
                      Your summon records will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {recruitmentSystem.summonHistory
                      .slice()
                      .reverse()
                      .slice(0, 20)
                      .map((record) => (
                        <div
                          key={record.id}
                          className="p-4 bg-gray-800 bg-opacity-50 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-semibold text-white">
                                {record.results.length}x Summon
                              </div>
                              <div className="text-sm text-gray-400">
                                {new Date(record.timestamp).toLocaleString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-400">
                                Banner: {record.bannerId.replace(/_/g, ' ')}
                              </div>
                              {record.wasGuaranteed && (
                                <div className="text-xs text-yellow-400">
                                  🎯 Pity Activated
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {record.results.map((result, index) => (
                              <div
                                key={index}
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  result.rarity === 'Mythical'
                                    ? 'bg-red-600 text-white'
                                    : result.rarity === 'Legendary'
                                    ? 'bg-yellow-600 text-white'
                                    : result.rarity === 'Epic'
                                    ? 'bg-purple-600 text-white'
                                    : result.rarity === 'Rare'
                                    ? 'bg-blue-600 text-white'
                                    : result.rarity === 'Uncommon'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-600 text-white'
                                }`}
                              >
                                {result.character.name}
                                {result.isNew && ' ✨'}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {selectedTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <RecruitmentStats />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Summon Animation Overlay */}
      <AnimatePresence>
        {isAnimating && (
          <SummonAnimation
            onNext={nextAnimation}
            onSkip={handleSkipAnimation}
            currentResult={animationQueue[0]}
          />
        )}
      </AnimatePresence>

      {/* Results Modal */}
      <AnimatePresence>
        {showResults && !isAnimating && (
          <SummonResults
            results={summonResults}
            onClose={handleCloseResults}
            sessionData={currentSession}
          />
        )}
      </AnimatePresence>
    </div>
  );
};