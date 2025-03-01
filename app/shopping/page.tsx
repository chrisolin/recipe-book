import { Metadata } from 'next';
import Link from 'next/link';
import { getAllShoppingLists } from '@/lib/data-manager';
import { getAllMealPlans } from '@/lib/data-manager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export const metadata: Metadata = {
  title: 'Shopping Lists | Family Meal Planner',
  description: 'View and manage your shopping lists',
};

export default async function ShoppingListsPage() {
  const [shoppingLists, mealPlans] = await Promise.all([
    getAllShoppingLists(),
    getAllMealPlans(),
  ]);
  
  // Sort shopping lists by creation date (newest first)
  const sortedLists = [...shoppingLists].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Create a map of meal plan IDs to names for easy lookup
  const mealPlanMap = mealPlans.reduce((acc, plan) => {
    acc[plan.id] = plan.name;
    return acc;
  }, {} as Record<string, string>);
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Shopping Lists</h1>
      </div>
      
      {sortedLists.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedLists.map((list) => {
            const totalItems = list.items.length;
            const checkedItems = list.items.filter(item => item.checked).length;
            const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
            const mealPlanName = mealPlanMap[list.mealPlanId] || 'Unknown Meal Plan';
            
            return (
              <Card key={list.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl">Shopping List</CardTitle>
                  <CardDescription>
                    For meal plan: {mealPlanName}
                    <br />
                    Created on {format(new Date(list.createdAt), 'MMM d, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{checkedItems} of {totalItems} items checked</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Link href={`/shopping/${list.id}`} className="w-full">
                    <Button className="w-full">View List</Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No Shopping Lists Yet</h2>
          <p className="text-gray-500 mb-6">
            Create a meal plan first, then generate a shopping list from it.
          </p>
          <Link href="/meal-plans">
            <Button>Go to Meal Plans</Button>
          </Link>
        </div>
      )}
    </div>
  );
} 