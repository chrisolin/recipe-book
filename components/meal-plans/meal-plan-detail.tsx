import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MealPlan, Recipe } from '@/lib/types';
import { deleteMealPlan, getRecipeById } from '@/lib/data-manager';
import { generateShoppingList } from '@/lib/shopping-list';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CalendarRange, Pencil, Trash2, ShoppingCart, UtensilsCrossed } from 'lucide-react';

interface MealPlanDetailProps {
  mealPlan: MealPlan;
}

export default function MealPlanDetail({ mealPlan }: MealPlanDetailProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGeneratingList, setIsGeneratingList] = useState(false);
  const [mealsByDate, setMealsByDate] = useState<Record<string, { date: Date; meals: { id: string; recipeId: string; notes?: string; recipe?: Recipe }[] }>>({});
  const [loading, setLoading] = useState(true);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Format date range for display
  const formatDateRange = () => {
    const start = new Date(mealPlan.startDate);
    const end = new Date(mealPlan.endDate);
    
    const startFormatted = start.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });
    
    const endFormatted = end.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    
    return `${startFormatted} - ${endFormatted}`;
  };

  // Handle delete
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMealPlan(mealPlan.id);
      setIsDeleteDialogOpen(false);
      router.push('/meal-plans');
      router.refresh();
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      setIsDeleting(false);
    }
  };

  const handleGenerateShoppingList = async () => {
    if (isGeneratingList) return;
    
    setIsGeneratingList(true);
    try {
      const shoppingList = await generateShoppingList(mealPlan.id);
      if (shoppingList) {
        router.push(`/shopping/${shoppingList.id}`);
      } else {
        console.error('Failed to generate shopping list');
        setIsGeneratingList(false);
      }
    } catch (error) {
      console.error('Error generating shopping list:', error);
      setIsGeneratingList(false);
    }
  };

  // Group meals by date and fetch recipe details
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true);
      
      // Group meals by date
      const groupedMeals: Record<string, { date: Date; meals: { id: string; recipeId: string; notes?: string; recipe?: Recipe }[] }> = {};
      
      // Create date entries for each day in the range
      const start = new Date(mealPlan.startDate);
      const end = new Date(mealPlan.endDate);
      
      for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
        const dateStr = day.toISOString().split('T')[0];
        groupedMeals[dateStr] = {
          date: new Date(day),
          meals: [],
        };
      }
      
      // Add meals to their respective dates
      for (const meal of mealPlan.meals) {
        const dateStr = meal.date.split('T')[0];
        
        if (groupedMeals[dateStr]) {
          // Fetch recipe details
          let recipe;
          if (meal.recipeId) {
            try {
              recipe = await getRecipeById(meal.recipeId);
            } catch (error) {
              console.error(`Error fetching recipe ${meal.recipeId}:`, error);
            }
          }
          
          groupedMeals[dateStr].meals.push({
            id: meal.id,
            recipeId: meal.recipeId,
            notes: meal.notes,
            recipe: recipe || undefined,
          });
        }
      }
      
      setMealsByDate(groupedMeals);
      setLoading(false);
    };
    
    fetchRecipeDetails();
  }, [mealPlan]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{mealPlan.name}</h1>
          <div className="flex items-center text-muted-foreground mt-1">
            <CalendarRange className="h-4 w-4 mr-1.5" />
            <span>{formatDateRange()}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/meal-plans/${mealPlan.id}/edit`}>
              <Pencil className="h-4 w-4 mr-1.5" />
              Edit
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGenerateShoppingList}
            disabled={isGeneratingList}
          >
            <ShoppingCart className="h-4 w-4 mr-1.5" />
            {isGeneratingList ? 'Generating...' : 'Generate Shopping List'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Delete
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-md border border-border bg-card animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(mealsByDate)
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
            .map(([dateStr, { date, meals }]) => (
              <Card key={dateStr}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {meals.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <UtensilsCrossed className="h-5 w-5 mx-auto mb-2" />
                      <p>No meals planned for this day</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {meals.map((meal) => (
                        <div key={meal.id} className="border rounded-md p-4">
                          {meal.recipe ? (
                            <div>
                              <h3 className="font-medium">
                                <Link
                                  href={`/recipes/${meal.recipeId}`}
                                  className="hover:underline"
                                >
                                  {meal.recipe.title}
                                </Link>
                              </h3>
                              {meal.notes && (
                                <div className="mt-2 text-sm text-muted-foreground">
                                  <p className="font-medium mb-1">Notes:</p>
                                  <p>{meal.notes}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-muted-foreground italic">
                              Recipe not found
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Meal Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this meal plan? This action cannot be undone.
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
    </div>
  );
} 