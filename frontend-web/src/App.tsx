import { ThemeProvider, CssBaseline } from '@mui/material';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { theme } from './theme/theme';
import { useAuthStore } from './stores/useAuthStore';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import ClientLayout from './layouts/ClientLayout';
import RequireAuth from './components/common/RequireAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/projects/ProjectList';
import ProjectDetail from './pages/projects/ProjectDetail';

/**
 * @file App.tsx
 * @description Main Application Entry
 * @description_en Sets up ThemeProvider, CssBaseline, and Routing
 * @description_zh 設定主要主題、CSS 基準與路由
 */

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<RequireAuth />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ProjectList />} />
              <Route path="projects/:id" element={<ProjectDetail />} />
              <Route path="calendar" element={<div>Calendar (Coming Soon)</div>} />
              <Route path="finance" element={<div>Finance Overview</div>} />
              <Route path="messenger" element={<div>Messenger (Coming Soon)</div>} />
              <Route path="employees" element={<div>Employees Directory</div>} />
              <Route path="info-portal" element={<div>Info Portal</div>} />
            </Route>

            <Route path="/client" element={<ClientLayout />}>
              <Route index element={<div>Client Overview (Coming Soon)</div>} />
              <Route path="projects" element={<div>My Projects List</div>} />
            </Route>
          </Route>

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
