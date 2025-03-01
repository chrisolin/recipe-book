/**
 * Data manager for the Family Meal Planner application
 * Provides higher-level functions for managing application data
 */
import { v4 as uuidv4 } from 'uuid';
import { 
  AppData, 
  Recipe, 
  MealPlan, 
  ShoppingList,
  ShoppingItem,
  Meal
} from './types';
import {
  DEFAULT_APP_DATA,
  isOPFSSupported,
  saveToOPFS,
  loadFromOPFS,
  saveToLocalStorage,
  loadFromLocalStorage
} from './storage';

// In-memory cache of the app data
let appDataCache: AppData | null = null;

/**
 * Initialize the data manager
 * Loads data from storage or creates default data if none exists
 */
export const initializeDataManager = async (): Promise<AppData> => {
  // If we already have data in the cache, return it
  if (appDataCache) {
    return appDataCache;
  }

  // Try to load data from storage
  let data: AppData | null = null;
  
  if (isOPFSSupported()) {
    data = await loadFromOPFS();
  } else {
    data = loadFromLocalStorage();
  }

  // If no data exists, use the default data
  if (!data) {
    data = { ...DEFAULT_APP_DATA };
    await saveData(data);
  }

  // Cache the data
  appDataCache = data;
  
  return data;
};

/**
 * Save data to storage
 */
export const saveData = async (data: AppData): Promise<boolean> => {
  // Update the cache
  appDataCache = data;
  
  // Save to storage
  if (isOPFSSupported()) {
    return await saveToOPFS(data);
  } else {
    return saveToLocalStorage(data);
  }
};

/**
 * Get all recipes
 */
export const getAllRecipes = async (): Promise<Recipe[]> => {
  const data = await initializeDataManager();
  return Object.values(data.recipes);
};

/**
 * Get a recipe by ID
 */
export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  const data = await initializeDataManager();
  return data.recipes[id] || null;
};

/**
 * Add a new recipe
 */
export const addRecipe = async (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> => {
  const data = await initializeDataManager();
  
  const now = new Date().toISOString();
  const newRecipe: Recipe = {
    ...recipe,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now
  };
  
  data.recipes[newRecipe.id] = newRecipe;
  await saveData(data);
  
  return newRecipe;
};

/**
 * Update an existing recipe
 */
export const updateRecipe = async (id: string, updates: Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Recipe | null> => {
  const data = await initializeDataManager();
  
  const recipe = data.recipes[id];
  if (!recipe) return null;
  
  const updatedRecipe: Recipe = {
    ...recipe,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  data.recipes[id] = updatedRecipe;
  await saveData(data);
  
  return updatedRecipe;
};

/**
 * Delete a recipe
 */
export const deleteRecipe = async (id: string): Promise<boolean> => {
  const data = await initializeDataManager();
  
  if (!data.recipes[id]) return false;
  
  delete data.recipes[id];
  await saveData(data);
  
  return true;
};

/**
 * Update recipe last used date
 */
export const updateRecipeLastUsed = async (id: string): Promise<Recipe | null> => {
  const data = await initializeDataManager();
  
  const recipe = data.recipes[id];
  if (!recipe) return null;
  
  const updatedRecipe: Recipe = {
    ...recipe,
    lastUsed: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  data.recipes[id] = updatedRecipe;
  await saveData(data);
  
  return updatedRecipe;
};

/**
 * Get all meal plans
 */
export const getAllMealPlans = async (): Promise<MealPlan[]> => {
  const data = await initializeDataManager();
  return Object.values(data.mealPlans);
};

/**
 * Get a meal plan by ID
 */
export const getMealPlanById = async (id: string): Promise<MealPlan | null> => {
  const data = await initializeDataManager();
  return data.mealPlans[id] || null;
};

/**
 * Add a new meal plan
 */
export const addMealPlan = async (mealPlan: Omit<MealPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<MealPlan> => {
  const data = await initializeDataManager();
  
  const now = new Date().toISOString();
  const newMealPlan: MealPlan = {
    ...mealPlan,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now
  };
  
  data.mealPlans[newMealPlan.id] = newMealPlan;
  
  // Update lastUsed for all recipes in the meal plan
  for (const meal of newMealPlan.meals) {
    await updateRecipeLastUsed(meal.recipeId);
  }
  
  await saveData(data);
  
  return newMealPlan;
};

/**
 * Update an existing meal plan
 */
export const updateMealPlan = async (id: string, updates: Partial<Omit<MealPlan, 'id' | 'createdAt' | 'updatedAt'>>): Promise<MealPlan | null> => {
  const data = await initializeDataManager();
  
  const mealPlan = data.mealPlans[id];
  if (!mealPlan) return null;
  
  const updatedMealPlan: MealPlan = {
    ...mealPlan,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  data.mealPlans[id] = updatedMealPlan;
  
  // If meals were updated, update lastUsed for all recipes
  if (updates.meals) {
    for (const meal of updatedMealPlan.meals) {
      await updateRecipeLastUsed(meal.recipeId);
    }
  }
  
  await saveData(data);
  
  return updatedMealPlan;
};

/**
 * Delete a meal plan
 */
export const deleteMealPlan = async (id: string): Promise<boolean> => {
  const data = await initializeDataManager();
  
  if (!data.mealPlans[id]) return false;
  
  delete data.mealPlans[id];
  await saveData(data);
  
  return true;
};

/**
 * Generate a shopping list from a meal plan
 */
export const generateShoppingList = async (mealPlanId: string): Promise<ShoppingList | null> => {
  const data = await initializeDataManager();
  
  const mealPlan = data.mealPlans[mealPlanId];
  if (!mealPlan) return null;
  
  const items: ShoppingItem[] = [];
  
  // Collect all ingredients from all recipes in the meal plan
  for (const meal of mealPlan.meals) {
    const recipe = data.recipes[meal.recipeId];
    if (!recipe) continue;
    
    for (const ingredient of recipe.ingredients) {
      items.push({
        id: uuidv4(),
        name: ingredient,
        recipeId: recipe.id,
        checked: false
      });
    }
  }
  
  const now = new Date().toISOString();
  const shoppingList: ShoppingList = {
    id: uuidv4(),
    mealPlanId,
    items,
    createdAt: now,
    updatedAt: now
  };
  
  data.shoppingLists[shoppingList.id] = shoppingList;
  await saveData(data);
  
  return shoppingList;
};

/**
 * Get all shopping lists
 */
export const getAllShoppingLists = async (): Promise<ShoppingList[]> => {
  const data = await initializeDataManager();
  return Object.values(data.shoppingLists);
};

/**
 * Get a shopping list by ID
 */
export const getShoppingListById = async (id: string): Promise<ShoppingList | null> => {
  const data = await initializeDataManager();
  return data.shoppingLists[id] || null;
};

/**
 * Update a shopping list item
 */
export const updateShoppingListItem = async (
  shoppingListId: string, 
  itemId: string, 
  updates: Partial<Omit<ShoppingItem, 'id' | 'recipeId'>>
): Promise<ShoppingList | null> => {
  const data = await initializeDataManager();
  
  const shoppingList = data.shoppingLists[shoppingListId];
  if (!shoppingList) return null;
  
  const itemIndex = shoppingList.items.findIndex(item => item.id === itemId);
  if (itemIndex === -1) return null;
  
  shoppingList.items[itemIndex] = {
    ...shoppingList.items[itemIndex],
    ...updates
  };
  
  shoppingList.updatedAt = new Date().toISOString();
  
  await saveData(data);
  
  return shoppingList;
};

/**
 * Delete a shopping list
 */
export const deleteShoppingList = async (id: string): Promise<boolean> => {
  const data = await initializeDataManager();
  
  if (!data.shoppingLists[id]) return false;
  
  delete data.shoppingLists[id];
  await saveData(data);
  
  return true;
}; 