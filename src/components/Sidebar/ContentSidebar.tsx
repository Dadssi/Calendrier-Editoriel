import { useState, useEffect } from 'react';
import { Content } from '@/types/content';
import { ContentList } from './ContentList';
import { ContentForm } from './ContentForm';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, X, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ContentSidebarProps {
  isOpen: boolean;
  selectedDate: Date | null;
  contents: Content[];
  onClose: () => void;
  onAddContent: (content: Omit<Content, 'id'>) => void;
  onUpdateContent: (id: string, content: Partial<Content>) => void;
  onDeleteContent: (id: string) => void;
}

export function ContentSidebar({
  isOpen,
  selectedDate,
  contents,
  onClose,
  onAddContent,
  onUpdateContent,
  onDeleteContent,
}: ContentSidebarProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);

  // Reset form state when date changes
  useEffect(() => {
    setIsFormOpen(false);
    setEditingContent(null);
  }, [selectedDate]);

  if (!isOpen || !selectedDate) {
    return null;
  }

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const formattedDate = format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr });

  const handleEdit = (content: Content) => {
    setEditingContent(content);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingContent(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingContent(null);
  };

  const handleSave = (content: Omit<Content, 'id'>) => {
    onAddContent(content);
    handleCloseForm();
  };

  const handleUpdate = (id: string, updates: Partial<Content>) => {
    onUpdateContent(id, updates);
    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    onDeleteContent(id);
    handleCloseForm();
  };

  return (
    <div
      className={cn(
        'w-[400px] h-full bg-card border-l border-border flex flex-col',
        'animate-slide-in-right'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Détails du jour</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground capitalize">{formattedDate}</p>
        <div className="mt-2 text-sm">
          <span className="text-primary font-medium">{contents.length}</span>
          <span className="text-muted-foreground"> contenu(s) prévu(s)</span>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        {isFormOpen ? (
          <ContentForm
            content={editingContent}
            selectedDate={dateStr}
            onSave={handleSave}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onClose={handleCloseForm}
          />
        ) : (
          <>
            <ContentList contents={contents} onEdit={handleEdit} />
            <Button
              onClick={handleAddNew}
              className="w-full mt-4"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un contenu
            </Button>
          </>
        )}
      </ScrollArea>
    </div>
  );
}
