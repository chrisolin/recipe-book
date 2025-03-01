'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllRecipes } from '@/lib/data-manager';
import { Recipe } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import RecipeList from '@/components/recipes/recipe-list';
import RecipeTags from '@/components/recipes/recipe-tags';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Fetch recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const allRecipes = await getAllRecipes();
        setRecipes(allRecipes);
        
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {allTags.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-medium">Filter by Tags</h2>
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-auto py-1 px-2 text-xs"
                >
                  Clear Filters
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <span
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`
                    text-xs px-2 py-1 rounded-full cursor-pointer
                    ${
                      selectedTags.includes(tag)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }
                  `}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <RecipeList
        initialRecipes={recipes}
        searchTerm={searchTerm}
        selectedTags={selectedTags}
      />
    </div>
  );
} 