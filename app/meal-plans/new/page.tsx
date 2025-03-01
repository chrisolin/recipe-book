'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import MealPlanForm from '@/components/meal-plans/meal-plan-form';

export default function NewMealPlanPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/meal-plans">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Meal Plans
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Create New Meal Plan</h1>
        <p className="text-muted-foreground mt-1">
          Plan your meals for the week or any custom period
        </p>
      </div>

      <MealPlanForm />
    </div>
  );
} 