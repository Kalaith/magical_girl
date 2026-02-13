import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  SkillTreeState,
  SkillTree,
  SkillNode,
  SkillBuild,
  TreeAnalysis,
  TreeFilterSettings,
  TreeViewMode,
} from "../types/skillTree";
import { skillTrees } from "../data/skillTreeConfig";

interface SkillTreeStore extends SkillTreeState {
  // Actions
  learnSkillNode: (treeId: string, nodeId: string, ranks?: number) => void;
  unlearnSkillNode: (treeId: string, nodeId: string, ranks?: number) => void;
  resetSkillTree: (treeId: string) => void;
  unlockSkillTree: (treeId: string) => void;
  analyzeSkillTree: (treeId: string) => TreeAnalysis;
  selectNode: (nodeId: string) => void;
  setTreeViewMode: (mode: TreeViewMode) => void;
  updateFilterSettings: (settings: Partial<TreeFilterSettings>) => void;

  // Getters
  getSkillTree: (treeId: string) => SkillTree | null;
  getSkillNode: (treeId: string, nodeId: string) => SkillNode | null;
  getActiveBuild: () => SkillBuild | null;
  getTotalSkillPoints: () => number;
  getUnlockedTrees: () => SkillTree[];
}

const initialState: SkillTreeState = {
  trees: skillTrees.reduce((acc, tree) => {
    acc[tree.id] = tree;
    return acc;
  }, {} as Record<string, SkillTree>),
  activeTreeId: null,
  globalSkillPoints: 10,
  savedBuilds: [],
  activeBuildId: null,
  skillLearningQueue: [],
  autoLearnEnabled: false,
  lastAnalysis: null,
  recommendedNodes: [],
  selectedNodeId: null,
  hoveredNodeId: null,
  treeViewMode: "full",
  filterSettings: {
    showLockedNodes: true,
    showUnaffordableNodes: true,
    highlightRecommended: true,
    filterByCategory: [],
    filterByTier: [],
    filterByPath: [],
    searchQuery: "",
  },
};

export const useSkillTreeStore = create<SkillTreeStore>()(
  immer((set, get) => ({
    ...initialState,

    // Actions
    learnSkillNode: (treeId: string, nodeId: string, ranks: number = 1) => {
      set((state) => {
        const tree = state.trees[treeId];
        if (!tree) return;

        const nodeIndex = tree.nodes.findIndex((node) => node.id === nodeId);
        if (nodeIndex === -1) return;

        const node = tree.nodes[nodeIndex];

        // Simple validation
        if (!tree.isUnlocked || node.currentRank >= node.maxRank || tree.availablePoints < 1) {
          return;
        }

        const newRank = Math.min(node.currentRank + ranks, node.maxRank);
        const cost = (newRank - node.currentRank) * 1; // Simple cost calculation

        if (tree.availablePoints < cost) return;

        // Update node
        tree.nodes[nodeIndex] = {
          ...node,
          currentRank: newRank,
          isMaxRank: newRank >= node.maxRank,
        };

        // Update tree
        tree.availablePoints -= cost;
        tree.totalPointsSpent += cost;
        tree.totalNodesUnlocked = tree.nodes.filter(n => n.currentRank > 0).length;

        // Update learnable status
        tree.nodes.forEach(n => {
          n.isLearnable = n.prerequisites.length === 0 || n.prerequisites.every(prereq => {
            if (prereq.type === "node_rank" && prereq.nodeId) {
              const prereqNode = tree.nodes.find(pn => pn.id === prereq.nodeId);
              return prereqNode ? prereqNode.currentRank >= (prereq.minimumRank || 1) : false;
            }
            return true;
          });
        });
      });
    },

    unlearnSkillNode: (treeId: string, nodeId: string, ranks: number = 1) => {
      set((state) => {
        const tree = state.trees[treeId];
        if (!tree) return;

        const nodeIndex = tree.nodes.findIndex((node) => node.id === nodeId);
        if (nodeIndex === -1) return;

        const node = tree.nodes[nodeIndex];
        if (node.currentRank === 0) return;

        const newRank = Math.max(node.currentRank - ranks, 0);
        const refund = (node.currentRank - newRank) * 1;

        tree.nodes[nodeIndex] = {
          ...node,
          currentRank: newRank,
          isMaxRank: false,
        };

        tree.availablePoints += refund;
        tree.totalPointsSpent -= refund;
        tree.totalNodesUnlocked = tree.nodes.filter(n => n.currentRank > 0).length;
      });
    },

    resetSkillTree: (treeId: string) => {
      set((state) => {
        const tree = state.trees[treeId];
        if (!tree) return;

        const refund = tree.totalPointsSpent;

        state.trees[treeId] = {
          ...tree,
          nodes: tree.nodes.map(node => ({
            ...node,
            currentRank: 0,
            isMaxRank: false,
            isLearnable: node.prerequisites.length === 0,
          })),
          totalNodesUnlocked: 0,
          totalPointsSpent: 0,
          availablePoints: tree.availablePoints + refund,
          resetCount: tree.resetCount + 1,
        };
      });
    },

    unlockSkillTree: (treeId: string) => {
      set((state) => {
        const tree = state.trees[treeId];
        if (!tree || tree.isUnlocked) return;

        state.trees[treeId] = { ...tree, isUnlocked: true };
      });
    },

    analyzeSkillTree: (treeId: string): TreeAnalysis => {
      const tree = get().getSkillTree(treeId);
      if (!tree) {
        return {
          treeId,
          analyzedAt: Date.now(),
          pointEfficiency: 0,
          pathOptimization: 0,
          synergyScore: 0,
          recommendedNodes: [],
          inefficientNodes: [],
          missedSynergies: [],
          suggestedRespec: false,
          alternativeBuilds: [],
          optimizationTips: [],
        };
      }

      return {
        treeId,
        analyzedAt: Date.now(),
        pointEfficiency: 0.8,
        pathOptimization: 0.7,
        synergyScore: 0.6,
        recommendedNodes: [],
        inefficientNodes: [],
        missedSynergies: [],
        suggestedRespec: false,
        alternativeBuilds: [],
        optimizationTips: ["Focus on core skills first"],
      };
    },

    selectNode: (nodeId: string) => {
      set((state) => {
        state.selectedNodeId = nodeId;
      });
    },

    setTreeViewMode: (mode: TreeViewMode) => {
      set((state) => {
        state.treeViewMode = mode;
      });
    },

    updateFilterSettings: (settings: Partial<TreeFilterSettings>) => {
      set((state) => {
        state.filterSettings = { ...state.filterSettings, ...settings };
      });
    },

    // Getters
    getSkillTree: (treeId: string) => {
      return get().trees[treeId] || null;
    },

    getSkillNode: (treeId: string, nodeId: string) => {
      const tree = get().getSkillTree(treeId);
      return tree?.nodes.find(node => node.id === nodeId) || null;
    },

    getActiveBuild: () => {
      const state = get();
      return state.savedBuilds.find(build => build.id === state.activeBuildId) || null;
    },

    getTotalSkillPoints: () => {
      const state = get();
      const treePoints = Object.values(state.trees).reduce(
        (total, tree) => total + tree.availablePoints,
        0
      );
      return state.globalSkillPoints + treePoints;
    },

    getUnlockedTrees: () => {
      const state = get();
      return Object.values(state.trees).filter(tree => tree.isUnlocked);
    },
  }))
);