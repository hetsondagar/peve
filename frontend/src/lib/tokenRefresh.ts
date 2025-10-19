import { refreshToken } from './api';

let refreshInterval: NodeJS.Timeout | null = null;

export function startTokenRefresh() {
  // Clear any existing interval
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  
  // Refresh token every 20 hours (before 24h expiration)
  refreshInterval = setInterval(async () => {
    try {
      await refreshToken();
      console.log('Token refreshed successfully');
    } catch (error) {
      console.error('Automatic token refresh failed:', error);
    }
  }, 20 * 60 * 60 * 1000); // 20 hours
}

export function stopTokenRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

// Start token refresh when module loads if user is logged in
if (typeof window !== 'undefined' && localStorage.getItem('peve_token')) {
  startTokenRefresh();
}
