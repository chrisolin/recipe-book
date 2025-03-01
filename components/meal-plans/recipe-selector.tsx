import { useState, useEffect } from 'react';
import { Meal, Recipe } from '@/lib/types';
import { getAllRecipes } from '@/lib/data-manager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UtensilsCrossed } from 'lucide-react';

interface RecipeSelectorProps {
  meals: Meal[];
  onUpdateRecipe: (mealId: string, recipeId: string) => void;
  onUpdateNotes: (mealId: string, notes: string) => void;
}

export default function RecipeSelector({
  meals,
  onUpdateRecipe,
  onUpdateNotes,
}: RecipeSelectorProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const allRecipes = await getAllRecipes();
        setRecipes(allRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Group meals by date
  const mealsByDate = meals.reduce<Record<string, Meal[]>>((acc, meal) => {
    const date = new Date(meal.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
    
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    
    acc[formattedDate].push(meal);
    return acc;
  }, {});

  if (meals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5" />
            Select Recipes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            Add meals to your plan first
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5" />
          Select Recipes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(mealsByDate).map(([date, dayMeals]) => (
            <div key={date} className="space-y-4">
              <h3 className="font-medium">{date}</h3>
              
              <div className="space-y-4">
                {dayMeals.map(meal => (
                  <div key={meal.id} className="border rounded-md p-4 space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Recipe
                      </label>
                      <Select
                        value={meal.recipeId || ''}
                        onValueChange={(value) => onUpdateRecipe(meal.id, value)}
                        disabled={loading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a recipe" />
                        </SelectTrigger>
                        <SelectContent>
                          {recipes.map(recipe => (
                            <SelectItem key={recipe.id} value={recipe.id}>
                              {recipe.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {meal.recipeId && (
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">
                          Notes
                        </label>
                        <Textarea
                          placeholder="Add any notes about this meal..."
                          value={meal.notes || ''}
                          onChange={(e) => onUpdateNotes(meal.id, e.target.value)}
                          className="resize-none"
                          rows={2}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 