import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Recipe } from '@/lib/types';
import { addRecipe, updateRecipe } from '@/lib/data-manager';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import IngredientInput from './ingredient-input';
import TagInput from './tag-input';

// Form validation schema
const recipeFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  ingredients: z.array(z.string()).min(1, 'At least one ingredient is required'),
  tags: z.array(z.string()),
  imageUrl: z.string().optional(),
});

type RecipeFormValues = z.infer<typeof recipeFormSchema>;

interface RecipeFormProps {
  recipe?: Recipe;
  onSuccess?: () => void;
}

export default function RecipeForm({ recipe, onSuccess }: RecipeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with existing recipe data or defaults
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: recipe
      ? {
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          tags: recipe.tags,
          imageUrl: recipe.imageUrl || '',
        }
      : {
          title: '',
          description: '',
          ingredients: [''],
          tags: [],
          imageUrl: '',
        },
  });

  const onSubmit = async (values: RecipeFormValues) => {
    setIsSubmitting(true);
    try {
      if (recipe) {
        // Update existing recipe
        await updateRecipe(recipe.id, values);
      } else {
        // Add new recipe
        await addRecipe(values);
      }
      
      // Navigate or call success callback
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/recipes');
        router.refresh();
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter recipe title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter recipe description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredients</FormLabel>
                  <FormControl>
                    <IngredientInput
                      ingredients={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagInput
                      tags={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter image URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Saving...'
                  : recipe
                  ? 'Update Recipe'
                  : 'Add Recipe'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 