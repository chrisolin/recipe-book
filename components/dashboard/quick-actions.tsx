'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  CalendarRange, 
  PlusCircle, 
  ShoppingCart
} from 'lucide-react';

export default function QuickActions() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button variant="outline" className="h-auto py-4 justify-start" asChild>
            <Link href="/recipes/new">
              <PlusCircle className="h-5 w-5 mr-2" />
              <div className="flex flex-col items-start">
                <span>Add New Recipe</span>
                <span className="text-xs text-muted-foreground">Create a new recipe</span>
              </div>
            </Link>
          </Button>
          
          <Button variant="outline" className="h-auto py-4 justify-start" asChild>
            <Link href="/meal-plans/new">
              <CalendarRange className="h-5 w-5 mr-2" />
              <div className="flex flex-col items-start">
                <span>Create Meal Plan</span>
                <span className="text-xs text-muted-foreground">Plan your meals</span>
              </div>
            </Link>
          </Button>
          
          <Button variant="outline" className="h-auto py-4 justify-start" asChild>
            <Link href="/recipes">
              <BookOpen className="h-5 w-5 mr-2" />
              <div className="flex flex-col items-start">
                <span>Browse Recipes</span>
                <span className="text-xs text-muted-foreground">View all recipes</span>
              </div>
            </Link>
          </Button>
          
          <Button variant="outline" className="h-auto py-4 justify-start" asChild>
            <Link href="/shopping">
              <ShoppingCart className="h-5 w-5 mr-2" />
              <div className="flex flex-col items-start">
                <span>Shopping Lists</span>
                <span className="text-xs text-muted-foreground">View shopping lists</span>
              </div>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 