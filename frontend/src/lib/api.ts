export const API_BASE = import.meta?.env?.VITE_API_URL || 'http://localhost:4000';

export async function apiFetch(path: string, init?: RequestInit) {
  const token = localStorage.getItem('peve_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init?.headers || {}),
  };
  if (token) (headers as any).Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'Request failed');
  return data;
}

export function setAuthTokens(token: string, refreshToken?: string) {
  localStorage.setItem('peve_token', token);
  if (refreshToken) localStorage.setItem('peve_refresh', refreshToken);
}

export function clearAuthTokens() {
  localStorage.removeItem('peve_token');
  localStorage.removeItem('peve_refresh');
}


