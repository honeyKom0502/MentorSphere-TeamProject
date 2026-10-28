// Central API helper: base URL, session token and consistent error handling.

const TOKEN_KEY = 'mentorsphere-token';

// Backend base URL.
// - Set VITE_API_URL (e.g. https://mentorsphere-api.onrender.com) when the backend is deployed.
// - Otherwise use the same host the page was opened from, on port 5000. This makes
//   http://192.168.x.x:5173 on a second laptop talk to http://192.168.x.x:5000
//   instead of that laptop's own "localhost".
export const API_BASE = (
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:5000`
).replace(/\/+$/, '');

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* storage unavailable */
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
};

// Built-in demo accounts (usr-1..usr-3) exist only in the browser, not in MongoDB.
export const isDemoUser = (user) => /^usr-\d+$/.test(user?.id || '');

export const UNAUTHORIZED_EVENT = 'mentorsphere:unauthorized';

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'ERROR', data = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

export async function apiRequest(path, { method = 'GET', body, signal, auth = true } = {}) {
  const headers = {};
  const token = auth ? getToken() : null;

  if (auth && !token) {
    throw new ApiError(
      'Please sign in with a real MentorSphere account to use shared discussions.',
      { status: 401, code: 'NO_TOKEN' }
    );
  }

  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal
    });
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    throw new ApiError(
      'Cannot reach the MentorSphere server. Check your internet connection and that the backend is running.',
      { status: 0, code: 'NETWORK' }
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    /* non-JSON response */
  }

  if (!response.ok) {
    if (response.status === 401 && token) {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    throw new ApiError(
      data?.message || `Request failed (HTTP ${response.status}).`,
      { status: response.status, code: data?.code || 'HTTP_ERROR', data }
    );
  }

  return data;
}
