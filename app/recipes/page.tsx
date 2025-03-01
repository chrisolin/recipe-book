'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllRecipes } from '@/lib/data-manager';
import { Recipe } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, Filter, X } from 'lucide-react';
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
  const [showFilters, setShowFilters] = useState(false);

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

  const hasActiveFilters = searchTerm || selectedTags.length > 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Recipes</h1>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/recipes/new" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Recipe
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search recipes by title, ingredients, or tags..."
            />
          </div>
          
          <Button 
            variant={showFilters ? "default" : "outline"} 
            size="icon" 
            onClick={() => setShowFilters(!showFilters)}
            className="h-10 w-10"
            aria-label={showFilters ? "Hide filters" : "Show filters"}
          >
            {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
          </Button>
        </div>

        {showFilters && (
          <div className="p-4 border rounded-lg bg-card animate-fade-in">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Filter by Tags</h3>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="h-8 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
              
              <FilterTags
                allTags={allTags}
                selectedTags={selectedTags}
                onTagClick={handleTagClick}
              />

              {selectedTags.length > 1 && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">Match:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-7 text-xs ${requireAllTags ? 'bg-primary/10 border-primary/30' : ''}`}
                    onClick={toggleTagRequirement}
                  >
                    {requireAllTags ? 'All selected tags' : 'Any selected tag'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {hasActiveFilters && !showFilters && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedTags.map(tag => (
              <span 
                key={tag} 
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
              >
                {tag}
                <button 
                  onClick={() => handleTagClick(tag)} 
                  className="ml-1 hover:text-primary/70"
                  aria-label={`Remove ${tag} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            )}
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