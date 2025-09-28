import type {
  Formation,
  ElementalSynergy,
  SynergyTier,
  FormationTemplate,
  PositionRole,
  MagicalElement
} from '../types/formation';

// Default formation templates
export const FORMATION_TEMPLATES: FormationTemplate[] = [
  {
    id: 'balanced_3x3',
    name: 'Balanced Formation',
    description: 'A well-rounded formation suitable for most encounters',
    gridSize: { rows: 3, columns: 3 },
    recommendedSize: 5,
    positions: [
      { row: 0, col: 1, role: 'frontline', priority: 1 },
      { row: 1, col: 0, role: 'support', priority: 3 },
      { row: 1, col: 1, role: 'tank', priority: 1 },
      { row: 1, col: 2, role: 'support', priority: 3 },
      { row: 2, col: 1, role: 'backline', priority: 2 }
    ],
    bonuses: [
      {
        type: 'stat_bonus',
        target: 'all',
        value: 5,
        stat: 'defense'
      }
    ],
    unlockRequirements: [],
    category: 'basic'
  },
  {
    id: 'offensive_spear',
    name: 'Spear Formation',
    description: 'Aggressive formation focused on breaking enemy lines',
    gridSize: { rows: 4, columns: 3 },
    recommendedSize: 6,
    positions: [
      { row: 0, col: 1, role: 'frontline', priority: 1 },
      { row: 1, col: 0, role: 'frontline', priority: 2 },
      { row: 1, col: 1, role: 'tank', priority: 1 },
      { row: 1, col: 2, role: 'frontline', priority: 2 },
      { row: 2, col: 1, role: 'support', priority: 3 },
      { row: 3, col: 1, role: 'backline', priority: 2 }
    ],
    bonuses: [
      {
        type: 'stat_bonus',
        target: 'frontline',
        value: 15,
        stat: 'attack'
      },
      {
        type: 'stat_bonus',
        target: 'all',
        value: -5,
        stat: 'defense'
      }
    ],
    unlockRequirements: [
      { type: 'level', value: 10 }
    ],
    category: 'offensive'
  },
  {
    id: 'defensive_wall',
    name: 'Wall Formation',
    description: 'Defensive formation that maximizes protection',
    gridSize: { rows: 3, columns: 4 },
    recommendedSize: 7,
    positions: [
      { row: 0, col: 0, role: 'tank', priority: 1 },
      { row: 0, col: 1, role: 'tank', priority: 1 },
      { row: 0, col: 2, role: 'tank', priority: 1 },
      { row: 0, col: 3, role: 'frontline', priority: 2 },
      { row: 1, col: 1, role: 'support', priority: 3 },
      { row: 1, col: 2, role: 'support', priority: 3 },
      { row: 2, col: 1, role: 'backline', priority: 2 }
    ],
    bonuses: [
      {
        type: 'stat_bonus',
        target: 'tank',
        value: 25,
        stat: 'defense'
      },
      {
        type: 'stat_bonus',
        target: 'all',
        value: 10,
        stat: 'health'
      }
    ],
    unlockRequirements: [
      { type: 'level', value: 15 }
    ],
    category: 'defensive'
  },
  {
    id: 'elemental_circle',
    name: 'Elemental Circle',
    description: 'Formation that maximizes elemental synergies',
    gridSize: { rows: 3, columns: 3 },
    recommendedSize: 5,
    positions: [
      { row: 0, col: 1, role: 'frontline', priority: 2 },
      { row: 1, col: 0, role: 'support', priority: 3 },
      { row: 1, col: 1, role: 'tank', priority: 1 },
      { row: 1, col: 2, role: 'support', priority: 3 },
      { row: 2, col: 1, role: 'backline', priority: 2 }
    ],
    bonuses: [
      {
        type: 'synergy_amplifier',
        target: 'all',
        value: 50,
        synergyType: 'elemental'
      }
    ],
    unlockRequirements: [
      { type: 'level', value: 20 },
      { type: 'synergy_mastery', element: 'fire', tier: 'advanced' }
    ],
    category: 'synergy'
  },
  {
    id: 'support_star',
    name: 'Star Formation',
    description: 'Formation optimized for support and healing',
    gridSize: { rows: 3, columns: 3 },
    recommendedSize: 6,
    positions: [
      { row: 0, col: 1, role: 'frontline', priority: 2 },
      { row: 1, col: 0, role: 'support', priority: 1 },
      { row: 1, col: 1, role: 'support', priority: 1 },
      { row: 1, col: 2, role: 'support', priority: 1 },
      { row: 2, col: 0, role: 'backline', priority: 3 },
      { row: 2, col: 2, role: 'backline', priority: 3 }
    ],
    bonuses: [
      {
        type: 'stat_bonus',
        target: 'support',
        value: 30,
        stat: 'magical_power'
      },
      {
        type: 'ability_enhancement',
        target: 'support',
        abilityType: 'healing',
        value: 25
      }
    ],
    unlockRequirements: [
      { type: 'level', value: 25 }
    ],
    category: 'support'
  }
];

// Elemental synergy definitions
export const ELEMENTAL_SYNERGIES: ElementalSynergy[] = [
  // Basic Elemental Synergies
  {
    id: 'fire_water_steam',
    name: 'Steam Eruption',
    description: 'Fire and Water combine to create scalding steam attacks',
    elements: ['fire', 'water'],
    tier: 'basic',
    requirements: {
      minParticipants: 2,
      maxDistance: 2,
      formations: []
    },
    effects: [
      {
        type: 'damage_bonus',
        target: 'enemy_area',
        value: 25,
        duration: 3
      },
      {
        type: 'status_effect',
        target: 'enemy_area',
        effect: 'burn',
        chance: 60,
        duration: 2
      }
    ],
    cost: {
      mp: 20,
      stamina: 15
    },
    cooldown: 3
  },
  {
    id: 'earth_air_sandstorm',
    name: 'Sandstorm Vortex',
    description: 'Earth and Air create a blinding sandstorm',
    elements: ['earth', 'air'],
    tier: 'basic',
    requirements: {
      minParticipants: 2,
      maxDistance: 3,
      formations: []
    },
    effects: [
      {
        type: 'status_effect',
        target: 'enemy_all',
        effect: 'blind',
        chance: 80,
        duration: 2
      },
      {
        type: 'stat_debuff',
        target: 'enemy_all',
        stat: 'accuracy',
        value: 30,
        duration: 3
      }
    ],
    cost: {
      mp: 18,
      stamina: 12
    },
    cooldown: 4
  },
  {
    id: 'lightning_water_electrify',
    name: 'Electrified Waters',
    description: 'Lightning and Water create widespread electrical damage',
    elements: ['lightning', 'water'],
    tier: 'basic',
    requirements: {
      minParticipants: 2,
      maxDistance: 2,
      formations: []
    },
    effects: [
      {
        type: 'damage_bonus',
        target: 'enemy_all',
        value: 20,
        duration: 1
      },
      {
        type: 'status_effect',
        target: 'enemy_all',
        effect: 'paralysis',
        chance: 40,
        duration: 1
      }
    ],
    cost: {
      mp: 22,
      stamina: 18
    },
    cooldown: 3
  },

  // Advanced Elemental Synergies
  {
    id: 'fire_earth_volcano',
    name: 'Volcanic Eruption',
    description: 'Fire and Earth combine for devastating volcanic power',
    elements: ['fire', 'earth'],
    tier: 'advanced',
    requirements: {
      minParticipants: 2,
      maxDistance: 1,
      formations: ['elemental_circle']
    },
    effects: [
      {
        type: 'damage_bonus',
        target: 'enemy_all',
        value: 40,
        duration: 1
      },
      {
        type: 'terrain_effect',
        target: 'battlefield',
        effect: 'lava_field',
        duration: 5
      },
      {
        type: 'status_effect',
        target: 'enemy_all',
        effect: 'burn',
        chance: 90,
        duration: 3
      }
    ],
    cost: {
      mp: 35,
      stamina: 25
    },
    cooldown: 6
  },
  {
    id: 'ice_air_blizzard',
    name: 'Absolute Blizzard',
    description: 'Ice and Air create a freezing blizzard',
    elements: ['ice', 'air'],
    tier: 'advanced',
    requirements: {
      minParticipants: 2,
      maxDistance: 2,
      formations: []
    },
    effects: [
      {
        type: 'damage_bonus',
        target: 'enemy_all',
        value: 35,
        duration: 2
      },
      {
        type: 'status_effect',
        target: 'enemy_all',
        effect: 'freeze',
        chance: 70,
        duration: 2
      },
      {
        type: 'stat_debuff',
        target: 'enemy_all',
        stat: 'speed',
        value: 50,
        duration: 4
      }
    ],
    cost: {
      mp: 30,
      stamina: 20
    },
    cooldown: 5
  },

  // Master Elemental Synergies
  {
    id: 'trinity_fire_water_earth',
    name: 'Primordial Trinity',
    description: 'The three primal elements unite in devastating harmony',
    elements: ['fire', 'water', 'earth'],
    tier: 'master',
    requirements: {
      minParticipants: 3,
      maxDistance: 2,
      formations: ['elemental_circle']
    },
    effects: [
      {
        type: 'damage_bonus',
        target: 'enemy_all',
        value: 60,
        duration: 1
      },
      {
        type: 'healing',
        target: 'ally_all',
        value: 30,
        duration: 1
      },
      {
        type: 'stat_buff',
        target: 'ally_all',
        stat: 'all_stats',
        value: 25,
        duration: 5
      }
    ],
    cost: {
      mp: 50,
      stamina: 35
    },
    cooldown: 8
  },
  {
    id: 'celestial_light_dark',
    name: 'Celestial Balance',
    description: 'Light and Dark elements achieve perfect harmony',
    elements: ['light', 'dark'],
    tier: 'master',
    requirements: {
      minParticipants: 2,
      maxDistance: 1,
      formations: ['elemental_circle', 'support_star']
    },
    effects: [
      {
        type: 'damage_bonus',
        target: 'enemy_all',
        value: 50,
        duration: 1
      },
      {
        type: 'purification',
        target: 'ally_all',
        effect: 'all_debuffs',
        duration: 1
      },
      {
        type: 'protection',
        target: 'ally_all',
        value: 40,
        duration: 3
      }
    ],
    cost: {
      mp: 45,
      stamina: 30
    },
    cooldown: 7
  },

  // Legendary Elemental Synergies
  {
    id: 'ultimate_convergence',
    name: 'Ultimate Convergence',
    description: 'All elements unite in the ultimate magical combination',
    elements: ['fire', 'water', 'earth', 'air', 'lightning', 'ice', 'light', 'dark'],
    tier: 'legendary',
    requirements: {
      minParticipants: 6,
      maxDistance: 3,
      formations: ['elemental_circle']
    },
    effects: [
      {
        type: 'damage_bonus',
        target: 'enemy_all',
        value: 100,
        duration: 1
      },
      {
        type: 'full_heal',
        target: 'ally_all',
        duration: 1
      },
      {
        type: 'stat_buff',
        target: 'ally_all',
        stat: 'all_stats',
        value: 50,
        duration: 10
      },
      {
        type: 'ultimate_protection',
        target: 'ally_all',
        value: 80,
        duration: 5
      }
    ],
    cost: {
      mp: 100,
      stamina: 80
    },
    cooldown: 15
  }
];

// Position role definitions
export const POSITION_ROLES: Record<PositionRole, {
  name: string;
  description: string;
  bonuses: string[];
  penalties: string[];
}> = {
  tank: {
    name: 'Tank',
    description: 'Front-line defender who absorbs damage',
    bonuses: ['+20% Defense', '+15% Health', 'Taunt abilities'],
    penalties: ['-10% Speed', 'Limited range']
  },
  frontline: {
    name: 'Frontline Fighter',
    description: 'Aggressive melee combatant',
    bonuses: ['+15% Attack', '+10% Critical Hit', 'Counter-attack chance'],
    penalties: ['-5% Magical Defense', 'Vulnerable to area attacks']
  },
  support: {
    name: 'Support',
    description: 'Provides buffs, healing, and utility',
    bonuses: ['+25% Magical Power', '+20% Healing', 'Buff duration'],
    penalties: ['-15% Physical Defense', 'Lower health']
  },
  backline: {
    name: 'Backline',
    description: 'Long-range damage dealer and specialist',
    bonuses: ['+20% Range', '+15% Spell Power', 'Evasion bonus'],
    penalties: ['-20% Physical Defense', 'Vulnerable if reached']
  }
};

// Formation effectiveness matrix
export const FORMATION_EFFECTIVENESS: Record<string, Record<string, number>> = {
  'balanced_3x3': {
    'balanced_3x3': 1.0,
    'offensive_spear': 0.9,
    'defensive_wall': 1.1,
    'elemental_circle': 1.0,
    'support_star': 1.05
  },
  'offensive_spear': {
    'balanced_3x3': 1.1,
    'offensive_spear': 1.0,
    'defensive_wall': 0.8,
    'elemental_circle': 1.2,
    'support_star': 1.3
  },
  'defensive_wall': {
    'balanced_3x3': 0.9,
    'offensive_spear': 1.2,
    'defensive_wall': 1.0,
    'elemental_circle': 0.95,
    'support_star': 0.9
  },
  'elemental_circle': {
    'balanced_3x3': 1.0,
    'offensive_spear': 0.8,
    'defensive_wall': 1.05,
    'elemental_circle': 1.0,
    'support_star': 1.1
  },
  'support_star': {
    'balanced_3x3': 0.95,
    'offensive_spear': 0.7,
    'defensive_wall': 1.1,
    'elemental_circle': 0.9,
    'support_star': 1.0
  }
};

// Synergy tier progression requirements
export const SYNERGY_TIER_REQUIREMENTS: Record<SynergyTier, {
  usageCount: number;
  successRate: number;
  participantLevel: number;
  specialRequirements?: string[];
}> = {
  basic: {
    usageCount: 0,
    successRate: 0,
    participantLevel: 1
  },
  advanced: {
    usageCount: 25,
    successRate: 75,
    participantLevel: 15,
    specialRequirements: ['Formation mastery: Basic']
  },
  master: {
    usageCount: 100,
    successRate: 85,
    participantLevel: 30,
    specialRequirements: ['Formation mastery: Advanced', 'Elemental mastery: Advanced']
  },
  legendary: {
    usageCount: 500,
    successRate: 95,
    participantLevel: 50,
    specialRequirements: [
      'Formation mastery: Master',
      'Elemental mastery: Master',
      'Perfect synergy achievement'
    ]
  }
};

// Default formation for new players
export const DEFAULT_FORMATION: Formation = {
  id: 'starter_formation',
  name: 'Starter Formation',
  description: 'Basic formation for new magical girls',
  template: 'balanced_3x3',
  participants: [],
  gridSize: { rows: 3, columns: 3 },
  positions: [
    {
      row: 1,
      col: 1,
      participantId: null,
      role: 'tank',
      bonuses: []
    }
  ],
  synergies: [],
  effectiveness: 1.0,
  bonuses: [],
  createdAt: Date.now(),
  lastUsed: Date.now(),
  victories: 0,
  defeats: 0
};