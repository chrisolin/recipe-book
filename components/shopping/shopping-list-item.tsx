'use client';

import { useState } from 'react';
import { ShoppingItem } from '@/lib/types';
import { toggleShoppingListItem } from '@/lib/shopping-list';

interface ShoppingListItemProps {
  item: ShoppingItem;
  shoppingListId: string;
  recipeName: string;
}

export function ShoppingListItem({ item, shoppingListId, recipeName }: ShoppingListItemProps) {
  const [checked, setChecked] = useState(item.checked);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      const newChecked = !checked;
      setChecked(newChecked);
      await toggleShoppingListItem(shoppingListId, item.id);
    } catch (error) {
      // Revert on error
      setChecked(checked);
      console.error('Failed to update item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center py-2 border-b border-gray-100 last:border-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleToggle}
        disabled={isUpdating}
        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
      />
      <div className="ml-3 flex-1">
        <p className={`text-sm ${checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
          {item.name}
        </p>
        <p className="text-xs text-gray-500">
          {recipeName}
        </p>
      </div>
    </div>
  );
} 