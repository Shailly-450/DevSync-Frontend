import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AuthPage from './pages/AuthPage';
import ProjectDetail from './pages/ProjectDetail';
import GoogleCallback from './pages/GoogleCallback';
import CreateProjectPage from './pages/CreateProjectPage';
import MyProjectsPage from './pages/MyProjectsPage';
import ProjectChatPage from './pages/ProjectChatPage';
import Layout from './components/Layout';
import { useAuth } from './App';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
}

function ProjectDetailWrapper() {
  const { id } = useParams();
  return <ProjectDetail projectId={id} />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/projects/new" element={<PrivateRoute><CreateProjectPage /></PrivateRoute>} />
        <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
        <Route path="/my-projects" element={<PrivateRoute><MyProjectsPage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/project/:id" element={<PrivateRoute><ProjectDetailWrapper /></PrivateRoute>} />
        <Route path="/project/:projectId/chat" element={<PrivateRoute><ProjectChatPage /></PrivateRoute>} />
      </Route>
      
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      
      {/* Fallback for any other route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
