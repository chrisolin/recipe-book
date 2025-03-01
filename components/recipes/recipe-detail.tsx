import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Recipe } from '@/lib/types';
import { deleteRecipe } from '@/lib/data-manager';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import RecipeTags from './recipe-tags';
import { Pencil, Trash2, Clock } from 'lucide-react';

interface RecipeDetailProps {
  recipe: Recipe;
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteRecipe(recipe.id);
      setIsDeleteDialogOpen(false);
      router.push('/recipes');
      router.refresh();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="mb-8">
        {recipe.imageUrl && (
          <div className="relative w-full h-64 overflow-hidden rounded-t-lg">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{recipe.title}</h1>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                asChild
              >
                <Link href={`/recipes/${recipe.id}/edit`}>
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <RecipeTags tags={recipe.tags} />
          </div>

          <div className="mb-6">
            <p className="text-muted-foreground">{recipe.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Ingredients</h2>
            <ul className="space-y-1 list-disc pl-5">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              {recipe.lastUsed
                ? `Last used: ${formatDate(recipe.lastUsed)}`
                : `Added: ${formatDate(recipe.createdAt)}`}
            </span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Recipe</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{recipe.title}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 