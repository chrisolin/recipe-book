/**
 * Data model types for the Family Meal Planner application
 */

/**
 * Recipe data model
 */
export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  tags: string[];
  imageUrl?: string;
  lastUsed?: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Meal plan data model
 */
export interface MealPlan {
  id: string;
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  meals: Meal[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Individual meal within a meal plan
 */
export interface Meal {
  id: string;
  date: string; // ISO date string
  recipeId: string;
  notes?: string;
}

/**
 * Shopping list data model
 */
export interface ShoppingList {
  id: string;
  mealPlanId: string;
  items: ShoppingItem[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Shopping list item
 */
export interface ShoppingItem {
  id: string;
  name: string;
  recipeId: string; // To track which recipe this item belongs to
  checked: boolean;
}

/**
 * Application data structure
 */
export interface AppData {
  recipes: Record<string, Recipe>;
  mealPlans: Record<string, MealPlan>;
  shoppingLists: Record<string, ShoppingList>;
  version: number; // For data migrations
  lastUpdated: string; // ISO date string
}

/**
 * Migration record for tracking data migrations
 */
export interface MigrationRecord {
  fromVersion: number;
  toVersion: number;
  migratedAt: string; // ISO date string
} 