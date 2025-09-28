// Simplified Settings System - Frontend Only
import type { StateCreator } from "zustand";

export interface GameSettings {
  // Audio settings
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;

  // Graphics settings
  quality: 'low' | 'medium' | 'high';
  animations: boolean;

  // Gameplay settings
  autoSave: boolean;
  fastMode: boolean;
  showDamageNumbers: boolean;

  // UI settings
  uiScale: number;
  showTooltips: boolean;

  // Accessibility
  reducedMotion: boolean;
  highContrast: boolean;
}

export interface EnhancedSettingsSlice {
  // State
  settings: GameSettings;

  // Actions
  updateSetting: <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => void;
  resetSettings: () => void;
  resetCategory: (category: 'audio' | 'graphics' | 'gameplay' | 'ui' | 'accessibility') => void;
}

const defaultSettings: GameSettings = {
  masterVolume: 80,
  musicVolume: 70,
  sfxVolume: 80,
  quality: 'medium',
  animations: true,
  autoSave: true,
  fastMode: false,
  showDamageNumbers: true,
  uiScale: 1,
  showTooltips: true,
  reducedMotion: false,
  highContrast: false,
};

export const createEnhancedSettingsSlice: StateCreator<EnhancedSettingsSlice> = (set, get) => ({
  settings: defaultSettings,

  updateSetting: (key, value) => {
    set(state => ({
      settings: {
        ...state.settings,
        [key]: value
      }
    }));
  },

  resetSettings: () => {
    set({ settings: { ...defaultSettings } });
  },

  resetCategory: (category) => {
    const { settings } = get();
    let updates: Partial<GameSettings> = {};

    switch (category) {
      case 'audio':
        updates = {
          masterVolume: defaultSettings.masterVolume,
          musicVolume: defaultSettings.musicVolume,
          sfxVolume: defaultSettings.sfxVolume,
        };
        break;
      case 'graphics':
        updates = {
          quality: defaultSettings.quality,
          animations: defaultSettings.animations,
        };
        break;
      case 'gameplay':
        updates = {
          autoSave: defaultSettings.autoSave,
          fastMode: defaultSettings.fastMode,
          showDamageNumbers: defaultSettings.showDamageNumbers,
        };
        break;
      case 'ui':
        updates = {
          uiScale: defaultSettings.uiScale,
          showTooltips: defaultSettings.showTooltips,
        };
        break;
      case 'accessibility':
        updates = {
          reducedMotion: defaultSettings.reducedMotion,
          highContrast: defaultSettings.highContrast,
        };
        break;
    }

    set(state => ({
      settings: { ...state.settings, ...updates }
    }));
  },
});