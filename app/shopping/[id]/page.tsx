import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getShoppingListWithMealPlan } from '@/lib/shopping-list';
import { ShoppingList } from '@/components/shopping/shopping-list';

export const metadata: Metadata = {
  title: 'Shopping List | Family Meal Planner',
  description: 'View and manage your shopping list',
};

interface ShoppingListPageProps {
  params: {
    id: string;
  };
}

export default async function ShoppingListPage({ params }: ShoppingListPageProps) {
  const { id } = params;
  const { shoppingList, mealPlan, recipes } = await getShoppingListWithMealPlan(id);
  
  if (!shoppingList) {
    notFound();
  }
  
  return (
    <div className="container py-6">
      <ShoppingList 
        shoppingList={shoppingList} 
        recipes={recipes} 
        mealPlanName={mealPlan?.name}
      />
    </div>
  );
} 