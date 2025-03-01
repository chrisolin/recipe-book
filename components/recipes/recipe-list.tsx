import { useState, useEffect } from 'react';
import { Recipe } from '@/lib/types';
import { getAllRecipes } from '@/lib/data-manager';
import RecipeCard from './recipe-card';

interface RecipeListProps {
  initialRecipes?: Recipe[];
  searchTerm?: string;
  selectedTags?: string[];
}

export default function RecipeList({
  initialRecipes,
  searchTerm = '',
  selectedTags = [],
}: RecipeListProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes || []);
  const [loading, setLoading] = useState(!initialRecipes);

  // Fetch recipes if not provided
  useEffect(() => {
    if (!initialRecipes) {
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
  }, [initialRecipes]);

  // Filter recipes based on search term and selected tags
  const filteredRecipes = recipes.filter((recipe) => {
    // Filter by search term
    const matchesSearch = searchTerm
      ? recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : true;

    // Filter by selected tags
    const matchesTags =
      selectedTags.length > 0
        ? selectedTags.every((tag) => recipe.tags.includes(tag))
        : true;

    return matchesSearch && matchesTags;
  });

  // Sort recipes by last used or created date
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    const dateA = a.lastUsed || a.createdAt;
    const dateB = b.lastUsed || b.createdAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

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

  if (sortedRecipes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No recipes found</h3>
        <p className="text-muted-foreground mt-1">
          {searchTerm || selectedTags.length > 0
            ? 'Try adjusting your search or filters'
            : 'Add your first recipe to get started'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedRecipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
} 