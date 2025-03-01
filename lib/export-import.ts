/**
 * Utilities for exporting and importing app data
 */
import { AppData } from './types';
import { DEFAULT_APP_DATA } from './storage';
import { saveData } from './data-manager';
import { migrateData, needsMigration } from './migrations';

/**
 * Export app data to a JSON file
 */
export const exportData = async (data: AppData): Promise<void> => {
  try {
    // Create a Blob with the JSON data
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a filename with the current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `family-meal-planner-backup-${date}.json`;
    
    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Append the link to the body
    document.body.appendChild(link);
    
    // Click the link to trigger the download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export data:', error);
    throw new Error('Failed to export data');
  }
};

/**
 * Import app data from a JSON file
 */
export const importData = async (file: File): Promise<AppData> => {
  try {
    // Read the file as text
    const text = await file.text();
    
    // Parse the JSON
    const importedData = JSON.parse(text) as AppData;
    
    // Validate the imported data
    if (!validateImportedData(importedData)) {
      throw new Error('Invalid data format');
    }
    
    // Check if data needs migration
    let migratedData = importedData;
    if (needsMigration(importedData)) {
      migratedData = migrateData(importedData);
    }
    
    // Save the imported data
    await saveData(migratedData);
    
    return migratedData;
  } catch (error) {
    console.error('Failed to import data:', error);
    throw new Error('Failed to import data');
  }
};

/**
 * Validate imported data
 */
const validateImportedData = (data: unknown): data is AppData => {
  // Check if the data has the required properties
  if (!data || typeof data !== 'object') return false;
  if (!('recipes' in data) || typeof data.recipes !== 'object') return false;
  if (!('mealPlans' in data) || typeof data.mealPlans !== 'object') return false;
  if (!('shoppingLists' in data) || typeof data.shoppingLists !== 'object') return false;
  if (!('version' in data) || typeof data.version !== 'number') return false;
  if (!('lastUpdated' in data) || typeof data.lastUpdated !== 'string') return false;
  
  return true;
};

/**
 * Merge imported data with existing data
 * This is useful when you want to import data without overwriting existing data
 */
export const mergeData = async (existingData: AppData, importedData: AppData): Promise<AppData> => {
  try {
    // Create a new data object
    const mergedData: AppData = {
      ...existingData,
      recipes: { ...existingData.recipes },
      mealPlans: { ...existingData.mealPlans },
      shoppingLists: { ...existingData.shoppingLists },
      version: existingData.version,
      lastUpdated: new Date().toISOString(),
    };
    
    // Merge recipes
    for (const [id, recipe] of Object.entries(importedData.recipes)) {
      if (!mergedData.recipes[id]) {
        mergedData.recipes[id] = recipe;
      }
    }
    
    // Merge meal plans
    for (const [id, mealPlan] of Object.entries(importedData.mealPlans)) {
      if (!mergedData.mealPlans[id]) {
        mergedData.mealPlans[id] = mealPlan;
      }
    }
    
    // Merge shopping lists
    for (const [id, shoppingList] of Object.entries(importedData.shoppingLists)) {
      if (!mergedData.shoppingLists[id]) {
        mergedData.shoppingLists[id] = shoppingList;
      }
    }
    
    // Save the merged data
    await saveData(mergedData);
    
    return mergedData;
  } catch (error) {
    console.error('Failed to merge data:', error);
    throw new Error('Failed to merge data');
  }
};

/**
 * Reset app data to default
 */
export const resetData = async (): Promise<AppData> => {
  try {
    // Create a new default data object
    const defaultData = { ...DEFAULT_APP_DATA };
    
    // Save the default data
    await saveData(defaultData);
    
    return defaultData;
  } catch (error) {
    console.error('Failed to reset data:', error);
    throw new Error('Failed to reset data');
  }
}; 