import { useState, useEffect } from 'react';
import { MealPlan } from '@/lib/types';
import { getAllMealPlans } from '@/lib/data-manager';
import MealPlanCard from './meal-plan-card';

interface MealPlanListProps {
  initialMealPlans?: MealPlan[];
  loading?: boolean;
}

export default function MealPlanList({
  initialMealPlans,
  loading: externalLoading,
}: MealPlanListProps) {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(initialMealPlans || []);
  const [loading, setLoading] = useState(externalLoading !== undefined ? externalLoading : !initialMealPlans);

  // Fetch meal plans if not provided
  useEffect(() => {
    if (!initialMealPlans && externalLoading === undefined) {
      const fetchMealPlans = async () => {
        try {
          const allMealPlans = await getAllMealPlans();
          setMealPlans(allMealPlans);
        } catch (error) {
          console.error('Error fetching meal plans:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchMealPlans();
    }
  }, [initialMealPlans, externalLoading]);

  // Update meal plans when initialMealPlans changes
  useEffect(() => {
    if (initialMealPlans) {
      setMealPlans(initialMealPlans);
    }
  }, [initialMealPlans]);

  // Update loading state when externalLoading changes
  useEffect(() => {
    if (externalLoading !== undefined) {
      setLoading(externalLoading);
    }
  }, [externalLoading]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-md border border-border bg-card animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (mealPlans.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-muted-foreground">No meal plans found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create your first meal plan to get started
        </p>
      </div>
    );
  }

  // Sort meal plans by start date (newest first)
  const sortedMealPlans = [...mealPlans].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedMealPlans.map((mealPlan) => (
        <MealPlanCard key={mealPlan.id} mealPlan={mealPlan} />
      ))}
    </div>
  );
} 