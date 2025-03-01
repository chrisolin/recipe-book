import { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;
    
    // Don't add duplicate tags
    if (tags.includes(trimmedTag)) {
      setInputValue('');
      return;
    }
    
    onChange([...tags, trimmedTag]);
    setInputValue('');
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(newTags);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
          >
            <span>{tag}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-5 w-5 ml-1 p-0"
              onClick={() => removeTag(index)}
              aria-label={`Remove ${tag} tag`}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag (press Enter or comma to add)"
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => addTag(inputValue)}
          disabled={!inputValue.trim()}
        >
          Add
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mt-1">
        Press Enter or comma to add a tag
      </p>
    </div>
  );
} 