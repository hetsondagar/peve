export function isAuthenticated(): boolean {
  const token = localStorage.getItem('peve_token');
  return !!token;
}

export function getAuthToken(): string | null {
  return localStorage.getItem('peve_token');
}

export function clearAuth(): void {
  localStorage.removeItem('peve_token');
  localStorage.removeItem('peve_refresh');
}

export function requireAuth(): boolean {
  if (!isAuthenticated()) {
    console.warn('Authentication required for this action');
    return false;
  }
  return true;
}
