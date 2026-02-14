// Skill tree configuration
import type { SkillTree, SkillNode, SpecializationPath } from '../types/skillTree';

const sampleNodes: SkillNode[] = [
  {
    id: 'fire_basic_1',
    name: 'Fire Bolt',
    description: 'Launch a bolt of fire at enemies',
    tier: 'basic',
    maxRank: 5,
    currentRank: 0,
    prerequisites: [],
    unlocks: ['fire_basic_2'],
    position: { x: 100, y: 100, tier: 'basic' },
    costs: [{ type: 'skill_points', amount: 1, scaling: 'linear', rankMultiplier: 1 }],
    requirements: [],
    effects: [
      {
        id: 'fire_damage',
        type: 'stat_bonus',
        target: 'enemies',
        value: 10,
        scaling: 'linear',
        isPercentage: false,
        stackable: false,
        description: '+10 Fire Damage',
        displayFormat: 'Fire Damage: +{value}',
      },
    ],
    scaling: { baseValue: 10, perRank: 5, scalingType: 'additive' },
    icon: '🔥',
    color: '#ff4444',
    category: 'offensive',
    tags: ['elemental'],
    isUnlocked: true,
    isLearnable: true,
    isMaxRank: false,
  },
  {
    id: 'fire_basic_2',
    name: 'Enhanced Fire',
    description: 'Increase fire damage',
    tier: 'basic',
    maxRank: 3,
    currentRank: 0,
    prerequisites: [{ type: 'node_rank', nodeId: 'fire_basic_1', minimumRank: 1 }],
    unlocks: [],
    position: { x: 200, y: 100, tier: 'basic' },
    costs: [{ type: 'skill_points', amount: 2, scaling: 'linear', rankMultiplier: 1 }],
    requirements: [],
    effects: [
      {
        id: 'fire_damage_bonus',
        type: 'stat_multiplier',
        target: 'self',
        value: 1.1,
        scaling: 'percentage',
        isPercentage: true,
        stackable: false,
        description: '+10% Fire Damage',
        displayFormat: 'Fire Damage: +{value}%',
      },
    ],
    scaling: { baseValue: 1.1, perRank: 0.05, scalingType: 'multiplicative' },
    icon: '🔥',
    color: '#ff6666',
    category: 'offensive',
    tags: ['elemental'],
    isUnlocked: true,
    isLearnable: false,
    isMaxRank: false,
  },
];

const sampleSpecializations: SpecializationPath[] = [
  {
    id: 'fire_destroyer',
    name: 'Fire Destroyer',
    description: 'Master of destructive fire magic',
    element: 'fire',
    theme: 'destroyer',
    keyNodes: ['fire_basic_1'],
    capstoneNode: 'fire_basic_2',
    branchNodes: [],
    unlockRequirements: [],
    masteryRequirements: [],
    pathBonuses: [],
    synergies: [],
    color: '#ff4444',
    icon: '🔥',
    nodesInPath: 2,
    nodesUnlocked: 0,
    masteryLevel: 'novice',
    conflictsWith: [],
    isExclusive: false,
  },
];

export const skillTrees: SkillTree[] = [
  {
    id: 'fire_tree',
    name: 'Fire Mastery',
    description: 'Harness the power of flames to burn your enemies',
    characterId: 'player-1',
    element: 'fire',
    nodes: sampleNodes,
    connections: [
      {
        fromNode: 'fire_basic_1',
        toNode: 'fire_basic_2',
        connectionType: 'prerequisite',
      },
    ],
    specializations: sampleSpecializations,
    totalNodesUnlocked: 0,
    totalPointsSpent: 0,
    availablePoints: 10,
    maxTier: 'legendary',
    treeLevel: 1,
    masteryLevel: 0,
    unlockRequirements: [],
    isUnlocked: true,
    prestigeLevel: 0,
    resetCount: 0,
    lastReset: 0,
  },
];

export const skillTreeConfig = {
  defaultSkillPoints: 10,
  maxTreeLevel: 100,
  prestigeMultiplier: 1.5,
};

export const skillTreeHelpers = {
  validateSkillTree: () => ({ isValid: true, errors: [] }),
  calculateSkillPoints: (level: number) => level * 2,
  getSkillRequirements: () => [],
  checkPrerequisites: (tree: SkillTree, node: SkillNode) => {
    return node.prerequisites.every(prereq => {
      if (prereq.type === 'node_rank' && prereq.nodeId) {
        const prereqNode = tree.nodes.find(n => n.id === prereq.nodeId);
        return prereqNode ? prereqNode.currentRank >= (prereq.minimumRank || 1) : false;
      }
      return true;
    });
  },
};
