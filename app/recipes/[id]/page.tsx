import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRecipeById, getAllRecipes } from '@/lib/data-manager';
import { Recipe } from '@/lib/types';
import { Button } from '@/components/ui/button';
import RecipeDetail from '@/components/recipes/recipe-detail';
import { ArrowLeft } from 'lucide-react';

interface RecipePageProps {
  params: Promise<{
    id: string;
  }>;
}

// This function generates all possible recipe paths at build time
export async function generateStaticParams() {
  const recipes = await getAllRecipes();
  return recipes.map((recipe) => ({
    id: recipe.id,
  }));
}

export default function RecipePage({ params }: RecipePageProps) {
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { id } = await params;
        const recipeData = await getRecipeById(id);
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
  }, [params]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
        <div className="h-64 bg-muted rounded animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-6 w-full bg-muted rounded animate-pulse"></div>
          <div className="h-6 w-3/4 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">{error || 'Recipe not found'}</h2>
        <p className="text-muted-foreground mb-6">
          The recipe you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.
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
      <Button
        variant="ghost"
        className="pl-0 mb-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <RecipeDetail recipe={recipe} />
    </div>
  );
} 