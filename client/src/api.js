// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Interceptor: before each request, read token from localStorage
API.interceptors.request.use(config => {
  const auth = JSON.parse(localStorage.getItem('auth'));
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      // clear stale auth
      localStorage.removeItem('auth');
      // redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
