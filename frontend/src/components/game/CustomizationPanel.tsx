import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  OutfitPiece,
  Accessory,
  SavedOutfit,
  OutfitCategory,
  AccessoryCategory,
} from "../../types";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  label,
}) => {
  const presetColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
    "#F8C471",
    "#82E0AA",
    "#F1948A",
    "#85929E",
    "#D5A6BD",
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-400">{label}</label>
      <div className="flex flex-wrap gap-2">
        {presetColors.map((presetColor) => (
          <button
            key={presetColor}
            onClick={() => onChange(presetColor)}
            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
              color === presetColor ? "border-white" : "border-gray-600"
            }`}
            style={{ backgroundColor: presetColor }}
          />
        ))}
      </div>
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 border border-gray-600 rounded bg-gray-800"
      />
    </div>
  );
};

interface OutfitItemProps {
  item: OutfitPiece;
  isEquipped: boolean;
  onEquip: (item: OutfitPiece) => void;
  category: OutfitCategory;
}

const OutfitItem: React.FC<OutfitItemProps> = ({
  item,
  isEquipped,
  onEquip,
  category,
}) => {
  const rarityColors = {
    common: "border-gray-500 bg-gray-800",
    uncommon: "border-green-500 bg-green-900 bg-opacity-20",
    rare: "border-blue-500 bg-blue-900 bg-opacity-20",
    epic: "border-purple-500 bg-purple-900 bg-opacity-20",
    legendary: "border-yellow-500 bg-yellow-900 bg-opacity-20",
    mythic: "border-red-500 bg-red-900 bg-opacity-20",
  };

  return (
    <motion.div
      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
        rarityColors[item.rarity as keyof typeof rarityColors] || rarityColors.common
      } ${isEquipped ? "ring-2 ring-blue-400" : ""}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onEquip(item)}
    >
      <div className="aspect-square bg-gray-700 rounded mb-2 flex items-center justify-center">
        <span className="text-2xl">👗</span>
      </div>

      <h4 className="font-semibold text-white text-sm truncate">{item.name}</h4>
      <p className="text-xs text-gray-400 capitalize">{item.rarity}</p>

      {item.stats && (
        <div className="mt-2 space-y-1">
          {Object.entries(item.stats).map(([stat, value]) => (
            <div key={stat} className="flex justify-between text-xs">
              <span className="text-gray-400 capitalize">{stat}:</span>
              <span className="text-green-400">+{value}</span>
            </div>
          ))}
        </div>
      )}

      {item.setBonus && (
        <div className="mt-2 text-xs text-purple-400">
          Set: {item.setBonus.name}
        </div>
      )}
    </motion.div>
  );
};

interface AccessoryItemProps {
  accessory: Accessory;
  isEquipped: boolean;
  onEquip: (accessory: Accessory) => void;
}

const AccessoryItem: React.FC<AccessoryItemProps> = ({
  accessory,
  isEquipped,
  onEquip,
}) => {
  const rarityColors = {
    common: "border-gray-500 bg-gray-800",
    uncommon: "border-green-500 bg-green-900 bg-opacity-20",
    rare: "border-blue-500 bg-blue-900 bg-opacity-20",
    epic: "border-purple-500 bg-purple-900 bg-opacity-20",
    legendary: "border-yellow-500 bg-yellow-900 bg-opacity-20",
    mythic: "border-red-500 bg-red-900 bg-opacity-20",
  };

  return (
    <motion.div
      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
        rarityColors[accessory.rarity as keyof typeof rarityColors] || rarityColors.common
      } ${isEquipped ? "ring-2 ring-blue-400" : ""}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onEquip(accessory)}
    >
      <div className="aspect-square bg-gray-700 rounded mb-2 flex items-center justify-center">
        <span className="text-2xl">✨</span>
      </div>

      <h4 className="font-semibold text-white text-sm truncate">
        {accessory.name}
      </h4>
      <p className="text-xs text-gray-400 capitalize">{accessory.category}</p>

      {accessory.effects && accessory.effects.length > 0 && (
        <div className="mt-2 space-y-1">
          {accessory.effects.map((effect, index) => (
            <div key={index} className="text-xs text-blue-400">
              {effect.description}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

interface SavedOutfitCardProps {
  outfit: SavedOutfit;
  onLoad: (outfit: SavedOutfit) => void;
  onDelete: (outfitId: string) => void;
}

const SavedOutfitCard: React.FC<SavedOutfitCardProps> = ({
  outfit,
  onLoad,
  onDelete,
}) => {
  return (
    <motion.div
      className="bg-gray-800 p-4 rounded-lg border border-gray-600"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-white">{outfit.name}</h4>
        <div className="flex space-x-2">
          <button
            onClick={() => onLoad(outfit)}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Load
          </button>
          <button
            onClick={() => onDelete(outfit.id)}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {outfit.tags && outfit.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {outfit.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-900 text-blue-300 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="text-xs text-gray-400">
          Created: {new Date(outfit.createdAt).toLocaleDateString()}
        </div>

        {outfit.harmonyScore && (
          <div className="text-xs text-green-400">
            Harmony: {(outfit.harmonyScore * 100).toFixed(1)}%
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const CustomizationPanel: React.FC = () => {
  // Temporary mock data until store methods are implemented
  const customizationState = {
    currentOutfit: {},
    currentColors: {
      primary: "#FF6B6B",
      secondary: "#4ECDC4",
      accent: "#45B7D1",
      hair: "#8B4513",
    },
    equippedAccessories: [],
    harmonyScore: 0.85,
  };

  const availableOutfitPieces: OutfitPiece[] = [];
  const availableAccessories: Accessory[] = [];
  const savedOutfits: SavedOutfit[] = [];

  const equipOutfitPiece = (piece: OutfitPiece) =>
    console.log("equipOutfitPiece", piece);
  const equipAccessory = (accessory: Accessory) =>
    console.log("equipAccessory", accessory);
  const updateColors = (colors: Record<string, string>) => console.log("updateColors", colors);
  const saveOutfit = (name: string, tags: string[]) =>
    console.log("saveOutfit", name, tags);
  const loadOutfit = (outfit: SavedOutfit) => console.log("loadOutfit", outfit);
  const deleteOutfit = (id: string) => console.log("deleteOutfit", id);
  const randomizeOutfit = (options: { category?: OutfitCategory; rarity?: string; }) =>
    console.log("randomizeOutfit", options);

  const [activeTab, setActiveTab] = useState<
    "outfits" | "accessories" | "colors" | "saved"
  >("outfits");
  const [selectedCategory, setSelectedCategory] =
    useState<OutfitCategory>("top");
  const [selectedAccessoryCategory, setSelectedAccessoryCategory] =
    useState<AccessoryCategory>("jewelry");
  const [saveOutfitName, setSaveOutfitName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const filteredOutfitPieces = useMemo(() => {
    return availableOutfitPieces.filter(
      (piece) => piece.category === selectedCategory,
    );
  }, [availableOutfitPieces, selectedCategory]);

  const filteredAccessories = useMemo(() => {
    return availableAccessories.filter(
      (accessory) => accessory.category === selectedAccessoryCategory,
    );
  }, [availableAccessories, selectedAccessoryCategory]);

  const currentOutfit = customizationState.currentOutfit;
  const currentColors = customizationState.currentColors;

  const handleSaveOutfit = useCallback(() => {
    if (saveOutfitName.trim()) {
      saveOutfit(saveOutfitName.trim(), []);
      setSaveOutfitName("");
      setShowSaveDialog(false);
    }
  }, [saveOutfit, saveOutfitName]);

  const handleRandomize = useCallback(() => {
    randomizeOutfit({});
  }, [randomizeOutfit]);

  const outfitCategories: OutfitCategory[] = [
    "top",
    "bottom",
    "shoes",
    "dress",
    "outerwear",
  ];
  const accessoryCategories: AccessoryCategory[] = [
    "jewelry",
    "hair",
    "face",
    "magical",
  ];

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">Customization</h1>

          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
              {[
                { id: "outfits", label: "Outfits" },
                { id: "accessories", label: "Accessories" },
                { id: "colors", label: "Colors" },
                { id: "saved", label: "Saved Outfits" },
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

            <div className="flex space-x-2">
              <button
                onClick={handleRandomize}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold"
              >
                Randomize
              </button>
              <button
                onClick={() => setShowSaveDialog(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
              >
                Save Outfit
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Character Preview */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-4">Preview</h3>

              <div className="aspect-square bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-6xl">👸</span>
              </div>

              {customizationState.harmonyScore && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Style Harmony</span>
                    <span className="text-sm font-semibold text-green-400">
                      {(customizationState.harmonyScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                      style={{
                        width: `${customizationState.harmonyScore * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-400">Equipped Items</h4>
                {Object.entries(currentOutfit).map(([slot, piece]) => (
                  <div key={slot} className="flex justify-between text-sm">
                    <span className="text-gray-400 capitalize">{slot}:</span>
                    <span className="text-white truncate ml-2">
                      {piece ? piece.name : "None"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "outfits" && (
              <div>
                <div className="mb-4">
                  <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-4">
                    {outfitCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-2 rounded-md font-medium transition-colors capitalize ${
                          selectedCategory === category
                            ? "bg-blue-600 text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredOutfitPieces.map((piece) => (
                    <OutfitItem
                      key={piece.id}
                      item={piece}
                      isEquipped={currentOutfit[piece.slot]?.id === piece.id}
                      onEquip={equipOutfitPiece}
                      category={selectedCategory}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "accessories" && (
              <div>
                <div className="mb-4">
                  <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-4">
                    {accessoryCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedAccessoryCategory(category)}
                        className={`px-3 py-2 rounded-md font-medium transition-colors capitalize ${
                          selectedAccessoryCategory === category
                            ? "bg-blue-600 text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredAccessories.map((accessory) => (
                    <AccessoryItem
                      key={accessory.id}
                      accessory={accessory}
                      isEquipped={customizationState.equippedAccessories.some(
                        (a) => a.id === accessory.id,
                      )}
                      onEquip={equipAccessory}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "colors" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorPicker
                  color={currentColors.primary}
                  onChange={(color) =>
                    updateColors({ ...currentColors, primary: color })
                  }
                  label="Primary Color"
                />
                <ColorPicker
                  color={currentColors.secondary}
                  onChange={(color) =>
                    updateColors({ ...currentColors, secondary: color })
                  }
                  label="Secondary Color"
                />
                <ColorPicker
                  color={currentColors.accent}
                  onChange={(color) =>
                    updateColors({ ...currentColors, accent: color })
                  }
                  label="Accent Color"
                />
                <ColorPicker
                  color={currentColors.hair}
                  onChange={(color) =>
                    updateColors({ ...currentColors, hair: color })
                  }
                  label="Hair Color"
                />
              </div>
            )}

            {activeTab === "saved" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedOutfits.map((outfit) => (
                  <SavedOutfitCard
                    key={outfit.id}
                    outfit={outfit}
                    onLoad={loadOutfit}
                    onDelete={deleteOutfit}
                  />
                ))}

                {savedOutfits.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400 text-lg">
                      No saved outfits yet
                    </p>
                    <p className="text-gray-500 text-sm">
                      Create and save your first outfit!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Save Outfit Dialog */}
        <AnimatePresence>
          {showSaveDialog && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSaveDialog(false)}
            >
              <motion.div
                className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Save Outfit
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Outfit Name
                    </label>
                    <input
                      type="text"
                      value={saveOutfitName}
                      onChange={(e) => setSaveOutfitName(e.target.value)}
                      placeholder="Enter outfit name..."
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveOutfit}
                      disabled={!saveOutfitName.trim()}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setShowSaveDialog(false)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
