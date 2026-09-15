import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LogActivity from './pages/LogActivity';
import ActivityHistory from './pages/ActivityHistory';
import Analytics from './pages/Analytics';
import Goals from './pages/Goals';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import OrganizationDashboard from './pages/OrganizationDashboard';
import DashboardLayout from './layouts/DashboardLayout';

// Admin imports
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserManagement from './pages/admin/AdminUserManagement';
import AdminActivityMonitoring from './pages/admin/AdminActivityMonitoring';
import AdminCarbonAnalytics from './pages/admin/AdminCarbonAnalytics';
import AdminReports from './pages/admin/AdminReports';
import AdminOrganizations from './pages/admin/AdminOrganizations';
import AdminLeaderboard from './pages/admin/AdminLeaderboard';

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* User Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Workspace */}
        <Route element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUserManagement />} />
          <Route path="/admin/activities" element={<AdminActivityMonitoring />} />
          <Route path="/admin/analytics" element={<AdminCarbonAnalytics />} />
          <Route path="/admin/leaderboard" element={<AdminLeaderboard />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/organizations" element={<AdminOrganizations />} />
        </Route>
        
        {/* User Workspace */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute allowedRole="USER"><Dashboard /></ProtectedRoute>} />
          <Route path="/log-activity" element={<ProtectedRoute allowedRole="USER"><LogActivity /></ProtectedRoute>} />
          <Route path="/activity-history" element={<ProtectedRoute allowedRole="USER"><ActivityHistory /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute allowedRole="USER"><Analytics /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute allowedRole="USER"><Goals /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute allowedRole="USER"><Leaderboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/organization" element={<ProtectedRoute allowedRole="ORGANIZATION"><OrganizationDashboard /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}
