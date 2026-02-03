import { useEffect } from 'react';
import { useCalendar } from '@/hooks/useCalendar';
import { useContentManager } from '@/hooks/useContentManager';
import { useAuth } from '@/hooks/useAuth';
import { CalendarHeader } from '@/components/Calendar/CalendarHeader';
import { CalendarGrid } from '@/components/Calendar/CalendarGrid';
import { ContentSidebar } from '@/components/Sidebar/ContentSidebar';
import { LoginPanel } from '@/components/Auth/LoginPanel';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

const Index = () => {
  const { token, isAuthenticated, isLoading: isAuthLoading, login, logout } = useAuth();
  const {
    contents,
    addContent,
    updateContent,
    deleteContent,
    saveAll,
  } = useContentManager(token);

  const {
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
  } = useCalendar(contents);

  // Enable dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleCloseSidebar = () => {
    setSelectedDate(null);
  };

  if (!isAuthenticated) {
    return <LoginPanel isLoading={isAuthLoading} onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Main Calendar Area */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <CalendarHeader
            currentDate={currentDate}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            onMonthChange={setMonth}
            onYearChange={setYear}
            onToday={goToToday}
          />
          <Button onClick={saveAll} variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
        <div className="flex justify-end mb-4">
          <Button onClick={logout} variant="ghost" size="sm">
            Déconnexion
          </Button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4 p-3 bg-card rounded-lg border border-border">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-muted-foreground">Statuts:</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-status-todo" />
              À faire
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-status-prepared" />
              Préparé
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-status-published" />
              Publié
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-muted-foreground">Genres:</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-genre-educatif" />
              Éducatif
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-genre-behind" />
              Behind
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-genre-humour" />
              Humour
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-genre-business" />
              Business
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-genre-portfolio" />
              Portfolio
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-genre-inspiration" />
              Inspiration
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-genre-interactif" />
              Interactif
            </span>
          </div>
        </div>

        <CalendarGrid
          days={calendarDays}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>

      {/* Sidebar */}
      <ContentSidebar
        isOpen={!!selectedDate}
        selectedDate={selectedDate}
        contents={selectedDayContents}
        onClose={handleCloseSidebar}
        onAddContent={addContent}
        onUpdateContent={updateContent}
        onDeleteContent={deleteContent}
      />
    </div>
  );
};

export default Index;
