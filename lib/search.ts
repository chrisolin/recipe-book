import { Recipe } from './types';

/**
 * Search recipes by a search term
 * @param recipes Array of recipes to search
 * @param searchTerm Term to search for
 * @returns Filtered array of recipes
 */
export function searchRecipes(recipes: Recipe[], searchTerm: string): Recipe[] {
  if (!searchTerm.trim()) {
    return recipes;
  }

  const term = searchTerm.toLowerCase().trim();
  
  return recipes.filter((recipe) => {
    // Search in title
    if (recipe.title.toLowerCase().includes(term)) {
      return true;
    }
    
    // Search in description
    if (recipe.description.toLowerCase().includes(term)) {
      return true;
    }
    
    // Search in ingredients
    if (recipe.ingredients.some((ingredient) => 
      ingredient.toLowerCase().includes(term)
    )) {
      return true;
    }
    
    // Search in tags
    if (recipe.tags.some((tag) => 
      tag.toLowerCase().includes(term)
    )) {
      return true;
    }
    
    return false;
  });
}

/**
 * Filter recipes by tags
 * @param recipes Array of recipes to filter
 * @param tags Array of tags to filter by
 * @param requireAll If true, recipes must have all tags; if false, any tag is sufficient
 * @returns Filtered array of recipes
 */
export function filterRecipesByTags(
  recipes: Recipe[],
  tags: string[],
  requireAll: boolean = true
): Recipe[] {
  if (!tags.length) {
    return recipes;
  }
  
  return recipes.filter((recipe) => {
    if (requireAll) {
      // Recipe must have all selected tags
      return tags.every((tag) => recipe.tags.includes(tag));
    } else {
      // Recipe must have at least one of the selected tags
      return tags.some((tag) => recipe.tags.includes(tag));
    }
  });
}

/**
 * Sort recipes by date
 * @param recipes Array of recipes to sort
 * @param sortBy Sort criteria ('lastUsed' or 'created')
 * @param order Sort order ('asc' or 'desc')
 * @returns Sorted array of recipes
 */
export function sortRecipes(
  recipes: Recipe[],
  sortBy: 'lastUsed' | 'created' = 'lastUsed',
  order: 'asc' | 'desc' = 'desc'
): Recipe[] {
  return [...recipes].sort((a, b) => {
    let dateA: Date;
    let dateB: Date;
    
    if (sortBy === 'lastUsed') {
      dateA = new Date(a.lastUsed || a.createdAt);
      dateB = new Date(b.lastUsed || b.createdAt);
    } else {
      dateA = new Date(a.createdAt);
      dateB = new Date(b.createdAt);
    }
    
    return order === 'desc'
      ? dateB.getTime() - dateA.getTime()
      : dateA.getTime() - dateB.getTime();
  });
}

/**
 * Search, filter, and sort recipes in one operation
 * @param recipes Array of recipes
 * @param options Search, filter, and sort options
 * @returns Processed array of recipes
 */
export function processRecipes(
  recipes: Recipe[],
  options: {
    searchTerm?: string;
    tags?: string[];
    requireAllTags?: boolean;
    sortBy?: 'lastUsed' | 'created';
    sortOrder?: 'asc' | 'desc';
  }
): Recipe[] {
  const {
    searchTerm = '',
    tags = [],
    requireAllTags = true,
    sortBy = 'lastUsed',
    sortOrder = 'desc',
  } = options;
  
  // Apply search
  let result = searchTerm ? searchRecipes(recipes, searchTerm) : recipes;
  
  // Apply tag filtering
  result = tags.length ? filterRecipesByTags(result, tags, requireAllTags) : result;
  
  // Apply sorting
  result = sortRecipes(result, sortBy, sortOrder);
  
  return result;
} 