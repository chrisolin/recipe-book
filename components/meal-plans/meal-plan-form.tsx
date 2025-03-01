import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MealPlan, Meal } from '@/lib/types';
import { addMealPlan, updateMealPlan } from '@/lib/data-manager';
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
import { Card, CardContent } from '@/components/ui/card';
import DaySelector from './day-selector';
import RecipeSelector from './recipe-selector';

// Form validation schema
const mealPlanFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  meals: z.array(
    z.object({
      id: z.string(),
      date: z.string(),
      recipeId: z.string().min(1, 'Recipe is required'),
      notes: z.string().optional(),
    })
  ),
});

type MealPlanFormValues = z.infer<typeof mealPlanFormSchema>;

interface MealPlanFormProps {
  mealPlan?: MealPlan;
  onSuccess?: () => void;
}

export default function MealPlanForm({ mealPlan, onSuccess }: MealPlanFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with existing meal plan data or defaults
  const form = useForm<MealPlanFormValues>({
    resolver: zodResolver(mealPlanFormSchema),
    defaultValues: mealPlan
      ? {
          name: mealPlan.name,
          startDate: mealPlan.startDate,
          endDate: mealPlan.endDate,
          meals: mealPlan.meals,
        }
      : {
          name: '',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          meals: [],
        },
  });

  const onSubmit = async (values: MealPlanFormValues) => {
    setIsSubmitting(true);
    try {
      if (mealPlan) {
        // Update existing meal plan
        await updateMealPlan(mealPlan.id, values);
      } else {
        // Create new meal plan
        await addMealPlan(values);
      }

      // Navigate or call success callback
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/meal-plans');
        router.refresh();
      }
    } catch (error) {
      console.error('Error saving meal plan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the current meals from the form
  const meals = form.watch('meals');
  
  // Add a meal for a specific date
  const addMeal = (date: string, recipeId: string = '') => {
    const newMeal: Meal = {
      id: crypto.randomUUID(),
      date,
      recipeId,
      notes: '',
    };
    
    const updatedMeals = [...meals, newMeal];
    form.setValue('meals', updatedMeals);
  };
  
  // Remove a meal by ID
  const removeMeal = (mealId: string) => {
    const updatedMeals = meals.filter(meal => meal.id !== mealId);
    form.setValue('meals', updatedMeals);
  };
  
  // Update a meal's recipe
  const updateMealRecipe = (mealId: string, recipeId: string) => {
    const updatedMeals = meals.map(meal => 
      meal.id === mealId ? { ...meal, recipeId } : meal
    );
    form.setValue('meals', updatedMeals);
  };
  
  // Update a meal's notes
  const updateMealNotes = (mealId: string, notes: string) => {
    const updatedMeals = meals.map(meal => 
      meal.id === mealId ? { ...meal, notes } : meal
    );
    form.setValue('meals', updatedMeals);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meal Plan Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Weekly Meal Plan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <DaySelector
          startDate={form.watch('startDate')}
          endDate={form.watch('endDate')}
          meals={meals}
          onAddMeal={addMeal}
          onRemoveMeal={removeMeal}
        />

        <RecipeSelector
          meals={meals}
          onUpdateRecipe={updateMealRecipe}
          onUpdateNotes={updateMealNotes}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : mealPlan ? 'Update Meal Plan' : 'Create Meal Plan'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 