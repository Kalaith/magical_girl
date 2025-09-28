import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../stores/gameStore";
import type {
  SaveSlot,
  SavePreview,
  ExportOptions,
  ImportOptions,
  BackupInfo,
  SaveComparison,
} from "../../types";

interface SaveSlotCardProps {
  slot: SaveSlot;
  isActive: boolean;
  onSave: (slotId: string) => void;
  onLoad: (slotId: string) => void;
  onDelete: (slotId: string) => void;
  onCompare: (slotId: string) => void;
}

const SaveSlotCard: React.FC<SaveSlotCardProps> = ({
  slot,
  isActive,
  onSave,
  onLoad,
  onDelete,
  onCompare,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <motion.div
      className={`p-4 rounded-lg border-2 transition-all ${
        isActive
          ? "border-blue-500 bg-blue-900 bg-opacity-20"
          : slot.hasData
            ? "border-gray-600 bg-gray-800"
            : "border-gray-700 bg-gray-900 border-dashed"
      }`}
      whileHover={{ scale: 1.02 }}
      layout
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-white">
            {slot.name || `Save Slot ${slot.id}`}
          </h3>
          {slot.hasData && (
            <p className="text-sm text-gray-400">
              {new Date(slot.lastModified).toLocaleString()}
            </p>
          )}
        </div>
        {isActive && (
          <span className="px-2 py-1 bg-green-600 text-white text-xs rounded font-semibold">
            Current
          </span>
        )}
      </div>

      {slot.hasData && slot.preview && (
        <div className="space-y-2 mb-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-400">Level:</span>
              <span className="text-white ml-1">
                {slot.preview.playerLevel}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Playtime:</span>
              <span className="text-white ml-1">
                {formatDuration(slot.preview.playtime)}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Gold:</span>
              <span className="text-yellow-400 ml-1">
                {slot.preview.resources.gold.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Size:</span>
              <span className="text-gray-300 ml-1">
                {formatFileSize(slot.size)}
              </span>
            </div>
          </div>

          {slot.preview.achievements && (
            <div className="text-sm">
              <span className="text-gray-400">Achievements:</span>
              <span className="text-purple-400 ml-1">
                {slot.preview.achievements.unlocked}/
                {slot.preview.achievements.total}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex space-x-2">
        <button
          onClick={() => onSave(slot.id)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-semibold"
        >
          Save
        </button>

        {slot.hasData && (
          <>
            <button
              onClick={() => onLoad(slot.id)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm font-semibold"
            >
              Load
            </button>
            <button
              onClick={() => onCompare(slot.id)}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded text-sm"
            >
              Compare
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm"
            >
              ×
            </button>
          </>
        )}
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div
            className="mt-3 p-3 bg-red-900 bg-opacity-50 rounded border border-red-500"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p className="text-red-300 text-sm mb-2">
              Delete this save permanently?
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  onDelete(slot.id);
                  setShowConfirmDelete(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface BackupCardProps {
  backup: BackupInfo;
  onRestore: (backupId: string) => void;
  onDelete: (backupId: string) => void;
}

const BackupCard: React.FC<BackupCardProps> = ({
  backup,
  onRestore,
  onDelete,
}) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-white">{backup.name}</h4>
        <span className="text-xs text-gray-400">
          {backup.type === "auto" ? "Auto" : "Manual"}
        </span>
      </div>

      <div className="space-y-1 text-sm text-gray-400 mb-3">
        <div>Created: {new Date(backup.createdAt).toLocaleString()}</div>
        <div>Size: {(backup.size / 1024).toFixed(1)} KB</div>
        {backup.description && <div>Note: {backup.description}</div>}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onRestore(backup.id)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
        >
          Restore
        </button>
        <button
          onClick={() => onDelete(backup.id)}
          className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export const SaveSystemPanel: React.FC = () => {
  const {
    saveSystemState,
    saveGame,
    loadGame,
    deleteGame,
    exportSave,
    importSave,
    createBackup,
    restoreBackup,
    deleteBackup,
    compareSaves,
    optimizeSave,
    validateSave,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<
    "saves" | "backups" | "import-export" | "settings"
  >("saves");
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState<SaveComparison | null>(
    null,
  );
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "json",
    compression: true,
    includeSettings: true,
    includeProgress: true,
    includeInventory: true,
  });
  const [importFile, setImportFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = useCallback(
    (slotId: string) => {
      saveGame(slotId);
    },
    [saveGame],
  );

  const handleLoad = useCallback(
    (slotId: string) => {
      loadGame(slotId);
    },
    [loadGame],
  );

  const handleDelete = useCallback(
    (slotId: string) => {
      deleteGame(slotId);
    },
    [deleteGame],
  );

  const handleCompare = useCallback(
    (slotId: string) => {
      const comparison = compareSaves(saveSystemState.currentSlotId, slotId);
      setComparisonData(comparison);
      setShowComparison(true);
    },
    [compareSaves, saveSystemState.currentSlotId],
  );

  const handleExport = useCallback(async () => {
    try {
      const exportData = await exportSave(exportOptions);
      // Create download link
      const blob = new Blob([exportData.data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `magical-girl-save-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  }, [exportSave, exportOptions]);

  const handleImport = useCallback(async () => {
    if (!importFile) return;

    try {
      const text = await importFile.text();
      const options: ImportOptions = {
        mergeStrategy: "replace",
        validateBeforeImport: true,
        createBackup: true,
      };

      await importSave(text, options);
      setImportFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Import failed:", error);
    }
  }, [importSave, importFile]);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setImportFile(file);
      }
    },
    [],
  );

  const saveSlots = saveSystemState.saveSlots || [];
  const backups = saveSystemState.backups || [];

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">Save System</h1>

          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-6">
            {[
              { id: "saves", label: "Save Slots" },
              { id: "backups", label: "Backups" },
              { id: "import-export", label: "Import/Export" },
              { id: "settings", label: "Settings" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as string)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "saves" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Save Slots</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSave(saveSystemState.currentSlotId)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
                >
                  Quick Save
                </button>
                <button
                  onClick={() => createBackup("Manual backup")}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
                >
                  Create Backup
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {saveSlots.map((slot) => (
                <SaveSlotCard
                  key={slot.id}
                  slot={slot}
                  isActive={slot.id === saveSystemState.currentSlotId}
                  onSave={handleSave}
                  onLoad={handleLoad}
                  onDelete={handleDelete}
                  onCompare={handleCompare}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "backups" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Backups</h2>
              <div className="text-sm text-gray-400">
                Auto-backup:{" "}
                {saveSystemState.settings?.autoBackup ? "Enabled" : "Disabled"}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {backups.map((backup) => (
                <BackupCard
                  key={backup.id}
                  backup={backup}
                  onRestore={restoreBackup}
                  onDelete={deleteBackup}
                />
              ))}

              {backups.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400 text-lg">No backups found</p>
                  <p className="text-gray-500 text-sm">
                    Create your first backup to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "import-export" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-6">
              Import & Export
            </h2>

            <div className="space-y-6">
              {/* Export Section */}
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-4">
                  Export Save Data
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeSettings}
                        onChange={(e) =>
                          setExportOptions({
                            ...exportOptions,
                            includeSettings: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                      <span className="text-white">Include Settings</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeProgress}
                        onChange={(e) =>
                          setExportOptions({
                            ...exportOptions,
                            includeProgress: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                      <span className="text-white">Include Progress</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeInventory}
                        onChange={(e) =>
                          setExportOptions({
                            ...exportOptions,
                            includeInventory: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                      <span className="text-white">Include Inventory</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={exportOptions.compression}
                        onChange={(e) =>
                          setExportOptions({
                            ...exportOptions,
                            compression: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                      <span className="text-white">Compress Data</span>
                    </label>
                  </div>

                  <button
                    onClick={handleExport}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-semibold"
                  >
                    Export Save Data
                  </button>
                </div>
              </div>

              {/* Import Section */}
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-4">
                  Import Save Data
                </h3>

                <div className="space-y-4">
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileSelect}
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    />
                  </div>

                  {importFile && (
                    <div className="p-3 bg-gray-700 rounded">
                      <p className="text-white text-sm">
                        Selected: {importFile.name} (
                        {(importFile.size / 1024).toFixed(1)} KB)
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleImport}
                    disabled={!importFile}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded font-semibold"
                  >
                    Import Save Data
                  </button>

                  <div className="text-sm text-gray-400">
                    <p>
                      ⚠️ Importing will create a backup of your current save
                      automatically.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-6">
              Save System Settings
            </h2>

            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Auto-Save
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={saveSystemState.settings?.autoSave}
                        className="rounded"
                      />
                      <span className="text-white">Enable auto-save</span>
                    </label>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Auto-save interval (minutes)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={saveSystemState.settings?.autoSaveInterval || 5}
                        className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 w-24"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Backups
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={saveSystemState.settings?.autoBackup}
                        className="rounded"
                      />
                      <span className="text-white">Enable auto-backup</span>
                    </label>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Maximum backups to keep
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={saveSystemState.settings?.maxBackups || 10}
                        className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 w-24"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Cloud Sync
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={saveSystemState.settings?.cloudSync}
                        className="rounded"
                      />
                      <span className="text-white">
                        Enable cloud synchronization
                      </span>
                    </label>

                    <div className="text-sm text-gray-400">
                      <p>⚠️ Cloud sync requires account registration.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Comparison Modal */}
        <AnimatePresence>
          {showComparison && comparisonData && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowComparison(false)}
            >
              <motion.div
                className="bg-gray-800 p-6 rounded-lg max-w-4xl max-h-96 overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Save Comparison
                </h3>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-400">
                      Current Save
                    </h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(comparisonData.differences).map(
                        ([key, diff]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-400 capitalize">
                              {key}:
                            </span>
                            <span className="text-white">{diff.current}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-400">Other Save</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(comparisonData.differences).map(
                        ([key, diff]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-400 capitalize">
                              {key}:
                            </span>
                            <span className="text-white">{diff.other}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowComparison(false)}
                  className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
