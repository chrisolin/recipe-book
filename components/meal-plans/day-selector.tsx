import { useState, useEffect } from 'react';
import { Meal } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, PlusCircle, XCircle } from 'lucide-react';

interface DaySelectorProps {
  startDate: string;
  endDate: string;
  meals: Meal[];
  onAddMeal: (date: string, recipeId?: string) => void;
  onRemoveMeal: (mealId: string) => void;
}

export default function DaySelector({
  startDate,
  endDate,
  meals,
  onAddMeal,
  onRemoveMeal,
}: DaySelectorProps) {
  const [days, setDays] = useState<{ date: string; label: string }[]>([]);

  // Generate array of days between start and end date
  useEffect(() => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysArray = [];

    // Ensure dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

    // Generate days
    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
      const dateString = day.toISOString().split('T')[0];
      const dayOfWeek = day.toLocaleDateString('en-US', { weekday: 'long' });
      const monthDay = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      daysArray.push({
        date: dateString,
        label: `${dayOfWeek}, ${monthDay}`,
      });
    }

    setDays(daysArray);
  }, [startDate, endDate]);

  // Get meals for a specific date
  const getMealsForDate = (date: string) => {
    return meals.filter(meal => meal.date === date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Plan Your Meals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {days.map(day => (
            <div key={day.date} className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{day.label}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddMeal(day.date)}
                  className="h-8 px-2"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Meal
                </Button>
              </div>
              
              <div className="space-y-2">
                {getMealsForDate(day.date).length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No meals planned</p>
                ) : (
                  getMealsForDate(day.date).map(meal => (
                    <div key={meal.id} className="flex items-center justify-between bg-muted/50 rounded-md p-2">
                      <span className="text-sm">
                        {meal.recipeId ? 'Recipe selected' : 'No recipe selected'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveMeal(meal.id)}
                        className="h-6 w-6 p-0"
                      >
                        <XCircle className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
          
          {days.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Please select valid start and end dates to plan your meals
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 