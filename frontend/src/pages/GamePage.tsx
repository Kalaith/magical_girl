import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../stores/gameStore";
import { useUIStore } from "../stores/uiStore";
import { VIEWS } from "../config/gameConfig";

// Layout Components
import { Header } from "../components/layout/Header";
import { ResourceDisplay } from "../components/layout/ResourceDisplay";

// View Components
import { DashboardView } from "../components/views/DashboardView";
import { MagicalGirlsView } from "../components/views/MagicalGirlsView";
import { RecruitmentView } from "../components/views/RecruitmentView";
import { TrainingView } from "../components/views/TrainingView";
import { MissionsView } from "../components/views/MissionsView";
import { AchievementsView } from "../components/views/AchievementsView";
import { SettingsView } from "../components/views/SettingsView";

// New Advanced Game Components
import { SkillTreePanel } from "../components/game/SkillTreePanel";
// import { SimpleCustomizationPanel as CustomizationPanel } from "../components/game/SimpleCustomizationPanel";
import { PrestigePanel } from "../components/game/PrestigePanel";
import { SaveSystemPanel } from "../components/game/SaveSystemPanel";
import { SimpleEnhancedSettingsPanel as EnhancedSettingsPanel } from "../components/game/SimpleEnhancedSettingsPanel";
import { TutorialOverlay } from "../components/game/TutorialOverlay";

export function GamePage() {
  const gameStore = useGameStore();
  const { currentView } = useUIStore();

  // Initialize game on app start
  useEffect(() => {
    // The game store already initializes with the persist middleware
    // Just trigger the first notification
    gameStore.addNotification({
      type: "info",
      title: "Welcome!",
      message: "Welcome to Magical Girl Simulator!",
    });
  }, [gameStore]); // gameStore is stable, but added for linter

  const renderCurrentView = () => {
    switch (currentView) {
      case VIEWS.DASHBOARD:
        return <DashboardView />;
      case VIEWS.MAGICAL_GIRLS:
        return <MagicalGirlsView />;
      case VIEWS.RECRUITMENT:
        return <RecruitmentView />;
      case VIEWS.TRAINING:
        return <TrainingView />;
      case VIEWS.MISSIONS:
        return <MissionsView />;
      case VIEWS.ACHIEVEMENTS:
        return <AchievementsView />;
      case VIEWS.SKILL_TREE:
        return <SkillTreePanel />;
      case VIEWS.CUSTOMIZATION:
        // return <CustomizationPanel />;
        return <DashboardView />;
      case VIEWS.PRESTIGE:
        return <PrestigePanel />;
      case VIEWS.SAVE_SYSTEM:
        return <SaveSystemPanel />;
      case VIEWS.ENHANCED_SETTINGS:
        return <EnhancedSettingsPanel />;
      case VIEWS.SETTINGS:
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 lg:py-6">
        {/* Resource Display */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 lg:mb-6"
        >
          <ResourceDisplay />
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Tutorial Overlay - Always rendered */}
      <TutorialOverlay />
    </div>
  );
}
