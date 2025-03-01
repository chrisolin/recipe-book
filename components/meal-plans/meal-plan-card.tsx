import Link from 'next/link';
import { MealPlan } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarRange, ChevronRight, ShoppingCart } from 'lucide-react';

interface MealPlanCardProps {
  mealPlan: MealPlan;
}

export default function MealPlanCard({ mealPlan }: MealPlanCardProps) {
  // Format date range for display
  const formatDateRange = () => {
    const start = new Date(mealPlan.startDate);
    const end = new Date(mealPlan.endDate);
    
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

  // Calculate days in the plan
  const getDaysCount = () => {
    const start = new Date(mealPlan.startDate);
    const end = new Date(mealPlan.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Count meals in the plan
  const getMealsCount = () => {
    return mealPlan.meals.length;
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Link href={`/meal-plans/${mealPlan.id}`} className="block p-6 hover:bg-accent/50 transition-colors">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <h3 className="font-semibold text-lg">{mealPlan.name}</h3>
              <div className="flex items-center text-muted-foreground text-sm">
                <CalendarRange className="h-3.5 w-3.5 mr-1.5" />
                <span>{formatDateRange()}</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm">
                <span>{getDaysCount()} days</span>
                <span>{getMealsCount()} meals</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </Link>
      </CardContent>
      <CardFooter className="flex justify-between p-3 bg-muted/50 border-t">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/meal-plans/${mealPlan.id}/edit`}>
            Edit
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/shopping/${mealPlan.id}`}>
            <ShoppingCart className="h-4 w-4 mr-1.5" />
            Shopping List
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 