import type { AuthResponse, AuthUser } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api';
const TOKEN_KEY = 'authToken';
const VALID_ROLES = new Set(['STUDENT', 'STAFF', 'ADMIN']);

function requireAuthUser(value: unknown): AuthUser {
  if (!value || typeof value !== 'object') {
    throw new Error('The authenticated account is invalid.');
  }

  const user = value as Partial<AuthUser>;
  if (
    typeof user.id !== 'string' ||
    typeof user.email !== 'string' ||
    typeof user.name !== 'string' ||
    typeof user.role !== 'string' ||
    !VALID_ROLES.has(user.role)
  ) {
    throw new Error('Your account role is missing or invalid.');
  }

  return user as AuthUser;
}

async function readResponse(response: Response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Authentication failed');
  }

  return data;
}

function saveToken(token: string, rememberMe: boolean) {
  clearAuth();
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export function getMicrosoftLoginUrl() {
  return `${API_BASE_URL}/auth/microsoft`;
}

export async function completeMicrosoftLogin(code: string) {
  const response = await fetch(`${API_BASE_URL}/auth/microsoft/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  const auth = await readResponse(response) as AuthResponse;
  auth.user = requireAuthUser(auth.user);

  saveToken(auth.token, false);
  return auth;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = getToken();

  if (!token) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    clearAuth();
    return null;
  }

  const data = await response.json() as { user: AuthUser };
  return requireAuthUser(data.user);
}

export async function logoutSession() {
  const token = getToken();
  clearAuth();

  if (!token) return;

  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // Local logout must still complete if the backend is unavailable.
  }
}

export async function authenticatedApiFetch(
  path: string,
  options: RequestInit = {},
) {
  const token = getToken();
  if (!token) {
    throw new Error('Authentication is required');
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);

  return fetch(`${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, {
    ...options,
    headers,
  });
}

export async function registerStudent(
  email: string,
  name: string,
  password: string,
) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, password }),
  });

  return readResponse(response);
}

export async function requestPasswordReset(email: string) {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  return readResponse(response) as Promise<{ message: string }>;
}

export async function resetPassword(token: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });

  return readResponse(response) as Promise<{ message: string }>;
}
