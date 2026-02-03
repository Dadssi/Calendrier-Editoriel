import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onToday: () => void;
}

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export function CalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onMonthChange,
  onYearChange,
  onToday,
}: CalendarHeaderProps) {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // Generate years range
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">
          Calendrier Éditorial
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="text-sm"
        >
          Aujourd'hui
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPreviousMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Select
              value={currentMonth.toString()}
              onValueChange={(value) => onMonthChange(parseInt(value))}
            >
              <SelectTrigger className="w-[130px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month, index) => (
                  <SelectItem key={month} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={currentYear.toString()}
              onValueChange={(value) => onYearChange(parseInt(value))}
            >
              <SelectTrigger className="w-[90px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onNextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
