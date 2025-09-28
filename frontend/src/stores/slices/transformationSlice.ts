// Simplified Transformation System - Frontend Only
import type { StateCreator } from "zustand";

export interface Transformation {
  id: string;
  name: string;
  element: string;
  isUnlocked: boolean;
  isActive: boolean;
}

export interface TransformationSlice {
  // State
  transformations: Transformation[];
  activeTransformation: string | null;

  // Actions
  unlockTransformation: (transformationId: string) => void;
  activateTransformation: (transformationId: string) => void;
  deactivateTransformation: () => void;
  resetTransformations: () => void;
}

const defaultTransformations: Transformation[] = [
  {
    id: 'basic',
    name: 'Basic Form',
    element: 'neutral',
    isUnlocked: true,
    isActive: false,
  },
  {
    id: 'fire',
    name: 'Fire Guardian',
    element: 'fire',
    isUnlocked: false,
    isActive: false,
  },
  {
    id: 'water',
    name: 'Water Guardian',
    element: 'water',
    isUnlocked: false,
    isActive: false,
  },
];

export const createTransformationSlice: StateCreator<TransformationSlice> = (set, get) => ({
  transformations: [...defaultTransformations],
  activeTransformation: null,

  unlockTransformation: (transformationId: string) => {
    set(state => ({
      transformations: state.transformations.map(t =>
        t.id === transformationId ? { ...t, isUnlocked: true } : t
      )
    }));
  },

  activateTransformation: (transformationId: string) => {
    const { transformations } = get();
    const transformation = transformations.find(t => t.id === transformationId);

    if (!transformation?.isUnlocked) return;

    set(state => ({
      transformations: state.transformations.map(t => ({
        ...t,
        isActive: t.id === transformationId,
      })),
      activeTransformation: transformationId,
    }));
  },

  deactivateTransformation: () => {
    set(state => ({
      transformations: state.transformations.map(t => ({
        ...t,
        isActive: false,
      })),
      activeTransformation: null,
    }));
  },

  resetTransformations: () => {
    set({
      transformations: defaultTransformations.map(t => ({ ...t })),
      activeTransformation: null,
    });
  },
});