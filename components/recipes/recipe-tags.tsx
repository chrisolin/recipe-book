interface RecipeTagsProps {
  tags: string[];
  limit?: number;
  onClick?: (tag: string) => void;
}

export default function RecipeTags({ tags, limit, onClick }: RecipeTagsProps) {
  // If no tags, return null
  if (!tags.length) return null;
  
  // Limit the number of tags to display if specified
  const displayTags = limit ? tags.slice(0, limit) : tags;
  const hasMore = limit && tags.length > limit;
  
  return (
    <div className="flex flex-wrap gap-1.5">
      {displayTags.map((tag, index) => (
        <span
          key={index}
          onClick={onClick ? (e) => {
            e.preventDefault();
            onClick(tag);
          } : undefined}
          className={`
            text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary
            ${onClick ? 'cursor-pointer hover:bg-primary/20' : ''}
          `}
        >
          {tag}
        </span>
      ))}
      
      {hasMore && (
        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
          +{tags.length - limit!}
        </span>
      )}
    </div>
  );
} 