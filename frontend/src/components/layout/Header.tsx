import React from 'react';
import { motion } from 'framer-motion';
import {
  Star, Users, Sparkles, Dumbbell, Map, Trophy, Settings,
  TreePine, Palette, Crown, Save, BookOpen, Sliders
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { VIEWS, type ViewType } from '../../config/gameConfig';

const navigationItems = [
  { id: VIEWS.DASHBOARD, label: 'Dashboard', icon: Star },
  { id: VIEWS.MAGICAL_GIRLS, label: 'Magical Girls', icon: Users },
  { id: VIEWS.RECRUITMENT, label: 'Recruitment', icon: Sparkles },
  { id: VIEWS.TRAINING, label: 'Training', icon: Dumbbell },
  { id: VIEWS.MISSIONS, label: 'Missions', icon: Map },
  { id: VIEWS.ACHIEVEMENTS, label: 'Achievements', icon: Trophy },
];

const advancedNavigationItems = [
  { id: VIEWS.SKILL_TREE, label: 'Skill Tree', icon: TreePine },
  { id: VIEWS.CUSTOMIZATION, label: 'Customize', icon: Palette },
  { id: VIEWS.PRESTIGE, label: 'Prestige', icon: Crown },
  { id: VIEWS.SAVE_SYSTEM, label: 'Save', icon: Save },
  { id: VIEWS.ENHANCED_SETTINGS, label: 'Advanced', icon: Sliders },
  { id: VIEWS.SETTINGS, label: 'Settings', icon: Settings },
];

export const Header: React.FC = () => {
  const { currentView, setCurrentView } = useUIStore();
  const [showAdvancedMenu, setShowAdvancedMenu] = React.useState(false);

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setShowAdvancedMenu(false);
  };
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Star className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-base sm:text-xl font-bold text-gradient">
                Magical Girl Simulator
              </h1>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleViewChange(item.id)}
                  className={`
                    px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-200
                    flex items-center space-x-2 touch-target
                    ${isActive
                      ? 'bg-purple-100 text-purple-700 shadow-sm'
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline text-sm">{item.label}</span>
                </motion.button>
              );
            })}

            {/* Advanced Menu Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setShowAdvancedMenu(!showAdvancedMenu)}
                className="px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-200
                         flex items-center space-x-2 touch-target
                         text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden lg:inline text-sm">Advanced</span>
                <motion.div
                  animate={{ rotate: showAdvancedMenu ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Star className="w-3 h-3" />
                </motion.div>
              </motion.button>

              {showAdvancedMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  {advancedNavigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleViewChange(item.id)}
                        className={`
                          w-full px-4 py-2 text-left hover:bg-purple-50 transition-colors
                          flex items-center space-x-3
                          ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-700'}
                        `}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </nav>          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              className="p-2 rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600 touch-target"
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // You can implement a mobile menu toggle here
                // For now, we'll show a simple menu
              }}
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation - Always visible on mobile */}
        <div className="md:hidden border-t border-purple-200 bg-white/90">
          <div className="flex overflow-x-auto space-x-1 p-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleViewChange(item.id)}
                  className={`
                    flex-shrink-0 px-3 py-2 rounded-lg font-medium transition-all duration-200
                    flex flex-col items-center space-y-1 min-w-[70px] touch-target
                    ${isActive
                      ? 'bg-purple-100 text-purple-700 shadow-sm'
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs leading-none">{item.label}</span>
                </motion.button>
              );
            })}

            {/* Advanced Menu for Mobile */}
            <motion.button
              onClick={() => setShowAdvancedMenu(!showAdvancedMenu)}
              className={`
                flex-shrink-0 px-3 py-2 rounded-lg font-medium transition-all duration-200
                flex flex-col items-center space-y-1 min-w-[70px] touch-target
                ${showAdvancedMenu
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-xs leading-none">More</span>
            </motion.button>
          </div>

          {/* Advanced Mobile Menu */}
          {showAdvancedMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-purple-200 bg-purple-50"
            >
              <div className="grid grid-cols-3 gap-2 p-3">
                {advancedNavigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleViewChange(item.id)}
                      className={`
                        px-2 py-3 rounded-lg font-medium transition-all duration-200
                        flex flex-col items-center space-y-1 touch-target
                        ${isActive
                          ? 'bg-purple-200 text-purple-800 shadow-sm'
                          : 'text-gray-700 hover:bg-purple-100 hover:text-purple-700'
                        }
                      `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs leading-none text-center">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};
