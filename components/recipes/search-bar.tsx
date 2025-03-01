import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search recipes...',
  className = '',
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Update local state when prop value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle input change with debounce
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Update parent state after a short delay
    const timeoutId = setTimeout(() => {
      onChange(newValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // Clear search
  const handleClear = () => {
    setInputValue('');
    onChange('');
  };

  return (
    <div className={`relative group ${className}`}>
      <div 
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
          isFocused ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground/70'
        }`}
      >
        <Search className="h-4 w-4" />
      </div>
      
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`pl-10 pr-10 transition-all duration-200 border-border/60 ${
          isFocused 
            ? 'border-primary ring-1 ring-primary/20' 
            : 'hover:border-border'
        }`}
      />
      
      {inputValue && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/80"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
} 