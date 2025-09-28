import React, { useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useGameStore } from "../../stores/gameStore";

export const SaveSystemPanel: React.FC = () => {
  const [saveSlots] = useState([
    { id: 1, name: "Auto Save", date: new Date().toLocaleString(), auto: true },
    { id: 2, name: "Manual Save 1", date: "2024-01-15 10:30", auto: false },
    { id: 3, name: "Manual Save 2", date: "2024-01-14 16:45", auto: false },
  ]);

  const handleSave = () => {
    // In a real implementation, this would save the game state
    console.log("Game saved!");
  };

  const handleLoad = (slotId: number) => {
    // In a real implementation, this would load the game state
    console.log(`Loading save slot ${slotId}`);
  };

  const handleExport = () => {
    // Export save data as JSON
    const gameState = useGameStore.getState();
    const saveData = JSON.stringify(gameState, null, 2);
    const blob = new Blob([saveData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'magical-girl-save.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-magical-primary mb-2">
          Save System
        </h1>
        <p className="text-gray-600">
          Manage your game saves and backup your progress
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleSave}
            >
              💾 Save Game
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleExport}
            >
              📤 Export Save Data
            </Button>
            <label className="block">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => document.getElementById('importFile')?.click()}
              >
                📥 Import Save Data
              </Button>
              <input
                id="importFile"
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const saveData = JSON.parse(event.target?.result as string);
                        console.log("Import save data:", saveData);
                        // In a real implementation, this would load the imported data
                      } catch (error) {
                        console.error("Invalid save file");
                      }
                    };
                    reader.readAsText(file);
                  }
                }}
              />
            </label>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Save Slots</h3>
          <div className="space-y-3">
            {saveSlots.map((slot) => (
              <div
                key={slot.id}
                className="border rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-2">
                    {slot.name}
                    {slot.auto && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        AUTO
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{slot.date}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleLoad(slot.id)}
                  >
                    Load
                  </Button>
                  {!slot.auto && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Auto-Save Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Enable Auto-Save</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span>Auto-Save Interval</span>
            <select className="border rounded px-3 py-1">
              <option value="1">Every 1 minute</option>
              <option value="5" defaultValue="">Every 5 minutes</option>
              <option value="10">Every 10 minutes</option>
              <option value="30">Every 30 minutes</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
};