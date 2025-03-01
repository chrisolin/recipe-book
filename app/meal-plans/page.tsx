'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllMealPlans } from '@/lib/data-manager';
import { MealPlan } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MealPlanList from '@/components/meal-plans/meal-plan-list';

export default function MealPlansPage() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch meal plans
  useEffect(() => {
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
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Meal Plans</h1>
        <Button asChild>
          <Link href="/meal-plans/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Link>
        </Button>
      </div>

      <MealPlanList
        initialMealPlans={mealPlans}
        loading={loading}
      />
    </div>
  );
} 