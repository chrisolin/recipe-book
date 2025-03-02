import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getShoppingListWithMealPlan } from '@/lib/shopping-list';
import { ShoppingList } from '@/components/shopping/shopping-list';
import { getAllShoppingLists } from '@/lib/data-manager';

export const metadata: Metadata = {
  title: 'Shopping List | Family Meal Planner',
  description: 'View and manage your shopping list',
};

interface ShoppingListPageProps {
  params: Promise<{
    id: string;
  }>;
}

// This function generates all possible shopping list paths at build time
export async function generateStaticParams() {
  const shoppingLists = await getAllShoppingLists();
  return shoppingLists.map((list) => ({
    id: list.id,
  }));
}

export default async function ShoppingListPage({ params }: ShoppingListPageProps) {
  const { id } = await params;
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