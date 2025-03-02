'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingList as ShoppingListType, Recipe } from '@/lib/types';
import { ShoppingListItem } from './shopping-list-item';
import { groupShoppingListByRecipe, removeShoppingList } from '@/lib/shopping-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface ShoppingListProps {
  shoppingList: ShoppingListType;
  recipes: Record<string, Recipe>;
  mealPlanName?: string;
}

export function ShoppingList({ shoppingList, recipes, mealPlanName }: ShoppingListProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Group items by recipe
  const groupedItems = groupShoppingListByRecipe(shoppingList);
  
  // Calculate progress
  const totalItems = shoppingList.items.length;
  const checkedItems = shoppingList.items.filter(item => item.checked).length;
  const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
  
  const handleDelete = async () => {
    if (isDeleting) return;
    
    if (confirm('Are you sure you want to delete this shopping list?')) {
      setIsDeleting(true);
      try {
        await removeShoppingList(shoppingList.id);
        router.push('/shopping');
      } catch (error) {
        console.error('Failed to delete shopping list:', error);
        setIsDeleting(false);
      }
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          Shopping List
          {mealPlanName && <span className="text-lg font-normal ml-2">for {mealPlanName}</span>}
        </CardTitle>
        <CardDescription>
          Created on {format(new Date(shoppingList.createdAt), 'MMMM d, yyyy')}
        </CardDescription>
        <div className="mt-2">
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([recipeId, items]) => (
            <div key={recipeId} className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">
                {recipes[recipeId]?.title || 'Unknown Recipe'}
              </h3>
              <div className="space-y-1">
                {items.map(item => (
                  <ShoppingListItem
                    key={item.id}
                    item={item}
                    shoppingListId={shoppingList.id}
                    recipeName={recipes[recipeId]?.title || 'Unknown Recipe'}
                  />
                ))}
              </div>
            </div>
          ))}
          
          {Object.keys(groupedItems).length === 0 && (
            <p className="text-center py-8 text-gray-500">No items in this shopping list.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete List'}
        </Button>
      </CardFooter>
    </Card>
  );
} 