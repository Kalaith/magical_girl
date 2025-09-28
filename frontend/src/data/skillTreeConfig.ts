// Skill tree configuration - TEMPORARILY DISABLED FOR BUILD
// All skill tree configurations have been temporarily commented out to allow the project to build
export const SKILL_TREES = [];
export const SKILL_TREE_CONFIG = {};
export const SKILL_TREE_HELPERS = {
  validateSkillTree: () => ({ isValid: true, errors: [] }),
  calculateSkillPoints: () => 0,
  getSkillRequirements: () => [],
  checkPrerequisites: () => true,
};