import { CalendarDay } from '@/types/content';
import { DayCell } from './DayCell';
import { format, isSameDay } from 'date-fns';

interface CalendarGridProps {
  days: CalendarDay[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export function CalendarGrid({ days, selectedDate, onSelectDate }: CalendarGridProps) {
  return (
    <div className="flex-1">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <DayCell
            key={index}
            day={day}
            isSelected={selectedDate ? isSameDay(day.date, selectedDate) : false}
            onClick={() => onSelectDate(day.date)}
          />
        ))}
      </div>
    </div>
  );
}
