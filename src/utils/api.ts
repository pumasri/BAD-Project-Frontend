import { getToken } from '../services/authService';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api';
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: { message?: string },
  ) {
    super(data.message || 'An error occurred');
    this.name = 'ApiError';
  }
}

async function parseResponse(response: Response) {
  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') || '';
  return contentType.includes('application/json') ? response.json() : response.text();
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  const data = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      typeof data === 'object' && data ? data : { message: response.statusText },
    );
  }
  return data;
}

export const api = {
  get: <T = any>(endpoint: string) => request(endpoint, { method: 'GET' }) as Promise<T>,
  post: <T = any>(endpoint: string, data?: unknown) =>
    request(endpoint, {
      method: 'POST',
      body: data === undefined ? undefined : JSON.stringify(data),
    }) as Promise<T>,
  postForm: <T = any>(endpoint: string, data: FormData) =>
    request(endpoint, { method: 'POST', body: data }) as Promise<T>,
  patch: <T = any>(endpoint: string, data?: unknown) =>
    request(endpoint, {
      method: 'PATCH',
      body: data === undefined ? undefined : JSON.stringify(data),
    }) as Promise<T>,
  del: <T = any>(endpoint: string) => request(endpoint, { method: 'DELETE' }) as Promise<T>,
};

export function uploadUrl(objectKey: string) {
  return `${API_ORIGIN}/uploads/${objectKey}`;
}
