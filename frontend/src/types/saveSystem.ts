// Save System Types for Multiple Save Slots
import type { MagicalGirl } from './magicalGirl';

export interface SaveSystem {
  // Save slots management
  saveSlots: SaveSlot[];
  currentSlotId: string | null;
  maxSaveSlots: number;

  // Auto-save configuration
  autoSaveEnabled: boolean;
  autoSaveInterval: number; // in milliseconds
  lastAutoSave: number;
  autoSaveSlotId: string;

  // Backup and cloud save
  cloudSaveEnabled: boolean;
  lastCloudSync: number;
  cloudSaveConflicts: SaveConflict[];

  // Import/Export
  exportHistory: ExportRecord[];
  importHistory: ImportRecord[];

  // Save validation and integrity
  saveValidation: SaveValidationSettings;
  corruptedSaves: string[];

  // Performance and compression
  compressionEnabled: boolean;
  saveCompression: CompressionSettings;
}

export interface SaveSlot {
  id: string;
  name: string;
  description: string;

  // Save metadata
  createdAt: number;
  lastModified: number;
  lastPlayed: number;
  playtime: number;

  // Game state snapshot
  gameState: GameStateSnapshot;

  // Save slot properties
  isLocked: boolean;
  isProtected: boolean;
  isAutoSave: boolean;
  isCloudSynced: boolean;

  // Thumbnail and preview
  thumbnail?: string;
  previewData: SavePreview;

  // Version and compatibility
  gameVersion: string;
  saveVersion: string;
  isCompatible: boolean;

  // Statistics and achievements
  playStats: PlayStatistics;
  achievements: string[];
  milestones: string[];

  // File information
  fileSize: number;
  checksum: string;
  compressionRatio?: number;
}

export interface GameStateSnapshot {
  // Core game data
  characters: Record<string, MagicalGirl>;
  resources: Record<string, number>;
  progression: Record<string, number | boolean>;

  // Game systems state
  combat: Record<string, number | boolean>;
  formation: Record<string, string | number>;
  skillTrees: Record<string, number | boolean>;
  customization: Record<string, string | number>;
  prestige: Record<string, number | boolean>;

  // UI and settings state
  settings: Record<string, string | number | boolean>;
  notifications: Array<Record<string, string | number | boolean>>;

  // World and environment state
  missions: Record<string, number | boolean>;
  training: Record<string, number | boolean>;
  recruitment: Record<string, number>;
  achievements: Record<string, boolean | number>;

  // Timestamp and session info
  saveTimestamp: number;
  sessionId: string;
  lastActiveCharacter: string;

  // Custom data and mods
  customData: Record<string, string | number | boolean>;
  modData: Record<string, string | number | boolean>;
}

export interface SavePreview {
  // Character information
  mainCharacter: CharacterPreview | null;
  totalCharacters: number;
  highestLevel: number;

  // Progress indicators
  storyProgress: number;
  totalAchievements: number;
  completionPercentage: number;

  // Key statistics
  totalPlaytime: number;
  prestigeLevel: number;
  totalResources: number;

  // Current status
  currentMission: string | null;
  activeFormation: string | null;
  lastActivity: string;

  // Visual elements
  previewImage: string | null;
  characterPortraits: string[];
  backgroundColor: string;
}

export interface CharacterPreview {
  id: string;
  name: string;
  level: number;
  element: string;
  portrait: string;
  outfit: string;
  lastUsed: number;
}

export interface PlayStatistics {
  // Time statistics
  totalPlaytime: number;
  sessionCount: number;
  averageSessionLength: number;
  longestSession: number;

  // Game progress
  levelsGained: number;
  prestigeCount: number;
  rebirthCount: number;

  // Combat statistics
  battlesWon: number;
  battlesLost: number;
  perfectVictories: number;

  // Resource statistics
  totalResourcesEarned: Record<string, number>;
  totalResourcesSpent: Record<string, number>;

  // Achievement progress
  achievementsUnlocked: number;
  milestonesReached: number;
  secretsDiscovered: number;

  // Social and collection
  charactersRecruited: number;
  outfitsCollected: number;
  skillNodesLearned: number;
}

export interface SaveConflict {
  id: string;
  conflictType: ConflictType;
  localSave: SaveSlot;
  cloudSave: SaveSlot;
  detectedAt: number;

  // Conflict resolution
  isResolved: boolean;
  resolution: ConflictResolution | null;
  resolvedAt: number;

  // Conflict details
  conflictDetails: ConflictDetail[];
  affectedSystems: string[];
  dataLoss: DataLossAssessment;
}

export interface ExportRecord {
  id: string;
  exportType: ExportType;
  slotIds: string[];
  exportedAt: number;
  fileSize: number;
  fileName: string;
  isEncrypted: boolean;
  includesMetadata: boolean;
}

export interface ImportRecord {
  id: string;
  importType: ImportType;
  importedAt: number;
  sourceFile: string;
  importedSlots: ImportedSlot[];

  // Import validation
  validationResult: ImportValidation;
  errors: ImportError[];
  warnings: ImportWarning[];

  // Import success/failure
  isSuccessful: boolean;
  failureReason?: string;
}

export interface ImportedSlot {
  originalId: string;
  newId: string;
  originalName: string;
  newName: string;
  importStatus: ImportStatus;
}

export interface SaveValidationSettings {
  enableValidation: boolean;
  strictMode: boolean;
  validateOnSave: boolean;
  validateOnLoad: boolean;

  // Validation checks
  checksumValidation: boolean;
  structureValidation: boolean;
  dataIntegrityCheck: boolean;
  versionCompatibility: boolean;

  // Auto-repair options
  autoRepairEnabled: boolean;
  createBackupBeforeRepair: boolean;
  repairAttemptLimit: number;
}

export interface CompressionSettings {
  algorithm: CompressionAlgorithm;
  compressionLevel: number;
  enableForAutoSave: boolean;
  enableForManualSave: boolean;

  // Compression thresholds
  minimumSizeForCompression: number;
  maximumCompressionTime: number;

  // Performance settings
  useWorkerThread: boolean;
  backgroundCompression: boolean;
}

export interface ConflictDetail {
  field: string;
  localValue: string | number | boolean;
  cloudValue: string | number | boolean;
  importance: ConflictImportance;
  suggestedResolution: ResolutionSuggestion;
}

export interface DataLossAssessment {
  riskLevel: DataLossRisk;
  affectedData: string[];
  recoveryPossible: boolean;
  estimatedLoss: number; // percentage
}

export interface ImportValidation {
  isValid: boolean;
  gameVersionMatch: boolean;
  saveVersionMatch: boolean;
  dataIntegrityOk: boolean;

  // Detailed validation results
  validationChecks: ValidationCheck[];
  compatibilityIssues: CompatibilityIssue[];
  requiredMigrations: string[];
}

export interface ValidationCheck {
  checkType: ValidationType;
  isValid: boolean;
  errorMessage?: string;
  severity: ValidationSeverity;
}

export interface CompatibilityIssue {
  type: CompatibilityType;
  description: string;
  canMigrate: boolean;
  migrationMethod?: string;
  dataLoss: boolean;
}

export interface ImportError {
  type: ErrorType;
  message: string;
  field?: string;
  suggestedFix?: string;
  isFatal: boolean;
}

export interface ImportWarning {
  type: WarningType;
  message: string;
  field?: string;
  canIgnore: boolean;
  recommendation: string;
}

// Enums and Type Unions
export type ConflictType =
  | 'timestamp'
  | 'data_difference'
  | 'version_mismatch'
  | 'structure_change';

export type ConflictResolution =
  | 'use_local'
  | 'use_cloud'
  | 'merge_data'
  | 'create_backup'
  | 'manual_resolve';

export type ConflictImportance = 'low' | 'medium' | 'high' | 'critical';

export type ResolutionSuggestion =
  | 'prefer_local'
  | 'prefer_cloud'
  | 'merge_recommended'
  | 'manual_review';

export type DataLossRisk = 'none' | 'minimal' | 'moderate' | 'high' | 'severe';

export type ExportType =
  | 'single_slot'
  | 'multiple_slots'
  | 'all_slots'
  | 'settings_only'
  | 'progress_only';

export type ImportType = 'full_import' | 'selective_import' | 'merge_import' | 'settings_import';

export type ImportStatus = 'success' | 'partial' | 'failed' | 'skipped';

export type CompressionAlgorithm = 'none' | 'gzip' | 'lz4' | 'brotli' | 'custom';

export type ValidationType =
  | 'checksum'
  | 'structure'
  | 'version'
  | 'data_integrity'
  | 'compatibility';

export type ValidationSeverity = 'info' | 'warning' | 'error' | 'critical';

export type CompatibilityType =
  | 'version_upgrade'
  | 'version_downgrade'
  | 'structure_change'
  | 'missing_data';

export type ErrorType =
  | 'parse_error'
  | 'validation_error'
  | 'compatibility_error'
  | 'corruption_error';

export type WarningType =
  | 'version_difference'
  | 'missing_optional_data'
  | 'deprecated_feature'
  | 'performance_impact';

// Save System Actions
export interface SaveSystemActions {
  // Slot management
  createSaveSlot: (name: string, description?: string) => Promise<string>;
  deleteSaveSlot: (slotId: string) => Promise<boolean>;
  renameSaveSlot: (slotId: string, newName: string) => Promise<boolean>;
  duplicateSaveSlot: (slotId: string, newName?: string) => Promise<string>;

  // Save operations
  saveGame: (slotId: string, description?: string) => Promise<boolean>;
  loadGame: (slotId: string) => Promise<boolean>;
  quickSave: () => Promise<boolean>;
  quickLoad: () => Promise<boolean>;

  // Auto-save management
  enableAutoSave: (interval: number) => void;
  disableAutoSave: () => void;
  performAutoSave: () => Promise<boolean>;

  // Slot protection and locking
  lockSaveSlot: (slotId: string, password?: string) => boolean;
  unlockSaveSlot: (slotId: string, password?: string) => boolean;
  protectSaveSlot: (slotId: string) => boolean;
  unprotectSaveSlot: (slotId: string) => boolean;

  // Import/Export
  exportSave: (slotIds: string[], options: ExportOptions) => Promise<string>;
  importSave: (data: string | File, options: ImportOptions) => Promise<ImportResult>;

  // Cloud save operations
  syncToCloud: (slotId: string) => Promise<boolean>;
  syncFromCloud: (slotId: string) => Promise<boolean>;
  resolveCloudConflict: (conflictId: string, resolution: ConflictResolution) => Promise<boolean>;

  // Validation and repair
  validateSave: (slotId: string) => Promise<ValidationResult>;
  repairSave: (slotId: string) => Promise<RepairResult>;
  verifySaveIntegrity: (slotId: string) => Promise<IntegrityResult>;

  // Backup and recovery
  createBackup: (slotId: string) => Promise<string>;
  restoreFromBackup: (backupId: string, targetSlotId: string) => Promise<boolean>;
  listBackups: () => BackupInfo[];

  // Utilities
  getSavePreview: (slotId: string) => SavePreview | null;
  compareSaves: (slotId1: string, slotId2: string) => SaveComparison;
  optimizeSaveSize: (slotId: string) => Promise<OptimizationResult>;

  // Settings and configuration
  configureSaveSystem: (settings: SaveSystemSettings) => void;
  resetSaveSystem: () => Promise<boolean>;
  migrateSaveFormat: (fromVersion: string, toVersion: string) => Promise<MigrationResult>;
}

// Additional interfaces for save system operations
export interface ExportOptions {
  includeMetadata: boolean;
  includeStatistics: boolean;
  includeSettings: boolean;
  compression: boolean;
  encryption: boolean;
  password?: string;
  format: ExportFormat;
}

export interface ImportOptions {
  allowOverwrite: boolean;
  createNewSlots: boolean;
  mergeData: boolean;
  skipValidation: boolean;
  autoResolveConflicts: boolean;
  defaultSlotPrefix: string;
}

export interface ImportResult {
  success: boolean;
  importedSlots: ImportedSlot[];
  conflicts: SaveConflict[];
  errors: ImportError[];
  warnings: ImportWarning[];
  totalSlotsProcessed: number;
}

export interface ValidationResult {
  isValid: boolean;
  checks: ValidationCheck[];
  errors: ValidationError[];
  canRepair: boolean;
  repairSuggestions: string[];
}

export interface RepairResult {
  success: boolean;
  repairedIssues: string[];
  remainingIssues: string[];
  backupCreated: boolean;
  backupId?: string;
}

export interface IntegrityResult {
  isIntact: boolean;
  checksum: string;
  corruptedSections: string[];
  recoveryPossible: boolean;
  dataLossEstimate: number;
}

export interface BackupInfo {
  id: string;
  originalSlotId: string;
  createdAt: number;
  fileSize: number;
  isAutomatic: boolean;
  description: string;
}

export interface SaveComparison {
  differences: SaveDifference[];
  summary: ComparisonSummary;
  compatibility: CompatibilityAssessment;
}

export interface SaveDifference {
  field: string;
  type: DifferenceType;
  value1: string | number | boolean;
  value2: string | number | boolean;
  importance: DifferenceImportance;
}

export interface ComparisonSummary {
  totalDifferences: number;
  criticalDifferences: number;
  timeDiscrepancy: number;
  progressDiscrepancy: number;
  recommendedChoice: string;
}

export interface CompatibilityAssessment {
  isCompatible: boolean;
  versionDifference: number;
  migrationRequired: boolean;
  dataLossRisk: DataLossRisk;
}

export interface OptimizationResult {
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  removedData: string[];
  optimizationTime: number;
}

export interface SaveSystemSettings {
  maxSaveSlots: number;
  autoSaveInterval: number;
  compressionEnabled: boolean;
  cloudSyncEnabled: boolean;
  validationLevel: ValidationLevel;
  backupRetentionDays: number;
}

export interface MigrationResult {
  success: boolean;
  migratedSlots: string[];
  migrationLog: MigrationLogEntry[];
  errors: MigrationError[];
  backupsCreated: string[];
}

export interface MigrationLogEntry {
  timestamp: number;
  action: string;
  details: string;
  success: boolean;
}

export interface MigrationError {
  slotId: string;
  error: string;
  severity: ErrorSeverity;
  canContinue: boolean;
}

export interface ValidationError {
  type: ErrorType;
  message: string;
  field?: string;
  severity: ValidationSeverity;
  canAutoFix: boolean;
}

export type ExportFormat = 'json' | 'binary' | 'compressed' | 'encrypted';

export type DifferenceType =
  | 'value_change'
  | 'added'
  | 'removed'
  | 'type_change'
  | 'structure_change';

export type DifferenceImportance = 'trivial' | 'minor' | 'major' | 'critical';

export type ValidationLevel = 'basic' | 'standard' | 'strict' | 'paranoid';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

// Save system events
export interface SaveSystemEvent {
  type: SaveEventType;
  slotId?: string;
  timestamp: number;
  data?: Record<string, string | number | boolean>;
}

export type SaveEventType =
  | 'save_created'
  | 'save_loaded'
  | 'save_deleted'
  | 'save_corrupted'
  | 'auto_save_performed'
  | 'cloud_sync_started'
  | 'cloud_sync_completed'
  | 'conflict_detected'
  | 'conflict_resolved'
  | 'backup_created'
  | 'validation_failed'
  | 'repair_attempted'
  | 'import_completed'
  | 'export_completed'
  | 'migration_started'
  | 'migration_completed';
