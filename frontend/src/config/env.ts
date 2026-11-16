const rawAuthServiceUrl = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://auth.myapp.test:3000';
export const AUTH_SERVICE_URL = rawAuthServiceUrl.replace(/\/+$/, '');

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const API_URL = rawApiUrl.replace(/\/+$/, '');
