import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMissions } from "../../hooks/useMissions";
import { MissionStats } from "../Mission/MissionStats";
import { MissionFilters } from "../Mission/MissionFilters";
import { MissionCard } from "../Mission/MissionCard";
import { ActiveMission } from "../Mission/ActiveMission";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

export const MissionsView: React.FC = () => {
  const {
    missions,
    activeMission,
    missionStats,
    handleStartMission,
    handleCompleteMission,
    filters,
    setSearchTerm,
    setSelectedType,
    setSelectedDifficulty,
    setSelectedCategory,
    setShowOnlyAvailable,
    setShowCompleted,
  } = useMissions();

  const [selectedMission, setSelectedMission] = useState<string | null>(null);

  const handleMissionStart = (missionId: string) => {
    const success = handleStartMission(missionId);
    if (success) {
      setSelectedMission(null);
    }
  };

  const handleMissionComplete = () => {
    handleCompleteMission(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-magical-primary mb-2">
          Missions
        </h1>
        <p className="text-gray-600">
          Send your magical girls on exciting adventures
        </p>
      </div>

      {/* Mission Stats */}
      <MissionStats
        totalMissions={missionStats.totalMissions}
        completedMissions={missionStats.completedMissions}
        activeMissions={missionStats.activeMissions}
        totalRewardsEarned={missionStats.totalRewardsEarned}
        averageSuccessRate={missionStats.averageSuccessRate}
        streakCount={missionStats.streakCount}
      />

      {/* Active Mission */}
      <AnimatePresence>
        {activeMission && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ActiveMission
              mission={activeMission}
              onComplete={handleMissionComplete}
              onCancel={() => handleCompleteMission(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mission Filters */}
      <MissionFilters
        searchTerm={filters.searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={filters.selectedType}
        onTypeChange={setSelectedType}
        selectedDifficulty={filters.selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
        selectedCategory={filters.selectedCategory}
        onCategoryChange={setSelectedCategory}
        showOnlyAvailable={filters.showOnlyAvailable}
        onShowOnlyAvailableChange={setShowOnlyAvailable}
        showCompleted={filters.showCompleted}
        onShowCompletedChange={setShowCompleted}
      />

      {/* Mission List */}
      <div className="space-y-4">
        {missions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No missions match your current filters.</p>
            <p className="text-sm text-gray-400 mt-2">
              Try adjusting your search or filter criteria.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {missions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onStart={handleMissionStart}
                disabled={!!activeMission}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mission Details Modal (placeholder for future enhancement) */}
      {selectedMission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full mx-4 p-6">
            <h2 className="text-xl font-bold mb-4">Mission Details</h2>
            <p className="text-gray-600 mb-4">
              Detailed mission information will be shown here.
            </p>
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={() => handleMissionStart(selectedMission)}
                disabled={!!activeMission}
              >
                Start Mission
              </Button>
              <Button variant="secondary" onClick={() => setSelectedMission(null)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};