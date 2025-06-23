import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css'
import AppRoutes from "./AppRoutes";
import BackendCheck from "./components/BackendCheck";
import Navbar from "./components/Navbar";
import { getProfile, api } from './utils/api';
export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Add auth token to api headers for subsequent requests
          const { api } = await import('./utils/api');
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await getProfile();
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch profile, removing token', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div
          role="status"
          className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"
        ></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      <AppRoutes />
    </AuthContext.Provider>
  );
}

export default App;
