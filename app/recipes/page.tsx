'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllRecipes } from '@/lib/data-manager';
import { Recipe } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import RecipeList from '@/components/recipes/recipe-list';
import SearchBar from '@/components/recipes/search-bar';
import FilterTags from '@/components/recipes/filter-tags';
import { processRecipes } from '@/lib/search';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [requireAllTags, setRequireAllTags] = useState(true);

  // Fetch recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const allRecipes = await getAllRecipes();
        setRecipes(allRecipes);
        setFilteredRecipes(allRecipes);
        
        // Extract all unique tags
        const tags = Array.from(
          new Set(allRecipes.flatMap((recipe) => recipe.tags))
        ).sort();
        setAllTags(tags);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Process recipes when search term or tags change
  useEffect(() => {
    setFilteredRecipes(
      processRecipes(recipes, {
        searchTerm,
        tags: selectedTags,
        requireAllTags,
      })
    );
  }, [recipes, searchTerm, selectedTags, requireAllTags]);

  // Handle tag selection
  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  // Toggle between "match all tags" and "match any tag"
  const toggleTagRequirement = () => {
    setRequireAllTags((prev) => !prev);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Recipes</h1>
        <Button asChild>
          <Link href="/recipes/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Recipe
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search recipes by title, ingredients, or tags..."
        />

        <FilterTags
          allTags={allTags}
          selectedTags={selectedTags}
          onTagClick={handleTagClick}
          onClearAll={clearFilters}
        />

        {selectedTags.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Match:</span>
            <Button
              variant="outline"
              size="sm"
              className={`h-7 text-xs ${requireAllTags ? 'bg-primary/10' : ''}`}
              onClick={toggleTagRequirement}
            >
              {requireAllTags ? 'All tags' : 'Any tag'}
            </Button>
          </div>
        )}
      </div>

      <RecipeList
        initialRecipes={filteredRecipes}
        loading={loading}
      />
    </div>
  );
} 