import { Content, Genre, Status } from '@/types/content';
import { cn } from '@/lib/utils';

interface ContentBadgeProps {
  content: Content;
  compact?: boolean;
}

const genreColors: Record<Genre, string> = {
  educatif: 'bg-genre-educatif',
  behind: 'bg-genre-behind',
  humour: 'bg-genre-humour',
  business: 'bg-genre-business',
  portfolio: 'bg-genre-portfolio',
  inspiration: 'bg-genre-inspiration',
  interactif: 'bg-genre-interactif',
};

const statusBorders: Record<Status, string> = {
  todo: 'border-l-status-todo',
  prepared: 'border-l-status-prepared',
  published: 'border-l-status-published',
};

export function ContentBadge({ content, compact = false }: ContentBadgeProps) {
  if (compact) {
    return (
      <div
        className={cn(
          'h-2 w-2 rounded-full',
          genreColors[content.genre]
        )}
        title={content.title}
      />
    );
  }

  return (
    <div
      className={cn(
        'text-xs px-2 py-1 rounded bg-secondary/80 border-l-2 truncate max-w-full',
        statusBorders[content.status]
      )}
      title={content.title}
    >
      <span className="truncate">{content.title}</span>
    </div>
  );
}
