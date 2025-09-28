// Simplified Save System - Frontend Only (using localStorage)
import type { StateCreator } from "zustand";

export interface SaveSlot {
  id: string;
  name: string;
  timestamp: number;
  playerLevel: number;
  playtime: number;
  data: string; // JSON stringified game state
}

export interface SaveSystemSlice {
  // State
  saveSlots: SaveSlot[];
  currentSlot: string | null;
  autoSaveEnabled: boolean;

  // Actions
  saveToSlot: (slotId: string, gameState: Record<string, string | number | boolean>) => void;
  loadFromSlot: (slotId: string) => Record<string, string | number | boolean> | null;
  deleteSlot: (slotId: string) => void;
  createSlot: (name: string) => string;
  renameSlot: (slotId: string, newName: string) => void;
  toggleAutoSave: () => void;
  exportSave: (slotId: string) => string;
  importSave: (saveData: string) => boolean;
}

export const createSaveSystemSlice: StateCreator<SaveSystemSlice> = (set, get) => ({
  saveSlots: [],
  currentSlot: null,
  autoSaveEnabled: true,

  saveToSlot: (slotId: string, gameState: Record<string, string | number | boolean>) => {
    const { saveSlots } = get();
    const slot = saveSlots.find(s => s.id === slotId);

    if (!slot) return;

    const updatedSlot: SaveSlot = {
      ...slot,
      timestamp: Date.now(),
      data: JSON.stringify(gameState),
      playerLevel: (gameState.player as { level?: number })?.level || 1,
      playtime: (gameState.player as { playtime?: number })?.playtime || 0,
    };

    set(state => ({
      saveSlots: state.saveSlots.map(s =>
        s.id === slotId ? updatedSlot : s
      ),
      currentSlot: slotId,
    }));

    // Save to localStorage
    localStorage.setItem(`save_${slotId}`, JSON.stringify(updatedSlot));
  },

  loadFromSlot: (slotId: string) => {
    const { saveSlots } = get();
    const slot = saveSlots.find(s => s.id === slotId);

    if (!slot || !slot.data) return null;

    try {
      set({ currentSlot: slotId });
      return JSON.parse(slot.data);
    } catch {
      return null;
    }
  },

  deleteSlot: (slotId: string) => {
    set(state => ({
      saveSlots: state.saveSlots.filter(s => s.id !== slotId),
      currentSlot: state.currentSlot === slotId ? null : state.currentSlot,
    }));

    localStorage.removeItem(`save_${slotId}`);
  },

  createSlot: (name: string) => {
    const id = Date.now().toString();
    const newSlot: SaveSlot = {
      id,
      name,
      timestamp: Date.now(),
      playerLevel: 1,
      playtime: 0,
      data: '',
    };

    set(state => ({
      saveSlots: [...state.saveSlots, newSlot],
    }));

    return id;
  },

  renameSlot: (slotId: string, newName: string) => {
    set(state => ({
      saveSlots: state.saveSlots.map(s =>
        s.id === slotId ? { ...s, name: newName } : s
      ),
    }));
  },

  toggleAutoSave: () => {
    set(state => ({ autoSaveEnabled: !state.autoSaveEnabled }));
  },

  exportSave: (slotId: string) => {
    const { saveSlots } = get();
    const slot = saveSlots.find(s => s.id === slotId);
    return slot ? JSON.stringify(slot) : '';
  },

  importSave: (saveData: string) => {
    try {
      const slot: SaveSlot = JSON.parse(saveData);
      slot.id = Date.now().toString(); // New ID to avoid conflicts

      set(state => ({
        saveSlots: [...state.saveSlots, slot],
      }));

      localStorage.setItem(`save_${slot.id}`, JSON.stringify(slot));
      return true;
    } catch {
      return false;
    }
  },
});