import axios from "axios";
import { API_BASE } from "./env";
import { handleTestModeAPI } from './testMode';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://devsync-backend-7jal.onrender.com';

export const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true
});

// Request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (!config.headers) config.headers = {};
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// Add request interceptor for test mode
api.interceptors.request.use(async (config) => {
  if (localStorage.getItem('token') === 'test-token-123') {
    const testResponse = handleTestModeAPI(config.url, config.method, config.data);
    if (testResponse) {
      return Promise.reject({
        response: testResponse,
        isTestMode: true
      });
    }
  }
  return config;
});

// Add response interceptor for test mode
api.interceptors.response.use(
  response => response,
  error => {
    if (error.isTestMode) {
      return error.response;
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
  }
  return res;
};

export const register = async (credentials) => {
  const res = await api.post("/auth/register", credentials);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
  }
  return res;
};

export const logout = () => {
  localStorage.removeItem("token");
  delete api.defaults.headers.common['Authorization'];
  return api.post('/auth/logout');
};

export const getProfile = () => api.get('/auth/profile');
export const updateProfile = (data) => api.put('/auth/profile', data);

// Project endpoints
export const getProjects = () => api.get('/projects');
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
export const getRecommendedProjects = () => api.get('/projects/recommendations');

// Application endpoints
export const getProjectApplications = (projectId) => api.get(`/applications/project/${projectId}`);
export const applyToProject = (projectId) => api.post(`/projects/${projectId}/apply`);
export const acceptApplication = (applicationId) => api.put(`/applications/${applicationId}/accept`);
export const rejectApplication = (applicationId) => api.put(`/applications/${applicationId}/reject`);

// Task endpoints
export const getTasks = (projectId) => api.get(`/projects/${projectId}/tasks`);
export const createTask = (projectId, data) => api.post(`/projects/${projectId}/tasks`, data);
export const updateTask = (projectId, taskId, data) => api.put(`/projects/${projectId}/tasks/${taskId}`, data);
export const deleteTask = (projectId, taskId) => api.delete(`/projects/${projectId}/tasks/${taskId}`);

// Message endpoints
export const getMessages = (projectId) => api.get(`/projects/${projectId}/messages`);
export const sendMessage = (projectId, data) => api.post(`/projects/${projectId}/messages`, data);

// User endpoints
export const getUsers = () => api.get('/users');
export const getUser = (userId) => api.get(`/users/${userId}`);

// Notification endpoints
export const getNotifications = () => api.get('/notifications');
export const markNotificationRead = (id) => api.put(`/notifications/${id}/read`);
