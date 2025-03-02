'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMealPlanById, getAllMealPlans } from '@/lib/data-manager';
import { MealPlan } from '@/lib/types';
import MealPlanDetail from '@/components/meal-plans/meal-plan-detail';

interface MealPlanPageProps {
  params: Promise<{
    id: string;
  }>;
}

// This function generates all possible meal plan paths at build time
export async function generateStaticParams() {
  const mealPlans = await getAllMealPlans();
  return mealPlans.map((plan) => ({
    id: plan.id,
  }));
}

export default function MealPlanPage({ params }: MealPlanPageProps) {
  const router = useRouter();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const { id } = await params;
        const plan = await getMealPlanById(id);
        if (plan) {
          setMealPlan(plan);
        } else {
          setError('Meal plan not found');
          setTimeout(() => {
            router.push('/meal-plans');
          }, 2000);
        }
      } catch (err) {
        console.error('Error fetching meal plan:', err);
        setError('Error loading meal plan');
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, [params, router]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 bg-muted animate-pulse rounded-md" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded-md" />
        <div className="h-32 bg-muted animate-pulse rounded-md mt-6" />
        <div className="h-32 bg-muted animate-pulse rounded-md" />
        <div className="h-32 bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-destructive">{error}</h1>
        <p className="mt-2 text-muted-foreground">Redirecting to meal plans...</p>
      </div>
    );
  }

  if (!mealPlan) {
    return null;
  }

  return <MealPlanDetail mealPlan={mealPlan} />;
} 