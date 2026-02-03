const DEFAULT_API_BASE = 'http://localhost:8888';

export function getApiBaseUrl(): string {
  const envBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return (envBase && envBase.trim() !== '' ? envBase : DEFAULT_API_BASE).replace(/\/$/, '');
}

type ApiOptions = {
  method?: string;
  token?: string | null;
  body?: unknown;
};

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
    headers['X-Auth-Token'] = options.token;
  }

  const response = await fetch(url, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = (data && data.error) ? data.error : 'Une erreur est survenue.';
    throw new Error(message);
  }

  return data as T;
}
