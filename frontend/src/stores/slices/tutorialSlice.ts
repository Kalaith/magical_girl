// Simplified Tutorial System - Frontend Only
import type { StateCreator } from "zustand";

export interface Tutorial {
  id: string;
  name: string;
  steps: TutorialStep[];
  isCompleted: boolean;
}

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for highlighting
  position?: "top" | "bottom" | "left" | "right";
}

export interface TutorialSlice {
  // Simple state
  currentTutorial: string | null;
  currentStep: number;
  showTutorial: boolean;
  completedTutorials: string[];

  // Simple actions
  startTutorial: (tutorialId: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  completeTutorial: () => void;
  skipTutorial: () => void;
  hideTutorial: () => void;
  resetTutorials: () => void;
}

export const createTutorialSlice: StateCreator<TutorialSlice> = (set, get) => ({
  // Initial state
  currentTutorial: null,
  currentStep: 0,
  showTutorial: false,
  completedTutorials: [],

  // Actions
  startTutorial: (tutorialId: string) => {
    set({
      currentTutorial: tutorialId,
      currentStep: 0,
      showTutorial: true,
    });
  },

  nextStep: () => {
    const { currentStep } = get();
    set({ currentStep: currentStep + 1 });
  },

  previousStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  completeTutorial: () => {
    const { currentTutorial, completedTutorials } = get();
    if (currentTutorial && !completedTutorials.includes(currentTutorial)) {
      set({
        completedTutorials: [...completedTutorials, currentTutorial],
        currentTutorial: null,
        showTutorial: false,
        currentStep: 0,
      });
    }
  },

  skipTutorial: () => {
    set({
      currentTutorial: null,
      showTutorial: false,
      currentStep: 0,
    });
  },

  hideTutorial: () => {
    set({ showTutorial: false });
  },

  resetTutorials: () => {
    set({
      currentTutorial: null,
      currentStep: 0,
      showTutorial: false,
      completedTutorials: [],
    });
  },
});
