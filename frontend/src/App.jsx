import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LogActivity from './pages/LogActivity';
import ActivityHistory from './pages/ActivityHistory';
import Goals from './pages/Goals';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import OrganizationDashboard from './pages/OrganizationDashboard';
import DashboardLayout from './layouts/DashboardLayout';

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute allowedRole="USER"><Dashboard /></ProtectedRoute>} />
          <Route path="/log-activity" element={<ProtectedRoute allowedRole="USER"><LogActivity /></ProtectedRoute>} />
          <Route path="/activity-history" element={<ProtectedRoute allowedRole="USER"><ActivityHistory /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute allowedRole="USER"><Goals /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute allowedRole="USER"><Leaderboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/organization" element={<ProtectedRoute allowedRole="ORGANIZATION"><OrganizationDashboard /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}
