import axios from 'axios';
import { getToken } from '../utils/auth';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const normalizedBaseUrl = rawBaseUrl ? rawBaseUrl.replace(/\/+$/, '') : 'http://localhost:8000';

const api = axios.create({
  baseURL: `${normalizedBaseUrl}/api`,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const buildApiUrl = (path = '') => `${normalizedBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;

export default api;
