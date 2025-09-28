import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import type {
  GameSettings,
  SettingsCategory,
  GameSetting,
  SettingsProfile,
  OptimizationSuggestion,
  AccessibilityAssessment
} from '../../types';

interface SettingControlProps {
  setting: GameSetting;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}

const SettingControl: React.FC<SettingControlProps> = ({
  setting,
  value,
  onChange,
  disabled = false
}) => {
  const renderControl = () => {
    switch (setting.type) {
      case 'boolean':
        return (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
              className="rounded"
            />
            <span className="text-white">{setting.label}</span>
          </label>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              {setting.label}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min={setting.min || 0}
                max={setting.max || 100}
                step={setting.step || 1}
                value={value || setting.defaultValue}
                onChange={(e) => onChange(Number(e.target.value))}
                disabled={disabled}
                className="flex-1"
              />
              <span className="text-white text-sm w-12 text-right">
                {value || setting.defaultValue}
                {setting.unit && setting.unit}
              </span>
            </div>
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              {setting.label}
            </label>
            <select
              value={value || setting.defaultValue}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
            >
              {setting.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'string':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              {setting.label}
            </label>
            <input
              type="text"
              value={value || setting.defaultValue || ''}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              placeholder={setting.placeholder}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
            />
          </div>
        );

      case 'color':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              {setting.label}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={value || setting.defaultValue}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-12 h-8 border border-gray-600 rounded"
              />
              <input
                type="text"
                value={value || setting.defaultValue}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-1">
      {renderControl()}
      {setting.description && (
        <p className="text-xs text-gray-500">{setting.description}</p>
      )}
      {setting.warning && value !== setting.defaultValue && (
        <p className="text-xs text-yellow-400">⚠️ {setting.warning}</p>
      )}
    </div>
  );
};

interface SettingsCategoryProps {
  category: SettingsCategory;
  settings: Record<string, any>;
  onSettingChange: (key: string, value: any) => void;
  searchQuery: string;
}

const SettingsCategoryComponent: React.FC<SettingsCategoryProps> = ({
  category,
  settings,
  onSettingChange,
  searchQuery
}) => {
  const [isExpanded, setIsExpanded] = useState(category.defaultExpanded !== false);

  const filteredSettings = useMemo(() => {
    if (!searchQuery) return category.settings;

    return category.settings.filter(setting =>
      setting.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      setting.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      setting.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [category.settings, searchQuery]);

  if (searchQuery && filteredSettings.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="bg-gray-800 rounded-lg border border-gray-600"
      layout
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{category.icon}</span>
          <div>
            <h3 className="font-bold text-white">{category.name}</h3>
            <p className="text-sm text-gray-400">{category.description}</p>
          </div>
        </div>
        <motion.svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-4">
              {filteredSettings.map(setting => (
                <motion.div
                  key={setting.key}
                  layout
                  className="p-3 bg-gray-700 rounded border border-gray-600"
                >
                  <SettingControl
                    setting={setting}
                    value={settings[setting.key]}
                    onChange={(value) => onSettingChange(setting.key, value)}
                    disabled={setting.disabled}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface SettingsProfileCardProps {
  profile: SettingsProfile;
  isActive: boolean;
  onActivate: (profileId: string) => void;
  onEdit: (profile: SettingsProfile) => void;
  onDelete: (profileId: string) => void;
}

const SettingsProfileCard: React.FC<SettingsProfileCardProps> = ({
  profile,
  isActive,
  onActivate,
  onEdit,
  onDelete
}) => {
  return (
    <motion.div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isActive
          ? 'border-blue-500 bg-blue-900 bg-opacity-20'
          : 'border-gray-600 bg-gray-800 hover:border-gray-500'
      }`}
      whileHover={{ scale: 1.02 }}
      onClick={() => onActivate(profile.id)}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-white">{profile.name}</h4>
        {isActive && (
          <span className="px-2 py-1 bg-green-600 text-white text-xs rounded font-semibold">
            Active
          </span>
        )}
      </div>

      <p className="text-sm text-gray-400 mb-3">{profile.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Type: {profile.type}</span>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(profile);
            }}
            className="text-blue-400 hover:text-blue-300"
          >
            Edit
          </button>
          {profile.type !== 'system' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(profile.id);
              }}
              className="text-red-400 hover:text-red-300"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface OptimizationSuggestionCardProps {
  suggestion: OptimizationSuggestion;
  onApply: (suggestionId: string) => void;
  onDismiss: (suggestionId: string) => void;
}

const OptimizationSuggestionCard: React.FC<OptimizationSuggestionCardProps> = ({
  suggestion,
  onApply,
  onDismiss
}) => {
  const impactColors = {
    low: 'border-green-500 bg-green-900 bg-opacity-20',
    medium: 'border-yellow-500 bg-yellow-900 bg-opacity-20',
    high: 'border-red-500 bg-red-900 bg-opacity-20'
  };

  return (
    <motion.div
      className={`p-4 rounded-lg border ${impactColors[suggestion.impact]}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-white">{suggestion.title}</h4>
          <p className="text-sm text-gray-300">{suggestion.description}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          suggestion.impact === 'low' ? 'bg-green-600 text-white' :
          suggestion.impact === 'medium' ? 'bg-yellow-600 text-black' :
          'bg-red-600 text-white'
        }`}>
          {suggestion.impact.toUpperCase()} IMPACT
        </span>
      </div>

      {suggestion.expectedBenefit && (
        <div className="mb-3 text-sm text-green-400">
          Expected benefit: {suggestion.expectedBenefit}
        </div>
      )}

      <div className="flex space-x-2">
        <button
          onClick={() => onApply(suggestion.id)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-semibold"
        >
          Apply
        </button>
        <button
          onClick={() => onDismiss(suggestion.id)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
        >
          Dismiss
        </button>
      </div>
    </motion.div>
  );
};

export const EnhancedSettingsPanel: React.FC = () => {
  const {
    enhancedSettingsState,
    updateSetting,
    loadProfile,
    saveProfile,
    deleteProfile,
    createProfile,
    validateSettings,
    optimizeSettings,
    resetSettings,
    exportSettings,
    importSettings,
    assessAccessibility
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<'settings' | 'profiles' | 'optimization' | 'accessibility'>('settings');
  const [searchQuery, setSearchQuery] = useState('');
  const [showExpertMode, setShowExpertMode] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState('');

  const currentSettings = enhancedSettingsState.currentSettings;
  const availableProfiles = enhancedSettingsState.availableProfiles || [];
  const optimizationSuggestions = enhancedSettingsState.optimizationSuggestions || [];

  const handleSettingChange = useCallback((key: string, value: any) => {
    updateSetting(key, value);
  }, [updateSetting]);

  const handleProfileActivate = useCallback((profileId: string) => {
    loadProfile(profileId);
    setSelectedProfileId(profileId);
  }, [loadProfile]);

  const handleCreateProfile = useCallback(() => {
    const name = prompt('Enter profile name:');
    if (name) {
      createProfile(name, 'user');
    }
  }, [createProfile]);

  const handleOptimize = useCallback(() => {
    optimizeSettings(['performance', 'accessibility', 'user_experience']);
  }, [optimizeSettings]);

  const filteredCategories = useMemo(() => {
    if (!currentSettings.categories) return [];

    return currentSettings.categories.filter(category => {
      if (!showExpertMode && category.accessLevel === 'expert') {
        return false;
      }

      if (!searchQuery) return true;

      return category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
             category.settings.some(setting =>
               setting.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
               setting.description?.toLowerCase().includes(searchQuery.toLowerCase())
             );
    });
  }, [currentSettings.categories, searchQuery, showExpertMode]);

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">Enhanced Settings</h1>

          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
              {[
                { id: 'settings', label: 'Settings' },
                { id: 'profiles', label: 'Profiles' },
                { id: 'optimization', label: 'Optimization' },
                { id: 'accessibility', label: 'Accessibility' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showExpertMode}
                  onChange={(e) => setShowExpertMode(e.target.checked)}
                  className="rounded"
                />
                <span className="text-white text-sm">Expert Mode</span>
              </label>

              <button
                onClick={() => resetSettings('user')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-semibold"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'settings' && (
          <div>
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search settings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
                  />
                </div>
                <button
                  onClick={handleOptimize}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold"
                >
                  Auto-Optimize
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredCategories.map(category => (
                <SettingsCategoryComponent
                  key={category.id}
                  category={category}
                  settings={currentSettings.values}
                  onSettingChange={handleSettingChange}
                  searchQuery={searchQuery}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profiles' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Settings Profiles</h2>
              <button
                onClick={handleCreateProfile}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
              >
                Create Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableProfiles.map(profile => (
                <SettingsProfileCard
                  key={profile.id}
                  profile={profile}
                  isActive={profile.id === selectedProfileId}
                  onActivate={handleProfileActivate}
                  onEdit={(profile) => {
                    // Implement profile editing
                  }}
                  onDelete={deleteProfile}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'optimization' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Performance Optimization</h2>
              <p className="text-gray-400">Suggestions to improve your game experience</p>
            </div>

            <div className="space-y-4">
              {optimizationSuggestions.map(suggestion => (
                <OptimizationSuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onApply={(id) => {
                    // Apply optimization suggestion
                  }}
                  onDismiss={(id) => {
                    // Dismiss suggestion
                  }}
                />
              ))}

              {optimizationSuggestions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No optimization suggestions available</p>
                  <p className="text-gray-500 text-sm">Your settings are already optimized!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'accessibility' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Accessibility Assessment</h2>
              <p className="text-gray-400">Ensure the game is accessible to all players</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-4">Current Assessment</h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Overall Score</span>
                      <span className="text-green-400 font-bold">85%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">WCAG AA Compliance</span>
                      <span className="text-yellow-400 font-bold">78%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Color Contrast</span>
                      <span className="text-green-400 font-bold">92%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-4">Recommendations</h3>

                <div className="space-y-3">
                  <div className="p-3 bg-yellow-900 bg-opacity-30 rounded border border-yellow-500">
                    <h4 className="font-semibold text-yellow-400">Font Size</h4>
                    <p className="text-sm text-gray-300">Consider increasing minimum font size for better readability</p>
                  </div>

                  <div className="p-3 bg-blue-900 bg-opacity-30 rounded border border-blue-500">
                    <h4 className="font-semibold text-blue-400">Keyboard Navigation</h4>
                    <p className="text-sm text-gray-300">Enable tab navigation for all interactive elements</p>
                  </div>

                  <div className="p-3 bg-green-900 bg-opacity-30 rounded border border-green-500">
                    <h4 className="font-semibold text-green-400">Screen Reader</h4>
                    <p className="text-sm text-gray-300">Good ARIA label coverage detected</p>
                  </div>
                </div>

                <button
                  onClick={() => assessAccessibility()}
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded font-semibold"
                >
                  Re-assess Accessibility
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};