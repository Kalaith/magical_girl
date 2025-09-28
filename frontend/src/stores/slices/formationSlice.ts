// Simplified Formation System - Frontend Only
import type { StateCreator } from "zustand";

export interface Formation {
  id: string;
  name: string;
  positions: FormationPosition[];
}

export interface FormationPosition {
  row: number;
  column: number;
  girlId: string | null;
}

export interface FormationSlice {
  // State
  activeFormation: Formation | null;
  savedFormations: Formation[];

  // Actions
  createFormation: (name: string) => void;
  saveFormation: (formation: Formation) => void;
  loadFormation: (formationId: string) => void;
  deleteFormation: (formationId: string) => void;
  updatePosition: (row: number, column: number, girlId: string | null) => void;
  clearFormation: () => void;
}

const createEmptyFormation = (name: string): Formation => ({
  id: Date.now().toString(),
  name,
  positions: Array.from({ length: 9 }, (_, i) => ({
    row: Math.floor(i / 3),
    column: i % 3,
    girlId: null,
  })),
});

export const createFormationSlice: StateCreator<FormationSlice> = (set, get) => ({
  activeFormation: createEmptyFormation('Default'),
  savedFormations: [],

  createFormation: (name: string) => {
    const newFormation = createEmptyFormation(name);
    set({ activeFormation: newFormation });
  },

  saveFormation: (formation: Formation) => {
    const { savedFormations } = get();
    const existing = savedFormations.findIndex(f => f.id === formation.id);

    if (existing >= 0) {
      const updated = [...savedFormations];
      updated[existing] = formation;
      set({ savedFormations: updated });
    } else {
      set({ savedFormations: [...savedFormations, formation] });
    }
  },

  loadFormation: (formationId: string) => {
    const { savedFormations } = get();
    const formation = savedFormations.find(f => f.id === formationId);
    if (formation) {
      set({ activeFormation: { ...formation } });
    }
  },

  deleteFormation: (formationId: string) => {
    const { savedFormations } = get();
    set({
      savedFormations: savedFormations.filter(f => f.id !== formationId)
    });
  },

  updatePosition: (row: number, column: number, girlId: string | null) => {
    const { activeFormation } = get();
    if (!activeFormation) return;

    const newPositions = activeFormation.positions.map(pos =>
      pos.row === row && pos.column === column
        ? { ...pos, girlId }
        : pos
    );

    set({
      activeFormation: {
        ...activeFormation,
        positions: newPositions,
      }
    });
  },

  clearFormation: () => {
    const { activeFormation } = get();
    if (!activeFormation) return;

    const clearedPositions = activeFormation.positions.map(pos => ({
      ...pos,
      girlId: null,
    }));

    set({
      activeFormation: {
        ...activeFormation,
        positions: clearedPositions,
      }
    });
  },
});