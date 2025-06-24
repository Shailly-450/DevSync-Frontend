import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css'
import AppRoutes from "./AppRoutes";
import BackendCheck from "./components/BackendCheck";
import Navbar from "./components/Navbar";
import { getProfile, api } from './utils/api';
export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Test data for mock responses
const TEST_DATA = {
  projects: [
    {
      id: 'test-project-1',
      title: 'Test Project 1',
      description: 'A test project for exploring DevSync features',
      techStack: ['React', 'Node.js', 'MongoDB'],
      status: 'In Progress',
      createdBy: 'test-user',
      members: ['test-user'],
      tasks: [
        {
          id: 'task-1',
          title: 'Implement Authentication',
          description: 'Add user authentication using JWT',
          status: 'Completed',
          assignedTo: 'test-user'
        },
        {
          id: 'task-2',
          title: 'Create Dashboard',
          description: 'Design and implement main dashboard',
          status: 'In Progress',
          assignedTo: 'test-user'
        }
      ],
      messages: [
        {
          id: 'msg-1',
          text: 'Welcome to the test project!',
          sender: 'test-user',
          timestamp: new Date().toISOString()
        }
      ]
    },
    {
      id: 'test-project-2',
      title: 'Sample Collaboration Project',
      description: 'Another test project with different features',
      techStack: ['Vue.js', 'Python', 'PostgreSQL'],
      status: 'Open',
      createdBy: 'test-user',
      members: ['test-user'],
      tasks: [],
      messages: []
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      type: 'PROJECT_INVITE',
      message: 'You have been invited to join Project X',
      read: false,
      timestamp: new Date().toISOString()
    },
    {
      id: 'notif-2',
      type: 'TASK_ASSIGNED',
      message: 'New task assigned: Create API Documentation',
      read: true,
      timestamp: new Date().toISOString()
    }
  ]
};

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
    // Clear test mode data from localStorage
    localStorage.removeItem('testModeData');
  };

  const skipAuth = () => {
    // Create a test user object
    const testUser = {
      id: 'test-user',
      name: 'Test User',
      email: 'test@example.com',
      bio: 'Full-stack developer passionate about creating innovative solutions',
      skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS'],
      github: 'https://github.com/test-user',
      portfolio: 'https://portfolio.test-user.dev',
      role: 'Developer'
    };
    
    // Store test data in localStorage
    localStorage.setItem('testModeData', JSON.stringify(TEST_DATA));
    
    // Create a test token
    const testToken = 'test-token-123';
    
    // Set up the test environment
    localStorage.setItem('token', testToken);
    setUser(testUser);

    // Mock API responses for test mode
    api.interceptors.request.use(config => {
      if (localStorage.getItem('token') === 'test-token-123') {
        const testData = JSON.parse(localStorage.getItem('testModeData'));
        
        // Mock different API endpoints
        if (config.url.includes('/projects')) {
          return Promise.resolve({ data: testData.projects });
        }
        if (config.url.includes('/notifications')) {
          return Promise.resolve({ data: testData.notifications });
        }
        // Add more endpoint mocks as needed
      }
      return config;
    });
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
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      skipAuth,
      isAuthenticated: !!user 
    }}>
      <AppRoutes />
    </AuthContext.Provider>
  );
}

export default App;
