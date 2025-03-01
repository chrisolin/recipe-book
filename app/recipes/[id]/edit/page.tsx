'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRecipeById } from '@/lib/data-manager';
import { Recipe } from '@/lib/types';
import { Button } from '@/components/ui/button';
import RecipeForm from '@/components/recipes/recipe-form';
import { ArrowLeft } from 'lucide-react';

interface EditRecipePageProps {
  params: {
    id: string;
  };
}

export default function EditRecipePage({ params }: EditRecipePageProps) {
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeData = await getRecipeById(params.id);
        if (!recipeData) {
          setError('Recipe not found');
        } else {
          setRecipe(recipeData);
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
        <div className="h-64 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">{error || 'Recipe not found'}</h2>
        <p className="text-muted-foreground mb-6">
          The recipe you're trying to edit doesn't exist or couldn't be loaded.
        </p>
        <Button onClick={() => router.push('/recipes')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Recipe</h1>
        <div className="w-[73px]"></div> {/* Spacer for centering */}
      </div>

      <RecipeForm
        recipe={recipe}
        onSuccess={() => {
          router.push(`/recipes/${recipe.id}`);
          router.refresh();
        }}
      />
    </div>
  );
} 