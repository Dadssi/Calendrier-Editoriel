import { useState, useCallback, useEffect } from 'react';
import { Content } from '@/types/content';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

type ContentPayload = Omit<Content, 'id'>;

export function useContentManager(token: string | null) {
  const [contents, setContents] = useState<Content[]>([]);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    if (!token) {
      setContents([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiFetch<Content[]>('/contents', { token });
      setContents(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Impossible de charger les contenus.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const addContent = useCallback(
    async (content: ContentPayload) => {
      if (!token) {
        toast.error('Connexion requise');
        return null;
      }

      try {
        const created = await apiFetch<Content>('/contents', {
          method: 'POST',
          token,
          body: content,
        });
        setContents((prev) => [...prev, created]);
        toast.success('Contenu ajouté avec succès');
        return created;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Échec de la création.';
        toast.error(message);
        return null;
      }
    },
    [token]
  );

  const updateContent = useCallback(
    async (id: number, updates: Partial<Content>) => {
      if (!token) {
        toast.error('Connexion requise');
        return;
      }

      try {
        const updated = await apiFetch<Content>(`/contents/${id}`, {
          method: 'PUT',
          token,
          body: updates,
        });
        setContents((prev) => prev.map((content) => (content.id === id ? updated : content)));
        setEditingContent(null);
        toast.success('Contenu mis à jour');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Échec de la mise à jour.';
        toast.error(message);
      }
    },
    [token]
  );

  const deleteContent = useCallback(
    async (id: number) => {
      if (!token) {
        toast.error('Connexion requise');
        return;
      }

      try {
        await apiFetch(`/contents/${id}`, {
          method: 'DELETE',
          token,
        });
        setContents((prev) => prev.filter((content) => content.id !== id));
        setEditingContent(null);
        toast.success('Contenu supprimé');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Échec de la suppression.';
        toast.error(message);
      }
    },
    [token]
  );

  const getContentsByDate = useCallback(
    (date: string) => {
      return contents.filter((content) => content.date === date);
    },
    [contents]
  );

  const saveAll = useCallback(async () => {
    await fetchAll();
    toast.success('Synchronisation terminée');
  }, [fetchAll]);

  return {
    contents,
    editingContent,
    setEditingContent,
    addContent,
    updateContent,
    deleteContent,
    getContentsByDate,
    saveAll,
    isLoading,
  };
}
