import { Content, GENRES_CONFIG, FORMATS_CONFIG, Status } from '@/types/content';
import { PlatformIcon } from '@/components/PlatformIcon';
import { Clock, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentListProps {
  contents: Content[];
  onEdit: (content: Content) => void;
}

const statusColors: Record<Status, string> = {
  todo: 'bg-status-todo',
  prepared: 'bg-status-prepared',
  published: 'bg-status-published',
};

const statusLabels: Record<Status, string> = {
  todo: 'À faire',
  prepared: 'Préparé',
  published: 'Publié',
};

const genreColors: Record<string, string> = {
  educatif: 'bg-genre-educatif/20 text-genre-educatif',
  behind: 'bg-genre-behind/20 text-genre-behind',
  humour: 'bg-genre-humour/20 text-genre-humour',
  business: 'bg-genre-business/20 text-genre-business',
  portfolio: 'bg-genre-portfolio/20 text-genre-portfolio',
  inspiration: 'bg-genre-inspiration/20 text-genre-inspiration',
  interactif: 'bg-genre-interactif/20 text-genre-interactif',
};

export function ContentList({ contents, onEdit }: ContentListProps) {
  if (contents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Aucun contenu prévu pour ce jour</p>
      </div>
    );
  }

  // Sort by time
  const sortedContents = [...contents].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-3">
      {sortedContents.map((content) => (
        <div
          key={content.id}
          onClick={() => onEdit(content)}
          className={cn(
            'p-4 rounded-lg border border-border bg-card cursor-pointer',
            'hover:border-primary/50 transition-all group'
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={cn('w-2.5 h-2.5 rounded-full', statusColors[content.status])} />
              <span className="text-xs text-muted-foreground">{statusLabels[content.status]}</span>
            </div>
            <Edit2 className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <h4 className="font-medium text-foreground mb-1 line-clamp-1">{content.title}</h4>
          
          {content.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {content.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            <span className={cn('text-xs px-2 py-0.5 rounded-full', genreColors[content.genre])}>
              {GENRES_CONFIG[content.genre].label}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {FORMATS_CONFIG.find((f) => f.value === content.format)?.label}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {content.platforms.map((platform) => (
                <PlatformIcon key={platform} platform={platform} size="sm" />
              ))}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {content.time}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
