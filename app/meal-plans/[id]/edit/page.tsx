'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMealPlanById } from '@/lib/data-manager';
import { MealPlan } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import MealPlanForm from '@/components/meal-plans/meal-plan-form';

interface EditMealPlanPageProps {
  params: {
    id: string;
  };
}

export default function EditMealPlanPage({ params }: EditMealPlanPageProps) {
  const router = useRouter();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const plan = await getMealPlanById(params.id);
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
  }, [params.id, router]);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/meal-plans/${params.id}`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Meal Plan
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Edit Meal Plan</h1>
        <p className="text-muted-foreground mt-1">
          Update your meal plan details and schedule
        </p>
      </div>

      <MealPlanForm mealPlan={mealPlan} />
    </div>
  );
} 