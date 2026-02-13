import type { StateCreator } from "zustand";

export interface MissionSlice {
  missions: never[];
  activeMission: null;
  getMissionProgress: () => number;
  startMission: () => void;
  completeMission: () => void;
}

export const createMissionSlice: StateCreator<MissionSlice> = () => ({
  missions: [],
  activeMission: null,
  getMissionProgress: () => 0,
  startMission: () => {},
  completeMission: () => {},
});
