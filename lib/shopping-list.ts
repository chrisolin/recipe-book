/**
 * Shopping list utility functions
 * Provides functions for generating and managing shopping lists
 */
import { Recipe, ShoppingItem, ShoppingList } from './types';
import { 
  generateShoppingList as generateShoppingListFromData,
  getShoppingListById,
  updateShoppingListItem,
  deleteShoppingList,
  getRecipeById,
  getMealPlanById
} from './data-manager';

/**
 * Generate a shopping list from a meal plan
 */
export const generateShoppingList = async (mealPlanId: string): Promise<ShoppingList | null> => {
  return generateShoppingListFromData(mealPlanId);
};

/**
 * Get a shopping list by ID with additional recipe information
 */
export const getShoppingListWithRecipes = async (id: string): Promise<{
  shoppingList: ShoppingList | null;
  recipes: Record<string, Recipe>;
}> => {
  const shoppingList = await getShoppingListById(id);
  const recipes: Record<string, Recipe> = {};
  
  if (shoppingList) {
    // Get unique recipe IDs from the shopping list
    const recipeIds = [...new Set(shoppingList.items.map(item => item.recipeId))];
    
    // Fetch all recipes
    for (const recipeId of recipeIds) {
      const recipe = await getRecipeById(recipeId);
      if (recipe) {
        recipes[recipeId] = recipe;
      }
    }
  }
  
  return { shoppingList, recipes };
};

/**
 * Get a shopping list with meal plan information
 */
export const getShoppingListWithMealPlan = async (id: string): Promise<{
  shoppingList: ShoppingList | null;
  mealPlan: any | null;
  recipes: Record<string, Recipe>;
}> => {
  const { shoppingList, recipes } = await getShoppingListWithRecipes(id);
  let mealPlan = null;
  
  if (shoppingList) {
    mealPlan = await getMealPlanById(shoppingList.mealPlanId);
  }
  
  return { shoppingList, mealPlan, recipes };
};

/**
 * Toggle the checked state of a shopping list item
 */
export const toggleShoppingListItem = async (
  shoppingListId: string,
  itemId: string
): Promise<ShoppingList | null> => {
  const shoppingList = await getShoppingListById(shoppingListId);
  if (!shoppingList) return null;
  
  const item = shoppingList.items.find(item => item.id === itemId);
  if (!item) return null;
  
  return updateShoppingListItem(shoppingListId, itemId, {
    checked: !item.checked
  });
};

/**
 * Group shopping list items by recipe
 */
export const groupShoppingListByRecipe = (
  shoppingList: ShoppingList,
  recipes: Record<string, Recipe>
): Record<string, ShoppingItem[]> => {
  const grouped: Record<string, ShoppingItem[]> = {};
  
  for (const item of shoppingList.items) {
    if (!grouped[item.recipeId]) {
      grouped[item.recipeId] = [];
    }
    
    grouped[item.recipeId].push(item);
  }
  
  return grouped;
};

/**
 * Delete a shopping list
 */
export const removeShoppingList = async (id: string): Promise<boolean> => {
  return deleteShoppingList(id);
}; 