import { CalendarDay } from '@/types/content';
import { ContentBadge } from './ContentBadge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface DayCellProps {
  day: CalendarDay;
  isSelected: boolean;
  onClick: () => void;
}

export function DayCell({ day, isSelected, onClick }: DayCellProps) {
  const dayNumber = format(day.date, 'd');
  const hasContents = day.contents.length > 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        'min-h-[100px] p-2 border border-border rounded-lg transition-all duration-200',
        'hover:border-primary/50 hover:bg-secondary/30',
        'flex flex-col items-start text-left',
        !day.isCurrentMonth && 'opacity-40',
        day.isToday && 'ring-2 ring-primary/50',
        isSelected && 'bg-primary/10 border-primary'
      )}
    >
      <span
        className={cn(
          'text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full',
          day.isToday && 'bg-primary text-primary-foreground'
        )}
      >
        {dayNumber}
      </span>

      {hasContents && (
        <div className="flex flex-col gap-1 w-full mt-1">
          {day.contents.slice(0, 3).map((content) => (
            <ContentBadge key={content.id} content={content} />
          ))}
          {day.contents.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{day.contents.length - 3} autres
            </span>
          )}
        </div>
      )}

      {!hasContents && day.isCurrentMonth && (
        <div className="flex-1 flex items-center justify-center w-full opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-xs text-muted-foreground">+ Ajouter</span>
        </div>
      )}
    </button>
  );
}
