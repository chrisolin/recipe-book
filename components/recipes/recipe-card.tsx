import Link from 'next/link';
import { Recipe } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import RecipeTags from './recipe-tags';

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
    <Link href={`/recipes/${recipe.id}`} className="block h-full">
      <Card className="h-full transition-all hover:shadow-md">
        {recipe.imageUrl && (
          <div className="relative w-full h-40 overflow-hidden rounded-t-lg">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <CardContent className={`p-4 ${!recipe.imageUrl ? 'pt-4' : ''}`}>
          <h3 className="text-lg font-semibold line-clamp-1">{recipe.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {recipe.description}
          </p>
          
          <div className="mt-3">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Ingredients:</span>{' '}
              {recipe.ingredients.length}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex flex-col items-start">
          <RecipeTags tags={recipe.tags} limit={3} />
          
          <div className="mt-2 text-xs text-muted-foreground">
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