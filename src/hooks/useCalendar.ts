import { useState, useMemo } from 'react';
import { CalendarDay, Content } from '@/types/content';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  format,
} from 'date-fns';
import { fr } from 'date-fns/locale';

export function useCalendar(contents: Content[]) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const calendarDays = useMemo((): CalendarDay[] => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { locale: fr, weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { locale: fr, weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return days.map((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayContents = contents.filter((c) => c.date === dateStr);

      return {
        date,
        isCurrentMonth: isSameMonth(date, currentDate),
        isToday: isToday(date),
        contents: dayContents,
      };
    });
  }, [currentDate, contents]);

  const selectedDayContents = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return contents.filter((c) => c.date === dateStr);
  }, [selectedDate, contents]);

  const goToPreviousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const setMonth = (month: number) => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), month, 1));
  };

  const setYear = (year: number) => {
    setCurrentDate((prev) => new Date(year, prev.getMonth(), 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  return {
    currentDate,
    selectedDate,
    setSelectedDate,
    calendarDays,
    selectedDayContents,
    goToPreviousMonth,
    goToNextMonth,
    setMonth,
    setYear,
    goToToday,
  };
}
