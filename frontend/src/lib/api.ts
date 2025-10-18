export const API_BASE = import.meta?.env?.VITE_API_URL || 'http://localhost:4000';

// Debug logging
console.log('🔍 API Configuration Debug:');
console.log('VITE_API_URL from env:', import.meta?.env?.VITE_API_URL);
console.log('Final API_BASE:', API_BASE);
console.log('All env vars:', import.meta?.env);

// Force check - if still localhost, something is wrong
if (API_BASE.includes('localhost')) {
  console.error('❌ CRITICAL: Frontend is using localhost! Check VITE_API_URL environment variable in Vercel!');
}

export async function apiFetch(path: string, init?: RequestInit) {
  const token = localStorage.getItem('peve_token');
  const headers: HeadersInit = {
    ...(init?.headers || {}),
  };
  
  // Only set Content-Type for non-FormData requests
  if (!(init?.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) (headers as any).Authorization = `Bearer ${token}`;
  
  try {
    const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
    const data = await res.json().catch(() => ({}));
    
    if (!res.ok) {
      // Provide more specific error messages based on status code
      if (res.status === 400) {
        throw new Error(data?.error || 'Invalid request. Please check your input.');
      } else if (res.status === 401) {
        // Clear invalid tokens
        clearAuthTokens();
        throw new Error('Authentication failed. Please log in again.');
      } else if (res.status === 409) {
        throw new Error(data?.error || 'This username or email is already taken.');
      } else if (res.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(data?.error || `Request failed with status ${res.status}`);
      }
    }
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error. Please check your connection.');
  }
}

export function setAuthTokens(token: string, refreshToken?: string) {
  localStorage.setItem('peve_token', token);
  if (refreshToken) localStorage.setItem('peve_refresh', refreshToken);
}

export function clearAuthTokens() {
  localStorage.removeItem('peve_token');
  localStorage.removeItem('peve_refresh');
}


