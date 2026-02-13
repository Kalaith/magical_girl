// Simplified Prestige System - Frontend Only
import type { StateCreator } from "zustand";

export interface PrestigeData {
  level: number;
  points: number;
  eternityPoints: number;
  totalRebirths: number;
}

export interface PrestigePerk {
  id: string;
  name: string;
  description: string;
  cost: number;
  maxLevel: number;
  currentLevel: number;
}

export interface PrestigeSlice {
  // State
  prestige: PrestigeData;
  perks: PrestigePerk[];

  // Actions
  canPrestige: () => boolean;
  performPrestige: () => void;
  upgradePrestigePerk: (perkId: string) => boolean;
  resetPrestige: () => void;
}

const defaultPrestige: PrestigeData = {
  level: 0,
  points: 0,
  eternityPoints: 0,
  totalRebirths: 0,
};

const defaultPerks: PrestigePerk[] = [
  {
    id: "exp_boost",
    name: "Experience Boost",
    description: "Increases experience gain by 10% per level",
    cost: 10,
    maxLevel: 10,
    currentLevel: 0,
  },
  {
    id: "resource_boost",
    name: "Resource Boost",
    description: "Increases resource generation by 5% per level",
    cost: 15,
    maxLevel: 20,
    currentLevel: 0,
  },
];

export const createPrestigeSlice: StateCreator<PrestigeSlice> = (set, get) => ({
  prestige: defaultPrestige,
  perks: [...defaultPerks],

  canPrestige: () => {
    // Simple prestige requirement - could be based on player level or other criteria
    return true; // For now, always allow prestige
  },

  performPrestige: () => {
    const { prestige } = get();
    const pointsGained = Math.floor(prestige.level * 0.1); // Simple formula

    set((state) => ({
      prestige: {
        ...state.prestige,
        level: state.prestige.level + 1,
        points: state.prestige.points + pointsGained,
        totalRebirths: state.prestige.totalRebirths + 1,
      },
    }));
  },

  upgradePrestigePerk: (perkId: string) => {
    const { prestige, perks } = get();
    const perk = perks.find((p) => p.id === perkId);

    if (
      !perk ||
      perk.currentLevel >= perk.maxLevel ||
      prestige.points < perk.cost
    ) {
      return false;
    }

    set((state) => ({
      prestige: {
        ...state.prestige,
        points: state.prestige.points - perk.cost,
      },
      perks: state.perks.map((p) =>
        p.id === perkId ? { ...p, currentLevel: p.currentLevel + 1 } : p,
      ),
    }));

    return true;
  },

  resetPrestige: () => {
    set({
      prestige: { ...defaultPrestige },
      perks: defaultPerks.map((p) => ({ ...p, currentLevel: 0 })),
    });
  },
});
