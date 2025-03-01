'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import RecipeForm from '@/components/recipes/recipe-form';
import { ArrowLeft } from 'lucide-react';

export default function NewRecipePage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Add New Recipe</h1>
        <div className="w-[73px]"></div> {/* Spacer for centering */}
      </div>

      <RecipeForm />
    </div>
  );
} 