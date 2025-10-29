export const API_BASE = import.meta?.env?.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:4000' : 'https://peve-qn93.onrender.com');

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
      // Handle 401 errors with automatic token refresh
      if (res.status === 401 && token && path !== '/api/auth/refresh') {
        try {
          const refreshed = await refreshToken();
          if (refreshed) {
            // Retry the original request with new token
            const newToken = localStorage.getItem('peve_token');
            if (newToken) {
              (headers as any).Authorization = `Bearer ${newToken}`;
              const retryRes = await fetch(`${API_BASE}${path}`, { ...init, headers });
              const retryData = await retryRes.json().catch(() => ({}));
              
              if (retryRes.ok) {
                return retryData;
              }
            }
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
        
        // If refresh failed or retry failed, clear tokens and throw error
        clearAuthTokens();
        throw new Error('Authentication failed. Please log in again.');
      } else if (res.status === 400) {
        throw new Error(data?.error || 'Invalid request. Please check your input.');
      } else if (res.status === 404) {
        throw new Error(data?.error || 'Resource not found. Please try again.');
      } else if (res.status === 403) {
        throw new Error(data?.error || 'You do not have permission to perform this action.');
      } else if (res.status === 409) {
        throw new Error(data?.error || 'This username or email is already taken.');
      } else if (res.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      } else if (res.status === 500) {
        throw new Error(data?.error || 'Server error. Please try again later.');
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

export async function refreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('peve_refresh');
  if (!refreshToken) return false;
  
  try {
    const response = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (response.ok) {
      const data = await response.json();
      setAuthTokens(data.data.token, data.data.refreshToken);
      return true;
    } else {
      clearAuthTokens();
      return false;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearAuthTokens();
    return false;
  }
}


