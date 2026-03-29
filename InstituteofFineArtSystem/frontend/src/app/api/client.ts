// Base API client — attaches JWT token, auto-refreshes on 401

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? `${window.location.origin}/api`;

function getToken(): string | null {
  try {
    const user = localStorage.getItem('currentUser');
    if (!user) return null;
    return JSON.parse(user).token ?? null;
  } catch { return null; }
}

function getRefreshToken(): string | null {
  try {
    return localStorage.getItem('refreshToken');
  } catch { return null; }
}

function saveTokens(accessToken: string, refreshToken: string) {
  // Update token in currentUser object
  const stored = localStorage.getItem('currentUser');
  if (stored) {
    const user = JSON.parse(stored);
    user.token = accessToken;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
  localStorage.setItem('refreshToken', refreshToken);
}

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

async function tryRefresh(): Promise<string | null> {
  const rt = getRefreshToken();
  if (!rt) return null;

  if (isRefreshing) {
    return new Promise(resolve => { refreshQueue.push(resolve); });
  }

  isRefreshing = true;
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    });
    if (!res.ok) throw new Error('Refresh failed');
    const data = await res.json();
    saveTokens(data.token, data.refreshToken);
    refreshQueue.forEach(cb => cb(data.token));
    refreshQueue = [];
    return data.token;
  } catch {
    // Refresh failed — clear session
    localStorage.removeItem('currentUser');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    return null;
  } finally {
    isRefreshing = false;
  }
}

async function request<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // Auto-refresh on 401
  if (res.status === 401 && retry) {
    const newToken = await tryRefresh();
    if (newToken) return request<T>(path, options, false);
    throw new Error('Session expired');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? 'Request failed');
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  uploadFile: async (file: File): Promise<string> => {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message ?? 'Upload failed');
    }
    const data = await res.json();
    return data.url as string;
  },
};
