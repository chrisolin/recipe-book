import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterTagsProps {
  allTags: string[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
  onClearAll: () => void;
  className?: string;
}

export default function FilterTags({
  allTags,
  selectedTags,
  onTagClick,
  onClearAll,
  className = '',
}: FilterTagsProps) {
  if (allTags.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-medium">Filter by Tags</h2>
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-auto py-1 px-2 text-xs"
          >
            Clear Filters
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <TagBadge
            key={tag}
            tag={tag}
            selected={selectedTags.includes(tag)}
            onClick={() => onTagClick(tag)}
          />
        ))}
      </div>
      
      {selectedTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="text-xs text-muted-foreground py-1">Active filters:</span>
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary text-primary-foreground"
            >
              {tag}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onTagClick(tag)}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

interface TagBadgeProps {
  tag: string;
  selected: boolean;
  onClick: () => void;
}

function TagBadge({ tag, selected, onClick }: TagBadgeProps) {
  return (
    <span
      onClick={onClick}
      className={`
        text-xs px-2 py-1 rounded-full cursor-pointer transition-colors
        ${
          selected
            ? 'bg-primary text-primary-foreground'
            : 'bg-primary/10 text-primary hover:bg-primary/20'
        }
      `}
    >
      {tag}
    </span>
  );
} 