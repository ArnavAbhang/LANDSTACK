export const AUTH_TOKEN_KEY = 'landstack_auth_token';
export const AUTH_USER_KEY = 'landstack_auth_user';
export const AUTH_ROUTE_KEY = 'landstack_current_route';
export const AUTH_JURISDICTION_KEY = 'landstack_jurisdiction';

export function saveSession(token: string, user: any, route: string, jurisdiction: any) {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_ROUTE_KEY, route);
    localStorage.setItem(AUTH_JURISDICTION_KEY, JSON.stringify(jurisdiction));
  } catch (e) {
    console.error('Failed to save session:', e);
  }
}

export function updateSessionRoute(route: string) {
  try {
    localStorage.setItem(AUTH_ROUTE_KEY, route);
  } catch (e) {}
}

export function updateSessionJurisdiction(jurisdiction: any) {
  try {
    localStorage.setItem(AUTH_JURISDICTION_KEY, JSON.stringify(jurisdiction));
  } catch (e) {}
}

export function getSavedSession() {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userStr = localStorage.getItem(AUTH_USER_KEY);
    const route = localStorage.getItem(AUTH_ROUTE_KEY);
    const jurStr = localStorage.getItem(AUTH_JURISDICTION_KEY);

    if (token && userStr) {
      return {
        token,
        user: JSON.parse(userStr),
        route: route || (JSON.parse(userStr).role === 'RESIDENT' ? 'RESIDENT_APP' : 'GOVERNMENT_APP'),
        jurisdiction: jurStr ? JSON.parse(jurStr) : null,
      };
    }
  } catch (e) {
    console.error('Failed to restore session:', e);
  }
  return null;
}

export function clearSession() {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_ROUTE_KEY);
    localStorage.removeItem(AUTH_JURISDICTION_KEY);
  } catch (e) {}
}
