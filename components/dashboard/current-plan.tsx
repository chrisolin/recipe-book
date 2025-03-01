'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppData } from '@/app/providers';
import { MealPlan, Recipe, Meal } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarRange, ChevronRight, PlusCircle, ShoppingCart } from 'lucide-react';

export default function CurrentPlan() {
  const { data, isLoading } = useAppData();
  const [currentPlan, setCurrentPlan] = useState<MealPlan | null>(null);
  const [todaysMeals, setTodaysMeals] = useState<{meal: Meal, recipe: Recipe}[]>([]);
  
  useEffect(() => {
    if (data && !isLoading) {
      // Find the current meal plan (plan that includes today's date)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const currentPlans = Object.values(data.mealPlans).filter(plan => {
        const startDate = new Date(plan.startDate);
        const endDate = new Date(plan.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        return startDate <= today && endDate >= today;
      });
      
      // Sort by start date (most recent first) and take the first one
      const sortedPlans = currentPlans.sort((a, b) => 
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      
      const plan = sortedPlans.length > 0 ? sortedPlans[0] : null;
      setCurrentPlan(plan);
      
      // Find today's meals if we have a current plan
      if (plan) {
        const todayStr = today.toISOString().split('T')[0];
        const meals = plan.meals.filter(meal => 
          new Date(meal.date).toISOString().split('T')[0] === todayStr
        );
        
        // Get the recipe details for each meal
        const mealsWithRecipes = meals.map(meal => {
          const recipe = data.recipes[meal.recipeId];
          return { meal, recipe };
        }).filter(item => item.recipe); // Filter out any meals with missing recipes
        
        setTodaysMeals(mealsWithRecipes);
      }
    }
  }, [data, isLoading]);
  
  // Format date range for display
  const formatDateRange = (plan: MealPlan) => {
    const start = new Date(plan.startDate);
    const end = new Date(plan.endDate);
    
    const startFormatted = start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    
    const endFormatted = end.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    
    return `${startFormatted} - ${endFormatted}`;
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Current Meal Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentPlan) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Current Meal Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CalendarRange className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No active meal plan</h3>
            <p className="text-muted-foreground mb-6">
              You don&apos;t have a meal plan that includes today&apos;s date.
            </p>
            <Button asChild>
              <Link href="/meal-plans/new">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Meal Plan
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Current Meal Plan</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <Link href={`/meal-plans/${currentPlan.id}`} className="block hover:bg-accent/50 transition-colors rounded-md p-2 -mx-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <h3 className="font-semibold text-lg">{currentPlan.name}</h3>
              <div className="flex items-center text-muted-foreground text-sm">
                <CalendarRange className="h-3.5 w-3.5 mr-1.5" />
                <span>{formatDateRange(currentPlan)}</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </Link>
        
        <div className="mt-4">
          <h4 className="font-medium text-sm mb-3">Today's Meals</h4>
          {todaysMeals.length > 0 ? (
            <ul className="space-y-2">
              {todaysMeals.map(({ meal, recipe }) => (
                <li key={meal.id} className="border rounded-md p-3">
                  <Link href={`/recipes/${recipe.id}`} className="block hover:underline">
                    <span className="font-medium">{recipe.title}</span>
                  </Link>
                  {meal.notes && (
                    <p className="text-sm text-muted-foreground mt-1">{meal.notes}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground py-2">No meals planned for today.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/meal-plans/${currentPlan.id}/edit`}>
            Edit Plan
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/shopping/${currentPlan.id}`}>
            <ShoppingCart className="h-4 w-4 mr-1.5" />
            Shopping List
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 