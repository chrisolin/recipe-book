import { useState, useEffect } from 'react';
import { Recipe } from '@/lib/types';
import { getAllRecipes } from '@/lib/data-manager';
import RecipeCard from './recipe-card';

interface RecipeListProps {
  initialRecipes?: Recipe[];
  loading?: boolean;
}

export default function RecipeList({
  initialRecipes,
  loading: externalLoading,
}: RecipeListProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes || []);
  const [loading, setLoading] = useState(externalLoading !== undefined ? externalLoading : !initialRecipes);

  // Fetch recipes if not provided
  useEffect(() => {
    if (!initialRecipes && externalLoading === undefined) {
      const fetchRecipes = async () => {
        try {
          const allRecipes = await getAllRecipes();
          setRecipes(allRecipes);
        } catch (error) {
          console.error('Error fetching recipes:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchRecipes();
    }
  }, [initialRecipes, externalLoading]);

  // Update recipes when initialRecipes changes
  useEffect(() => {
    if (initialRecipes) {
      setRecipes(initialRecipes);
    }
  }, [initialRecipes]);

  // Update loading state when externalLoading changes
  useEffect(() => {
    if (externalLoading !== undefined) {
      setLoading(externalLoading);
    }
  }, [externalLoading]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-64 rounded-lg bg-muted animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No recipes found</h3>
        <p className="text-muted-foreground mt-1">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
} 