import { X, Check } from 'lucide-react';
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

  // Group tags by first letter for better organization
  const groupedTags = allTags.reduce<Record<string, string[]>>((acc, tag) => {
    const firstLetter = tag.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(tag);
    return acc;
  }, {});

  // Sort the keys alphabetically
  const sortedKeys = Object.keys(groupedTags).sort();

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {sortedKeys.map((letter) => (
          <div key={letter} className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1.5">
              {groupedTags[letter].map((tag) => (
                <TagBadge
                  key={tag}
                  tag={tag}
                  selected={selectedTags.includes(tag)}
                  onClick={() => onTagClick(tag)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
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
    <button
      type="button"
      onClick={onClick}
      className={`
        group flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full cursor-pointer transition-all
        ${
          selected
            ? 'bg-primary/15 text-primary border border-primary/30 font-medium'
            : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent hover:border-border/50'
        }
      `}
    >
      <span className="relative">
        {selected && (
          <span className="absolute -left-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground">
            <Check className="h-2 w-2" />
          </span>
        )}
      </span>
      {tag}
    </button>
  );
} 