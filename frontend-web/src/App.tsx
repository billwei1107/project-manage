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
import TaskDetails from './pages/projects/TaskDetails';
import AccountManagement from './pages/admin/AccountManagement';
import Calendar from './pages/calendar/Calendar';
import { Finance } from './pages/finance/Finance'; // Import the Finance component
import EmployeeList from './pages/employees/EmployeeList';
import EmployeeProfile from './pages/employees/EmployeeProfile';
import Messenger from './pages/messenger/Messenger';
import InfoPortal from './pages/infoportal/InfoPortal';
import FolderDetail from './pages/infoportal/FolderDetail';
import PublicUploadPortal from './pages/infoportal/PublicUploadPortal';
import NearestEventsPage from './pages/events/NearestEventsPage';
import Profile from './pages/profile/Profile';

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
          <Route path="/public/upload/:tokenId" element={<PublicUploadPortal />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<RequireAuth />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ProjectList />} />
              <Route path="projects/:id" element={<ProjectDetail />} />
              <Route path="projects/task-details" element={<TaskDetails />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="finance" element={<Finance />} /> {/* Add Route for Finance */}
              <Route path="messenger" element={<Messenger />} />
              <Route path="employees" element={<EmployeeList />} />
              <Route path="employees/:id" element={<EmployeeProfile />} />
              <Route path="info-portal" element={<InfoPortal />} />
              <Route path="info-portal/:folderId" element={<FolderDetail />} />
              <Route path="accounts" element={<AccountManagement />} />
              <Route path="events" element={<NearestEventsPage />} />
              <Route path="profile" element={<Profile />} />
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
