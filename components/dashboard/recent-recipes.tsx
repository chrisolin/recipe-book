'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppData } from '@/app/providers';
import { Recipe } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Clock } from 'lucide-react';
import RecipeTags from '@/components/recipes/recipe-tags';

export default function RecentRecipes() {
  const { data, isLoading } = useAppData();
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  
  useEffect(() => {
    if (data && !isLoading) {
      // Get all recipes and sort by lastUsed or createdAt date
      const recipes = Object.values(data.recipes);
      
      const sortedRecipes = recipes.sort((a, b) => {
        const aDate = a.lastUsed ? new Date(a.lastUsed).getTime() : new Date(a.createdAt).getTime();
        const bDate = b.lastUsed ? new Date(b.lastUsed).getTime() : new Date(b.createdAt).getTime();
        return bDate - aDate; // Most recent first
      });
      
      // Take the first 5 recipes
      setRecentRecipes(sortedRecipes.slice(0, 5));
    }
  }, [data, isLoading]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recent Recipes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recentRecipes.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recent Recipes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No recipes yet</h3>
            <p className="text-muted-foreground mb-4">
              Add some recipes to get started with your meal planning.
            </p>
            <Button asChild>
              <Link href="/recipes/new">
                Add Your First Recipe
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Recipes</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/recipes" className="text-sm">
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {recentRecipes.map(recipe => (
            <li key={recipe.id} className="border rounded-md overflow-hidden">
              <Link 
                href={`/recipes/${recipe.id}`} 
                className="flex items-start p-3 hover:bg-accent/50 transition-colors"
              >
                {recipe.imageUrl && (
                  <div className="relative w-16 h-16 rounded overflow-hidden mr-3 flex-shrink-0">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-base truncate">{recipe.title}</h3>
                  <div className="mt-1">
                    <RecipeTags tags={recipe.tags} limit={2} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {recipe.lastUsed 
                      ? `Last used: ${formatDate(recipe.lastUsed)}`
                      : `Added: ${formatDate(recipe.createdAt)}`
                    }
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 