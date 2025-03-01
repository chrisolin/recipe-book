import Link from 'next/link';
import { Recipe } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import RecipeTags from './recipe-tags';
import { ChefHat } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Link href={`/recipes/${recipe.id}`} className="block h-full group">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:translate-y-[-2px]">
        {recipe.imageUrl && (
          <div className="relative w-full h-48 overflow-hidden">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        <CardContent className={`p-5 ${!recipe.imageUrl ? 'pt-5' : ''}`}>
          <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>
          
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {recipe.description || "No description available"}
          </p>
          
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex items-center text-xs text-muted-foreground">
              <ChefHat className="h-3.5 w-3.5 mr-1.5" />
              <span>{recipe.ingredients.length} ingredients</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="px-5 py-4 pt-0 flex flex-col items-start border-t border-border/50 mt-2">
          <RecipeTags tags={recipe.tags} limit={3} />
          
          <div className="mt-3 text-xs text-muted-foreground">
            {recipe.lastUsed ? (
              <p>Last used: {formatDate(recipe.lastUsed)}</p>
            ) : (
              <p>Added: {formatDate(recipe.createdAt)}</p>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
} 