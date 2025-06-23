import axios from "axios";
import { API_BASE } from "./env";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true
});

// Request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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

// Auth
export const login = async (data) => {
  const res = await api.post("/auth/login", data);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res;
};

export const register = async (data) => {
  const res = await api.post("/auth/register", data);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res;
};

export const getProfile = async () => {
  return api.get("/auth/me");
};

export const updateProfile = async (data) => {
  return api.put("/users/me", data);
};

// Applications
export const getProjectApplications = (projectId) => api.get(`/applications/project/${projectId}`);
export const applyToProject = (projectId) => api.post(`/projects/${projectId}/apply`);
export const acceptApplication = (applicationId) => api.put(`/applications/${applicationId}/accept`);
export const rejectApplication = (applicationId) => api.put(`/applications/${applicationId}/reject`);

// Projects
export const fetchProjects = () => api.get("/projects");
export const createProject = (data) => api.post("/projects", data);
export const fetchProject = (projectId) => api.get(`/projects/${projectId}`);
export const deleteProject = async (projectId) => {
  return api.delete(`/projects/${projectId}`);
};

// Tasks
export const fetchTasks = (projectId) => api.get(`/projects/${projectId}/tasks`);
export const createTask = (projectId, data) => api.post(`/projects/${projectId}/tasks`, data);
export const updateTask = (projectId, taskId, data) => api.put(`/projects/${projectId}/tasks/${taskId}`, data);
export const deleteTask = (projectId, taskId) => api.delete(`/projects/${projectId}/tasks/${taskId}`);

// Users
export const fetchUsers = () => api.get("/users");
export const fetchUser = (userId) => api.get(`/users/${userId}`);

// Messages
export const fetchMessages = (projectId) => api.get(`/projects/${projectId}/messages`);
export const sendMessage = (projectId, data) => api.post(`/projects/${projectId}/messages`, data);

export const getRecommendedProjects = () => api.get('/projects/recommendations');

// User
export const getMyProfile = () => api.get('/users/me');
