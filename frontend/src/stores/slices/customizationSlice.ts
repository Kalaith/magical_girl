import type { StateCreator } from 'zustand';
import type {
  CustomizationSystem,
  CustomizationActions,
  CharacterCustomization,
  OutfitConfiguration,
  AccessoryConfiguration,
  ColorConfiguration,
  SavedOutfit,
  QuickSlot,
  OutfitSlot,
  AccessorySlot,
  RandomizationConstraints,
  OutfitOccasion,
  OutfitStats,
  ColorHarmonyScore,
  CurrencyType,
  Color,
  CustomizationEvent
} from '../../types/customization';

export interface CustomizationSlice extends CustomizationSystem, CustomizationActions {
  // Additional computed properties
  getCharacterCustomization: (characterId: string) => CharacterCustomization | null;
  getSavedOutfit: (outfitId: string) => SavedOutfit | null;
  getAvailableItems: (category: string) => any[];
  getFashionProgress: () => { level: number; experience: number; nextLevel: number };
}

export const createCustomizationSlice: StateCreator<CustomizationSlice> = (set, get) => ({
  // Initial state
  characters: {},
  unlockedOutfits: ['basic_dress_001', 'school_uniform_001', 'casual_top_001', 'casual_bottom_001'],
  unlockedAccessories: ['simple_tiara_001', 'ribbon_hairclip_001'],
  unlockedColors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#000000'],
  unlockedPatterns: ['solid', 'stripes', 'polka_dots'],
  savedOutfits: [],
  quickSlots: Array.from({ length: 8 }, (_, i) => ({
    slotNumber: i + 1,
    name: `Slot ${i + 1}`,
    outfitId: '',
    characterId: '',
    keybind: `${i + 1}`
  })),
  customizationPoints: 1000,
  fashionLevel: 1,
  fashionExperience: 0,
  completedSets: [],
  fashionAchievements: [],
  autoEquipNewItems: false,
  showOnlyOwnedItems: true,
  enableAnimatedPreviews: true,

  // Computed properties
  getCharacterCustomization: (characterId: string) => {
    const state = get();
    return state.characters[characterId] || null;
  },

  getSavedOutfit: (outfitId: string) => {
    const state = get();
    return state.savedOutfits.find(outfit => outfit.id === outfitId) || null;
  },

  getAvailableItems: (category: string) => {
    const state = get();
    // This would return filtered items based on category and unlock status
    return []; // Placeholder
  },

  getFashionProgress: () => {
    const state = get();
    const experienceForNextLevel = state.fashionLevel * 100;
    return {
      level: state.fashionLevel,
      experience: state.fashionExperience,
      nextLevel: experienceForNextLevel
    };
  },

  // Outfit management actions
  equipOutfitPiece: (characterId: string, slot: OutfitSlot, pieceId: string) => {
    set((state) => {
      const character = state.characters[characterId];
      if (!character) return state;

      // Check if item is unlocked
      if (!state.unlockedOutfits.includes(pieceId)) {
        console.error('Item not unlocked:', pieceId);
        return state;
      }

      const updatedCharacter = {
        ...character,
        currentOutfit: {
          ...character.currentOutfit,
          [slot]: get().getOutfitPieceById(pieceId)
        }
      };

      // Update stats and check for set bonuses
      get().updateOutfitStats(updatedCharacter);
      get().checkSetBonuses(updatedCharacter);

      return {
        ...state,
        characters: {
          ...state.characters,
          [characterId]: updatedCharacter
        }
      };
    });

    // Award fashion experience
    get().awardFashionExperience(5);

    // Emit event
    get().emitCustomizationEvent({
      type: 'outfit_changed',
      characterId,
      timestamp: Date.now(),
      data: { slot, pieceId }
    });
  },

  unequipOutfitPiece: (characterId: string, slot: OutfitSlot) => {
    set((state) => {
      const character = state.characters[characterId];
      if (!character) return state;

      const updatedCharacter = {
        ...character,
        currentOutfit: {
          ...character.currentOutfit,
          [slot]: null
        }
      };

      return {
        ...state,
        characters: {
          ...state.characters,
          [characterId]: updatedCharacter
        }
      };
    });
  },

  equipFullOutfit: (characterId: string, outfitConfig: OutfitConfiguration) => {
    set((state) => {
      const character = state.characters[characterId];
      if (!character) return state;

      // Validate all pieces are unlocked
      const allPieces = Object.values(outfitConfig).filter(piece => piece !== null);
      const allUnlocked = allPieces.every(piece =>
        piece && state.unlockedOutfits.includes(piece.id)
      );

      if (!allUnlocked) {
        console.error('Some outfit pieces are not unlocked');
        return state;
      }

      const updatedCharacter = {
        ...character,
        currentOutfit: outfitConfig
      };

      // Update stats and check for set bonuses
      get().updateOutfitStats(updatedCharacter);
      get().checkSetBonuses(updatedCharacter);

      return {
        ...state,
        characters: {
          ...state.characters,
          [characterId]: updatedCharacter
        }
      };
    });

    // Award fashion experience for full outfit change
    get().awardFashionExperience(15);
  },

  // Accessory management actions
  equipAccessory: (characterId: string, slot: AccessorySlot, accessoryId: string) => {
    set((state) => {
      const character = state.characters[characterId];
      if (!character) return state;

      // Check if accessory is unlocked
      if (!state.unlockedAccessories.includes(accessoryId)) {
        console.error('Accessory not unlocked:', accessoryId);
        return state;
      }

      const updatedCharacter = {
        ...character,
        currentAccessories: {
          ...character.currentAccessories,
          [slot]: get().getAccessoryById(accessoryId)
        }
      };

      return {
        ...state,
        characters: {
          ...state.characters,
          [characterId]: updatedCharacter
        }
      };
    });

    // Award fashion experience
    get().awardFashionExperience(3);

    // Emit event
    get().emitCustomizationEvent({
      type: 'accessory_equipped',
      characterId,
      timestamp: Date.now(),
      data: { slot, accessoryId }
    });
  },

  unequipAccessory: (characterId: string, slot: AccessorySlot) => {
    set((state) => {
      const character = state.characters[characterId];
      if (!character) return state;

      const updatedCharacter = {
        ...character,
        currentAccessories: {
          ...character.currentAccessories,
          [slot]: null
        }
      };

      return {
        ...state,
        characters: {
          ...state.characters,
          [characterId]: updatedCharacter
        }
      };
    });
  },

  // Color customization actions
  changeColor: (characterId: string, colorType: string, color: Color) => {
    set((state) => {
      const character = state.characters[characterId];
      if (!character) return state;

      const updatedCharacter = {
        ...character,
        currentColors: {
          ...character.currentColors,
          [colorType]: color
        }
      };

      return {
        ...state,
        characters: {
          ...state.characters,
          [characterId]: updatedCharacter
        }
      };
    });

    // Emit event
    get().emitCustomizationEvent({
      type: 'color_changed',
      characterId,
      timestamp: Date.now(),
      data: { colorType, color }
    });
  },

  applyColorScheme: (characterId: string, scheme: ColorConfiguration) => {
    set((state) => {
      const character = state.characters[characterId];
      if (!character) return state;

      const updatedCharacter = {
        ...character,
        currentColors: scheme
      };

      return {
        ...state,
        characters: {
          ...state.characters,
          [characterId]: updatedCharacter
        }
      };
    });

    // Award experience for color coordination
    get().awardFashionExperience(8);
  },

  // Outfit presets
  saveOutfit: (characterId: string, name: string, description?: string) => {
    const character = get().getCharacterCustomization(characterId);
    if (!character) return;

    const newOutfit: SavedOutfit = {
      id: `outfit_${Date.now()}`,
      name,
      description: description || '',
      characterId,
      outfit: { ...character.currentOutfit },
      accessories: { ...character.currentAccessories },
      colors: { ...character.currentColors },
      createdAt: Date.now(),
      lastUsed: Date.now(),
      timesUsed: 0,
      isPublic: false,
      likes: 0,
      tags: [],
      occasion: ['daily'],
      mood: 'happy',
      season: 'all_season'
    };

    set((state) => ({
      ...state,
      savedOutfits: [...state.savedOutfits, newOutfit]
    }));

    // Award experience for creativity
    get().awardFashionExperience(10);

    // Emit event
    get().emitCustomizationEvent({
      type: 'outfit_saved',
      characterId,
      timestamp: Date.now(),
      data: { outfitId: newOutfit.id, name }
    });
  },

  loadOutfit: (characterId: string, outfitId: string) => {
    const outfit = get().getSavedOutfit(outfitId);
    if (!outfit) return;

    // Apply the saved outfit
    get().equipFullOutfit(characterId, outfit.outfit);

    // Apply accessories
    Object.entries(outfit.accessories).forEach(([slot, accessory]) => {
      if (accessory) {
        get().equipAccessory(characterId, slot as AccessorySlot, accessory.id);
      }
    });

    // Apply colors
    get().applyColorScheme(characterId, outfit.colors);

    // Update usage statistics
    set((state) => ({
      ...state,
      savedOutfits: state.savedOutfits.map(o =>
        o.id === outfitId
          ? { ...o, lastUsed: Date.now(), timesUsed: o.timesUsed + 1 }
          : o
      )
    }));
  },

  deleteOutfit: (outfitId: string) => {
    set((state) => ({
      ...state,
      savedOutfits: state.savedOutfits.filter(outfit => outfit.id !== outfitId),
      quickSlots: state.quickSlots.map(slot =>
        slot.outfitId === outfitId ? { ...slot, outfitId: '', characterId: '' } : slot
      )
    }));
  },

  shareOutfit: (outfitId: string): string => {
    const outfit = get().getSavedOutfit(outfitId);
    if (!outfit) return '';

    // Create shareable outfit code
    const outfitData = {
      name: outfit.name,
      outfit: outfit.outfit,
      accessories: outfit.accessories,
      colors: outfit.colors,
      tags: outfit.tags
    };

    return btoa(JSON.stringify(outfitData));
  },

  importOutfit: (outfitCode: string) => {
    try {
      const outfitData = JSON.parse(atob(outfitCode));

      const importedOutfit: SavedOutfit = {
        id: `imported_${Date.now()}`,
        name: `${outfitData.name} (Imported)`,
        description: 'Imported outfit',
        characterId: '', // Will be set when applied
        outfit: outfitData.outfit,
        accessories: outfitData.accessories,
        colors: outfitData.colors,
        createdAt: Date.now(),
        lastUsed: 0,
        timesUsed: 0,
        isPublic: false,
        likes: 0,
        tags: [...(outfitData.tags || []), 'imported'],
        occasion: ['daily'],
        mood: 'happy',
        season: 'all_season'
      };

      set((state) => ({
        ...state,
        savedOutfits: [...state.savedOutfits, importedOutfit]
      }));

      return importedOutfit.id;
    } catch (error) {
      console.error('Failed to import outfit:', error);
      return null;
    }
  },

  // Quick slots
  assignQuickSlot: (slotNumber: number, outfitId: string) => {
    const outfit = get().getSavedOutfit(outfitId);
    if (!outfit) return;

    set((state) => ({
      ...state,
      quickSlots: state.quickSlots.map(slot =>
        slot.slotNumber === slotNumber
          ? { ...slot, outfitId, characterId: outfit.characterId }
          : slot
      )
    }));
  },

  useQuickSlot: (slotNumber: number) => {
    const state = get();
    const quickSlot = state.quickSlots.find(slot => slot.slotNumber === slotNumber);

    if (quickSlot && quickSlot.outfitId && quickSlot.characterId) {
      get().loadOutfit(quickSlot.characterId, quickSlot.outfitId);
    }
  },

  clearQuickSlot: (slotNumber: number) => {
    set((state) => ({
      ...state,
      quickSlots: state.quickSlots.map(slot =>
        slot.slotNumber === slotNumber
          ? { ...slot, outfitId: '', characterId: '' }
          : slot
      )
    }));
  },

  // Item management
  unlockItem: (itemId: string, itemType: 'outfit' | 'accessory') => {
    set((state) => {
      if (itemType === 'outfit' && !state.unlockedOutfits.includes(itemId)) {
        return {
          ...state,
          unlockedOutfits: [...state.unlockedOutfits, itemId]
        };
      } else if (itemType === 'accessory' && !state.unlockedAccessories.includes(itemId)) {
        return {
          ...state,
          unlockedAccessories: [...state.unlockedAccessories, itemId]
        };
      }
      return state;
    });

    // Award experience for unlocking items
    get().awardFashionExperience(20);

    // Emit event
    get().emitCustomizationEvent({
      type: 'item_unlocked',
      characterId: '',
      timestamp: Date.now(),
      data: { itemId, itemType }
    });
  },

  purchaseItem: (itemId: string, currency: CurrencyType) => {
    // This would integrate with the resource system to deduct currency
    const itemCost = get().getItemCost(itemId);

    if (get().canAffordItem(itemId, currency)) {
      // Deduct currency (would integrate with resource slice)
      // get().spendCurrency(currency, itemCost);

      // Determine item type and unlock
      const itemType = get().getItemType(itemId);
      get().unlockItem(itemId, itemType);
    }
  },

  craftItem: (recipeId: string, materials: Record<string, number>) => {
    // This would integrate with crafting system
    // For now, just unlock the item
    const itemId = get().getRecipeOutput(recipeId);
    const itemType = get().getItemType(itemId);

    if (itemId && itemType) {
      get().unlockItem(itemId, itemType);
    }
  },

  // Randomization
  randomizeOutfit: (characterId: string, constraints?: RandomizationConstraints) => {
    const state = get();
    const availableOutfits = state.unlockedOutfits;
    const availableAccessories = state.unlockedAccessories;

    // Apply constraints
    let filteredOutfits = availableOutfits;
    let filteredAccessories = availableAccessories;

    if (constraints?.onlyOwnedItems !== false) {
      // Already filtered to owned items
    }

    // Randomly select outfit pieces
    const randomOutfit: OutfitConfiguration = {
      dress: get().getRandomOutfitPiece(filteredOutfits, 'dress'),
      top: null,
      bottom: null,
      shoes: get().getRandomOutfitPiece(filteredOutfits, 'shoes'),
      cape: Math.random() > 0.7 ? get().getRandomOutfitPiece(filteredOutfits, 'cape') : null,
      gloves: Math.random() > 0.5 ? get().getRandomOutfitPiece(filteredOutfits, 'gloves') : null,
      stockings: Math.random() > 0.6 ? get().getRandomOutfitPiece(filteredOutfits, 'stockings') : null,
      theme: constraints?.theme || 'cute',
      formality: constraints?.formality || 'casual'
    };

    get().equipFullOutfit(characterId, randomOutfit);

    // Randomize some accessories
    if (Math.random() > 0.3) {
      const randomAccessory = get().getRandomAccessory(filteredAccessories, 'tiara');
      if (randomAccessory) {
        get().equipAccessory(characterId, 'tiara', randomAccessory.id);
      }
    }

    // Randomize colors if no color constraints
    if (!constraints?.colors) {
      get().randomizeColors(characterId);
    }
  },

  generateOutfitSuggestion: (characterId: string, occasion: OutfitOccasion): OutfitConfiguration => {
    // This would use AI/algorithm to suggest outfits based on occasion
    // For now, return a basic suggestion
    return {
      dress: null,
      top: null,
      bottom: null,
      shoes: null,
      cape: null,
      gloves: null,
      stockings: null,
      theme: 'cute',
      formality: 'casual'
    };
  },

  // Analysis and stats
  calculateOutfitStats: (outfit: OutfitConfiguration): OutfitStats => {
    let stats: OutfitStats = {
      charm: 0,
      elegance: 0,
      cuteness: 0,
      coolness: 0,
      uniqueness: 0
    };

    // Calculate stats based on outfit pieces
    Object.values(outfit).forEach(piece => {
      if (piece && piece.stats) {
        stats.charm += piece.stats.charm || 0;
        stats.elegance += piece.stats.elegance || 0;
        stats.cuteness += piece.stats.cuteness || 0;
        stats.coolness += piece.stats.coolness || 0;
        stats.uniqueness += piece.stats.uniqueness || 0;
      }
    });

    return stats;
  },

  analyzeColorHarmony: (colors: ColorConfiguration): ColorHarmonyScore => {
    // Analyze color relationships and harmony
    // This would use color theory algorithms
    return {
      overall: 85,
      complementary: 70,
      analogous: 90,
      triadic: 60,
      suggestions: [
        'Consider adding a complementary accent color',
        'The current color scheme is well-balanced'
      ]
    };
  },

  getStyleCompatibility: (outfit: OutfitConfiguration, accessories: AccessoryConfiguration): number => {
    // Calculate how well the outfit and accessories work together
    let compatibility = 100;

    // Check theme consistency
    const outfitThemes = Object.values(outfit)
      .filter(piece => piece !== null)
      .map(piece => piece?.theme);

    const accessoryThemes = Object.values(accessories)
      .filter(accessory => accessory !== null)
      .map(accessory => accessory?.theme);

    // Simple compatibility check (would be more sophisticated in real implementation)
    const allThemes = [...outfitThemes, ...accessoryThemes];
    const uniqueThemes = new Set(allThemes);

    if (uniqueThemes.size > 2) {
      compatibility -= 20; // Penalty for too many conflicting themes
    }

    return Math.max(0, compatibility);
  },

  // Social features
  rateOutfit: (outfitId: string, rating: number) => {
    set((state) => ({
      ...state,
      savedOutfits: state.savedOutfits.map(outfit =>
        outfit.id === outfitId
          ? { ...outfit, likes: outfit.likes + (rating > 3 ? 1 : 0) }
          : outfit
      )
    }));
  },

  addOutfitToFavorites: (outfitId: string) => {
    set((state) => ({
      ...state,
      savedOutfits: state.savedOutfits.map(outfit =>
        outfit.id === outfitId
          ? { ...outfit, tags: [...outfit.tags, 'favorite'] }
          : outfit
      )
    }));
  },

  reportOutfit: (outfitId: string, reason: string) => {
    // This would send a report to moderation system
    console.log(`Outfit ${outfitId} reported for: ${reason}`);
  },

  // Helper methods
  getOutfitPieceById: (pieceId: string) => {
    // This would fetch from outfit database
    return null; // Placeholder
  },

  getAccessoryById: (accessoryId: string) => {
    // This would fetch from accessory database
    return null; // Placeholder
  },

  getItemCost: (itemId: string): number => {
    // Return item cost from database
    return 100; // Placeholder
  },

  canAffordItem: (itemId: string, currency: CurrencyType): boolean => {
    // Check if player can afford the item
    return true; // Placeholder
  },

  getItemType: (itemId: string): 'outfit' | 'accessory' => {
    // Determine item type from ID or database
    return itemId.includes('accessory') ? 'accessory' : 'outfit';
  },

  getRecipeOutput: (recipeId: string): string => {
    // Get the item ID that this recipe produces
    return 'crafted_item_001'; // Placeholder
  },

  getRandomOutfitPiece: (availableItems: string[], category: string) => {
    // Filter items by category and randomly select
    const filteredItems = availableItems.filter(item => item.includes(category));
    return filteredItems.length > 0 ? { id: filteredItems[Math.floor(Math.random() * filteredItems.length)] } : null;
  },

  getRandomAccessory: (availableItems: string[], category: string) => {
    // Similar to getRandomOutfitPiece but for accessories
    const filteredItems = availableItems.filter(item => item.includes(category));
    return filteredItems.length > 0 ? { id: filteredItems[Math.floor(Math.random() * filteredItems.length)] } : null;
  },

  randomizeColors: (characterId: string) => {
    const state = get();
    const availableColors = state.unlockedColors;

    const randomColor = (): Color => {
      const colorString = availableColors[Math.floor(Math.random() * availableColors.length)];
      // Convert hex string to Color object
      return { r: 255, g: 0, b: 0, a: 1 }; // Placeholder conversion
    };

    const randomColors: ColorConfiguration = {
      primaryHairColor: randomColor(),
      leftEyeColor: randomColor(),
      rightEyeColor: randomColor(),
      primaryOutfitColor: randomColor(),
      secondaryOutfitColor: randomColor(),
      accentColor: randomColor(),
      metalTone: 'gold'
    };

    get().applyColorScheme(characterId, randomColors);
  },

  awardFashionExperience: (amount: number) => {
    set((state) => {
      const newExperience = state.fashionExperience + amount;
      const experienceForNextLevel = state.fashionLevel * 100;

      if (newExperience >= experienceForNextLevel) {
        // Level up!
        const newLevel = state.fashionLevel + 1;
        const remainingExperience = newExperience - experienceForNextLevel;

        // Emit level up event
        get().emitCustomizationEvent({
          type: 'fashion_level_up',
          characterId: '',
          timestamp: Date.now(),
          data: { newLevel, previousLevel: state.fashionLevel }
        });

        return {
          ...state,
          fashionLevel: newLevel,
          fashionExperience: remainingExperience,
          customizationPoints: state.customizationPoints + (newLevel * 10) // Bonus points
        };
      }

      return {
        ...state,
        fashionExperience: newExperience
      };
    });
  },

  updateOutfitStats: (character: CharacterCustomization) => {
    // Update character stats based on current outfit
    // This would integrate with the main character stats system
  },

  checkSetBonuses: (character: CharacterCustomization) => {
    // Check for completed outfit sets and apply bonuses
    const currentSetId = character.currentOutfit.setId;

    if (currentSetId) {
      // Check if all pieces of the set are equipped
      const setComplete = get().isSetComplete(character.currentOutfit, currentSetId);

      if (setComplete) {
        set((state) => {
          if (!state.completedSets.includes(currentSetId)) {
            return {
              ...state,
              completedSets: [...state.completedSets, currentSetId]
            };
          }
          return state;
        });

        // Emit set completion event
        get().emitCustomizationEvent({
          type: 'set_completed',
          characterId: character.characterId,
          timestamp: Date.now(),
          data: { setId: currentSetId }
        });
      }
    }
  },

  isSetComplete: (outfit: OutfitConfiguration, setId: string): boolean => {
    // Check if all required pieces of a set are equipped
    // This would check against set definitions
    return false; // Placeholder
  },

  emitCustomizationEvent: (event: CustomizationEvent) => {
    // Emit customization events for other systems to listen to
    console.log('Customization event:', event);
  }
});