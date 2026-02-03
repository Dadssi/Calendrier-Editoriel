import { useState, useCallback } from 'react';
import { Content } from '@/types/content';
import { initialContents } from '@/data/initialData';
import { toast } from 'sonner';

export function useContentManager() {
  const [contents, setContents] = useState<Content[]>(initialContents);
  const [editingContent, setEditingContent] = useState<Content | null>(null);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const addContent = useCallback((content: Omit<Content, 'id'>) => {
    const newContent: Content = {
      ...content,
      id: generateId(),
    };
    setContents((prev) => [...prev, newContent]);
    toast.success('Contenu ajouté avec succès');
    return newContent;
  }, []);

  const updateContent = useCallback((id: string, updates: Partial<Content>) => {
    setContents((prev) =>
      prev.map((content) =>
        content.id === id ? { ...content, ...updates } : content
      )
    );
    setEditingContent(null);
    toast.success('Contenu mis à jour');
  }, []);

  const deleteContent = useCallback((id: string) => {
    setContents((prev) => prev.filter((content) => content.id !== id));
    setEditingContent(null);
    toast.success('Contenu supprimé');
  }, []);

  const getContentsByDate = useCallback(
    (date: string) => {
      return contents.filter((content) => content.date === date);
    },
    [contents]
  );

  const saveAll = useCallback(() => {
    // Simulation de sauvegarde - prêt pour une future API
    console.log('Saving contents:', contents);
    toast.success('Tous les contenus ont été sauvegardés');
    return Promise.resolve(contents);
  }, [contents]);

  return {
    contents,
    editingContent,
    setEditingContent,
    addContent,
    updateContent,
    deleteContent,
    getContentsByDate,
    saveAll,
  };
}
