import axios, { AxiosError } from 'axios';
import type { ChatReply, Conversation, DocumentRecord, Role, User } from '../types';

const TOKEN_KEY = 'academix_access_token';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event('academix:unauthorized'));
    }
    return Promise.reject(error);
  },
);

export const tokenStore = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (token: string) => sessionStorage.setItem(TOKEN_KEY, token),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
};

export function getApiError(error: unknown, fallback = 'Something went wrong. Please try again.') {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join('. ');
    if (typeof message === 'string') return message;
    if (!error.response) return 'Unable to reach the server. Check that the backend is running.';
  }
  return fallback;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ access_token: string; user: User }>('/auth/login', { email, password }).then((r) => r.data),
  register: (name: string, email: string, password: string) =>
    api.post<{ message: string; user: User }>('/auth/register', { name, email, password }).then((r) => r.data),
  me: () => api.get<User>('/auth/me').then((r) => r.data),
};

export const documentsApi = {
  list: () => api.get<DocumentRecord[]>('/documents').then((r) => r.data),
  upload: (file: File, onProgress?: (percent: number) => void) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/documents/upload', form, {
      onUploadProgress: (event) => {
        if (event.total && onProgress) onProgress(Math.round((event.loaded * 100) / event.total));
      },
    }).then((r) => r.data);
  },
  remove: (id: string) => api.delete(`/documents/${id}`).then((r) => r.data),
};

export const chatApi = {
  list: () => api.get<Conversation[]>('/chat').then((r) => r.data),
  get: (id: string) => api.get<Conversation>(`/chat/${id}`).then((r) => r.data),
  create: (documentId: string, title?: string) =>
    api.post<Conversation>('/chat', { documentId, ...(title ? { title } : {}) }).then((r) => r.data),
  send: (id: string, content: string) =>
    api.post<ChatReply>(`/chat/${id}/messages`, { content }).then((r) => r.data),
};

export const usersApi = {
  list: () => api.get<User[]>('/users').then((r) => r.data),
  create: (data: { name: string; email: string; password: string; role: Role }) =>
    api.post<User>('/users', data).then((r) => r.data),
  update: (id: string, data: Partial<{ name: string; email: string; password: string; role: Role }>) =>
    api.patch<User>(`/users/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete<User>(`/users/${id}`).then((r) => r.data),
};
