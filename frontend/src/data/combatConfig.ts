// Combat system configuration data
import type {
  CombatAction,
  CombatFormation,
  BattleEnvironment,
  BattleCondition,
  CombatReward,
  CombatAI,
  BattleType,
  ActionType,
  TargetingRule
} from '../types/combat';
import type { MagicalGirl } from '../types/magicalGirl';

export const COMBAT_CONFIG = {
  // Basic combat actions available to all characters
  getBasicActions: (character: MagicalGirl): CombatAction[] => [
    {
      id: 'basic_attack',
      name: 'Basic Attack',
      type: 'Attack' as ActionType,
      category: 'Physical',
      description: 'A simple physical attack',
      icon: '⚔️',
      costs: [{ resource: 'mana', amount: 0 }],
      requirements: [],
      effects: [
        {
          type: 'Damage',
          target: 'Target',
          timing: 'Instant',
          calculation: {
            baseValue: 50,
            scalingStat: 'attack',
            scalingPercentage: 100,
            elementalModifier: false,
            criticalModifier: true
          },
          modifiers: [],
          conditions: []
        }
      ],
      targeting: {
        type: 'Single',
        restrictions: [{ type: 'team', value: 'enemy', exclude: false }],
        autoTarget: false,
        requiresLineOfSight: true
      },
      animation: {
        type: 'Melee',
        duration: 1000,
        effects: [],
        sound: 'attack_basic.mp3'
      },
      cooldown: 0,
      currentCooldown: 0,
      uses: 0,
      castTime: 0,
      range: 1,
      priority: 1,
      interruptible: false,
      channeled: false
    },
    {
      id: 'defend',
      name: 'Defend',
      type: 'Special' as ActionType,
      category: 'Utility',
      description: 'Reduces incoming damage and builds energy',
      icon: '🛡️',
      costs: [],
      requirements: [],
      effects: [
        {
          type: 'Status',
          target: 'Self',
          timing: 'Instant',
          calculation: {
            baseValue: 50,
            scalingStat: 'defense',
            scalingPercentage: 50
          },
          modifiers: [],
          conditions: []
        }
      ],
      targeting: {
        type: 'Self',
        restrictions: [],
        autoTarget: true
      },
      animation: {
        type: 'Instant',
        duration: 500,
        effects: [
          {
            type: 'Flash',
            target: 'caster',
            intensity: 0.3,
            duration: 500
          }
        ]
      },
      cooldown: 0,
      currentCooldown: 0,
      uses: 0,
      castTime: 0,
      range: 0,
      priority: 2,
      interruptible: false,
      channeled: false
    },
    {
      id: 'elemental_blast',
      name: `${character.element} Blast`,
      type: 'Spell' as ActionType,
      category: 'Magical',
      description: `Unleashes a blast of ${character.element.toLowerCase()} energy`,
      icon: getElementIcon(character.element),
      costs: [{ resource: 'mana', amount: 20 }],
      requirements: [],
      effects: [
        {
          type: 'Damage',
          target: 'Target',
          timing: 'Instant',
          calculation: {
            baseValue: 80,
            scalingStat: 'elementalPower',
            scalingPercentage: 120,
            elementalModifier: true,
            criticalModifier: true
          },
          modifiers: [],
          conditions: []
        }
      ],
      targeting: {
        type: 'Single',
        restrictions: [{ type: 'team', value: 'enemy', exclude: false }],
        autoTarget: false,
        requiresLineOfSight: true
      },
      animation: {
        type: 'Projectile',
        duration: 1500,
        effects: [
          {
            type: 'Flash',
            target: 'target',
            intensity: 0.8,
            duration: 200
          }
        ],
        particles: [
          {
            type: character.element.toLowerCase(),
            count: 15,
            duration: 1000,
            position: 'path'
          }
        ]
      },
      cooldown: 2,
      currentCooldown: 0,
      uses: 0,
      castTime: 1000,
      range: 3,
      priority: 3,
      interruptible: true,
      channeled: false
    }
  ],

  // Default formations
  defaultFormations: [
    {
      id: 'balanced',
      name: 'Balanced Formation',
      description: 'A well-rounded formation suitable for most situations',
      positions: [
        { row: 1, column: 2, role: 'Tank', modifiers: [{ type: 'defense', value: 10, source: 'formation' }], restrictions: [] },
        { row: 2, column: 1, role: 'Damage', modifiers: [{ type: 'damage', value: 5, source: 'formation' }], restrictions: [] },
        { row: 2, column: 3, role: 'Damage', modifiers: [{ type: 'damage', value: 5, source: 'formation' }], restrictions: [] },
        { row: 3, column: 2, role: 'Support', modifiers: [{ type: 'speed', value: 5, source: 'formation' }], restrictions: [] }
      ],
      bonuses: [
        {
          name: 'Balanced Tactics',
          description: 'All stats increased by 5%',
          condition: 'full_formation',
          effect: [
            { stat: 'attack', modification: 5, type: 'percentage', operation: 'add' },
            { stat: 'defense', modification: 5, type: 'percentage', operation: 'add' },
            { stat: 'speed', modification: 5, type: 'percentage', operation: 'add' }
          ],
          stackable: false
        }
      ],
      requirements: [],
      isDefault: true,
      isUnlocked: true,
      category: 'Balanced'
    },
    {
      id: 'offensive',
      name: 'Offensive Formation',
      description: 'Maximizes damage output at the cost of defense',
      positions: [
        { row: 1, column: 1, role: 'Damage', modifiers: [{ type: 'damage', value: 15, source: 'formation' }], restrictions: [] },
        { row: 1, column: 3, role: 'Damage', modifiers: [{ type: 'damage', value: 15, source: 'formation' }], restrictions: [] },
        { row: 2, column: 2, role: 'Damage', modifiers: [{ type: 'damage', value: 20, source: 'formation' }], restrictions: [] },
        { row: 3, column: 2, role: 'Support', modifiers: [{ type: 'speed', value: 10, source: 'formation' }], restrictions: [] }
      ],
      bonuses: [
        {
          name: 'All-Out Attack',
          description: 'Increased damage but reduced defense',
          condition: 'full_formation',
          effect: [
            { stat: 'attack', modification: 20, type: 'percentage', operation: 'add' },
            { stat: 'criticalRate', modification: 10, type: 'flat', operation: 'add' },
            { stat: 'defense', modification: -10, type: 'percentage', operation: 'add' }
          ],
          stackable: false
        }
      ],
      requirements: [],
      isDefault: true,
      isUnlocked: true,
      category: 'Offensive'
    },
    {
      id: 'defensive',
      name: 'Defensive Formation',
      description: 'Focuses on survival and protection',
      positions: [
        { row: 1, column: 2, role: 'Tank', modifiers: [{ type: 'defense', value: 25, source: 'formation' }], restrictions: [] },
        { row: 2, column: 1, role: 'Tank', modifiers: [{ type: 'defense', value: 15, source: 'formation' }], restrictions: [] },
        { row: 2, column: 3, role: 'Tank', modifiers: [{ type: 'defense', value: 15, source: 'formation' }], restrictions: [] },
        { row: 3, column: 2, role: 'Healer', modifiers: [{ type: 'speed', value: 10, source: 'formation' }], restrictions: [] }
      ],
      bonuses: [
        {
          name: 'Fortress Defense',
          description: 'Greatly increased defense and healing',
          condition: 'full_formation',
          effect: [
            { stat: 'defense', modification: 30, type: 'percentage', operation: 'add' },
            { stat: 'health', modification: 20, type: 'percentage', operation: 'add' }
          ],
          stackable: false
        }
      ],
      requirements: [],
      isDefault: true,
      isUnlocked: true,
      category: 'Defensive'
    }
  ] as CombatFormation[],

  // Battle environments
  getEnvironment: (environmentId: string): BattleEnvironment => {
    const environments = {
      default: {
        id: 'default',
        name: 'Training Grounds',
        description: 'A neutral training area with no special effects',
        type: 'Arena' as const,
        weather: { type: 'Clear' as const, intensity: 0, effects: [] },
        terrain: 'Flat' as const,
        lighting: 'Normal' as const,
        magicalField: 'Neutral' as const,
        effects: [],
        hazards: [],
        bonuses: [],
        background: '/images/environments/training_grounds.jpg'
      },
      city: {
        id: 'city',
        name: 'Urban Battlefield',
        description: 'A city street with buildings providing cover',
        type: 'City' as const,
        weather: { type: 'Clear' as const, intensity: 0, effects: [] },
        terrain: 'Flat' as const,
        lighting: 'Normal' as const,
        magicalField: 'Neutral' as const,
        effects: [
          {
            name: 'Urban Cover',
            description: 'Buildings provide cover, increasing evasion',
            trigger: 'passive',
            effect: [{ stat: 'evasion', modification: 10, type: 'flat', operation: 'add' }],
            probability: 100
          }
        ],
        hazards: [],
        bonuses: [],
        background: '/images/environments/city_street.jpg'
      },
      forest: {
        id: 'forest',
        name: 'Magical Forest',
        description: 'An enchanted forest that amplifies nature magic',
        type: 'Forest' as const,
        weather: { type: 'Clear' as const, intensity: 0, effects: [] },
        terrain: 'Hills' as const,
        lighting: 'Dim' as const,
        magicalField: 'Elemental' as const,
        effects: [
          {
            name: 'Nature\'s Blessing',
            description: 'Nature element abilities are enhanced',
            trigger: 'on_nature_ability',
            effect: [{ stat: 'elementalPower', modification: 25, type: 'percentage', operation: 'add' }],
            probability: 100
          }
        ],
        hazards: [],
        bonuses: [
          {
            name: 'Forest Harmony',
            description: 'Characters with Nature element gain regeneration',
            condition: 'element_nature',
            effect: [{ stat: 'health', modification: 5, type: 'flat', operation: 'add' }],
            targets: 'all'
          }
        ],
        background: '/images/environments/magical_forest.jpg'
      }
    };

    return environments[environmentId as keyof typeof environments] || environments.default;
  },

  // Victory conditions based on battle type
  getVictoryConditions: (battleType: BattleType): BattleCondition[] => {
    const baseConditions: BattleCondition[] = [
      {
        id: 'enemy_defeat',
        name: 'Defeat All Enemies',
        description: 'Win by defeating all enemy characters',
        type: 'Victory',
        condition: 'all_enemies_defeated',
        priority: 1,
        hidden: false,
        checkTiming: 'EndTurn'
      },
      {
        id: 'player_defeat',
        name: 'All Allies Defeated',
        description: 'Lose if all player characters are defeated',
        type: 'Defeat',
        condition: 'all_allies_defeated',
        priority: 1,
        hidden: false,
        checkTiming: 'EndTurn'
      },
      {
        id: 'turn_limit',
        name: 'Turn Limit Reached',
        description: 'Battle ends in a draw if turn limit is reached',
        type: 'Special',
        condition: 'turn_limit_reached',
        priority: 2,
        hidden: false,
        checkTiming: 'StartTurn'
      }
    ];

    // Add type-specific conditions
    switch (battleType) {
      case 'Boss':
        baseConditions.push({
          id: 'boss_special',
          name: 'Boss Enrage',
          description: 'Boss becomes enraged after 20 turns',
          type: 'Special',
          condition: 'turn_count_20',
          priority: 3,
          hidden: true,
          checkTiming: 'StartTurn'
        });
        break;
      case 'Training':
        baseConditions.push({
          id: 'training_survival',
          name: 'Survive Training',
          description: 'Survive for 10 turns to win',
          type: 'Victory',
          condition: 'survive_10_turns',
          priority: 2,
          hidden: false,
          checkTiming: 'StartTurn'
        });
        break;
    }

    return baseConditions;
  },

  // Battle rewards based on type
  getBattleRewards: (battleType: BattleType): CombatReward[] => {
    const baseRewards: CombatReward[] = [
      {
        type: 'Experience',
        amount: 100,
        description: 'Base experience for participating in battle'
      },
      {
        type: 'Currency',
        amount: 50,
        description: 'Sparkles earned from victory'
      }
    ];

    // Add type-specific rewards
    switch (battleType) {
      case 'Boss':
        baseRewards.push(
          {
            type: 'Experience',
            amount: 200,
            bonus: 100,
            description: 'Bonus experience for defeating a boss'
          },
          {
            type: 'Item',
            item: 'rare_crystal',
            rarity: 'epic',
            description: 'Rare crystal from boss victory'
          }
        );
        break;
      case 'Training':
        baseRewards.push({
          type: 'Experience',
          amount: 25,
          description: 'Training experience'
        });
        break;
      case 'Arena':
        baseRewards.push({
          type: 'Currency',
          amount: 100,
          description: 'Arena victory bonus'
        });
        break;
    }

    return baseRewards;
  },

  // Default AI configuration
  getDefaultAI: (character: MagicalGirl): CombatAI => ({
    type: 'Balanced',
    difficulty: 'Normal',
    personality: {
      aggression: 50,
      caution: 50,
      cooperation: 50,
      adaptability: 50,
      focus: 50
    },
    priorities: [
      {
        condition: 'health_low',
        weight: 100,
        actions: ['heal', 'defend']
      },
      {
        condition: 'enemy_low_health',
        weight: 80,
        actions: ['attack', 'ability']
      },
      {
        condition: 'default',
        weight: 50,
        actions: ['attack', 'ability', 'defend']
      }
    ],
    behaviors: [
      {
        trigger: 'turn_start',
        probability: 30,
        actions: ['assess_situation']
      },
      {
        trigger: 'ally_defeated',
        probability: 70,
        actions: ['aggressive_mode'],
        cooldown: 3
      }
    ],
    reactions: [
      {
        event: 'take_damage',
        condition: 'health_below_30',
        response: ['defensive_mode'],
        probability: 80
      },
      {
        event: 'ally_healed',
        response: ['focus_healer'],
        probability: 60
      }
    ],
    knowledge: {
      playerPatterns: [],
      effectiveStrategies: [],
      threats: [],
      opportunities: []
    }
  }),

  // Element advantages and icons
  elementAdvantages: {
    'Fire': ['Ice', 'Nature'],
    'Water': ['Fire', 'Earth'],
    'Earth': ['Lightning', 'Air'],
    'Air': ['Earth', 'Crystal'],
    'Ice': ['Water', 'Nature'],
    'Lightning': ['Water', 'Air'],
    'Light': ['Darkness', 'Void'],
    'Darkness': ['Light', 'Celestial'],
    'Nature': ['Earth', 'Crystal'],
    'Celestial': ['Darkness', 'Void'],
    'Void': ['Light', 'Celestial'],
    'Crystal': ['Nature', 'Fire']
  },

  // Combat formulas
  formulas: {
    damageCalculation: (baseDamage: number, attack: number, defense: number, modifiers: number = 1): number => {
      return Math.max(1, Math.floor((baseDamage + attack - defense / 2) * modifiers));
    },

    criticalChance: (baseCrit: number, luck: number): number => {
      return Math.min(95, baseCrit + luck / 10);
    },

    hitChance: (accuracy: number, evasion: number): number => {
      return Math.max(5, Math.min(95, accuracy - evasion));
    },

    speedToInitiative: (speed: number): number => {
      return speed + Math.random() * 20;
    },

    experienceGain: (baseExp: number, levelDifference: number): number => {
      const multiplier = Math.max(0.1, 1 + (levelDifference * 0.1));
      return Math.floor(baseExp * multiplier);
    }
  },

  // Combat constants
  constants: {
    MAX_TURN_TIME: 30000, // 30 seconds
    DEFAULT_CRIT_DAMAGE: 150, // 150% damage
    MAX_STATUS_STACKS: 10,
    BASE_HIT_CHANCE: 85,
    BASE_CRIT_CHANCE: 5,
    TRANSFORMATION_DURATION: 5, // turns
    MAX_BATTLE_TURNS: 50
  }
};

// Helper function to get element icon
function getElementIcon(element: string): string {
  const icons: { [key: string]: string } = {
    'Fire': '🔥',
    'Water': '💧',
    'Earth': '🌱',
    'Air': '💨',
    'Ice': '❄️',
    'Lightning': '⚡',
    'Light': '☀️',
    'Darkness': '🌙',
    'Nature': '🌿',
    'Celestial': '⭐',
    'Void': '🌌',
    'Crystal': '💎'
  };
  return icons[element] || '✨';
}

// Combat utility functions
export const COMBAT_UTILS = {
  calculateElementalDamage: (attackerElement: string, targetElement: string, baseDamage: number): number => {
    const advantages = COMBAT_CONFIG.elementAdvantages[attackerElement as keyof typeof COMBAT_CONFIG.elementAdvantages] || [];

    if (advantages.includes(targetElement)) {
      return Math.floor(baseDamage * 1.5); // 50% bonus damage
    }

    // Check if target has advantage over attacker
    const targetAdvantages = COMBAT_CONFIG.elementAdvantages[targetElement as keyof typeof COMBAT_CONFIG.elementAdvantages] || [];
    if (targetAdvantages.includes(attackerElement)) {
      return Math.floor(baseDamage * 0.75); // 25% reduced damage
    }

    return baseDamage; // Neutral damage
  },

  getValidTargets: (targeting: TargetingRule, caster: any, allParticipants: any[]): any[] => {
    // Simplified target selection
    return allParticipants.filter(p => {
      if (targeting.type === 'Self') return p.id === caster.id;
      if (targeting.restrictions.some(r => r.type === 'team')) {
        const teamRestriction = targeting.restrictions.find(r => r.type === 'team');
        if (teamRestriction?.value === 'enemy') {
          return p.position.team !== caster.position.team;
        }
        if (teamRestriction?.value === 'ally') {
          return p.position.team === caster.position.team;
        }
      }
      return true;
    });
  },

  calculateDistance: (pos1: { row: number; column: number }, pos2: { row: number; column: number }): number => {
    return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.column - pos2.column);
  },

  isInRange: (caster: any, target: any, range: number): boolean => {
    const distance = COMBAT_UTILS.calculateDistance(caster.position, target.position);
    return distance <= range;
  },

  generateCombatId: (): string => {
    return `combat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};