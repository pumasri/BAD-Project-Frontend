const API_URL = ((import.meta as any).env.VITE_API_URL || 'http://localhost:5050') + '/api';

export class ApiError extends Error {
  constructor(public status: number, public data: any) {
    super(data.message || 'An error occurred');
    this.name = 'ApiError';
  }
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new Event('auth_error'));
    }
    let data;
    try {
      data = await response.json();
    } catch {
      data = { message: response.statusText };
    }
    throw new ApiError(response.status, data);
  }

  return response.json();
}

export const api = {
  get: (endpoint: string) => request(endpoint, { method: 'GET' }),
  post: (endpoint: string, data?: any) => request(endpoint, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  patch: (endpoint: string, data?: any) => request(endpoint, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined }),
  del: (endpoint: string) => request(endpoint, { method: 'DELETE' }),
};
