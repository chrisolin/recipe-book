import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

interface IngredientInputProps {
  ingredients: string[];
  onChange: (ingredients: string[]) => void;
}

export default function IngredientInput({
  ingredients,
  onChange,
}: IngredientInputProps) {
  const handleIngredientChange = (index: number, value: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
    onChange(updatedIngredients);
  };

  const addIngredient = () => {
    onChange([...ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length === 1) {
      // Don't remove the last ingredient, just clear it
      onChange(['']);
      return;
    }
    
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    onChange(updatedIngredients);
  };

  return (
    <div className="space-y-2">
      {ingredients.map((ingredient, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={ingredient}
            onChange={(e) => handleIngredientChange(index, e.target.value)}
            placeholder={`Ingredient ${index + 1}`}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeIngredient(index)}
            aria-label="Remove ingredient"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={addIngredient}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Ingredient
      </Button>
    </div>
  );
} 