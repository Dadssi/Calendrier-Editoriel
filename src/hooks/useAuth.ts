import { useCallback, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

const STORAGE_KEY = 'ce_admin_token';

type LoginResponse = {
  token: string;
};

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY);
  });
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = useMemo(() => !!token, [token]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      localStorage.setItem(STORAGE_KEY, data.token);
      setToken(data.token);
      toast.success('Connexion réussie');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Connexion échouée';
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    toast.success('Déconnecté');
  }, []);

  return {
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
