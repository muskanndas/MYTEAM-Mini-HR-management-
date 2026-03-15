import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';

import EmployeeDashboard from './pages/employee/Dashboard';
import ApplyLeave from './pages/employee/ApplyLeave';
import LeaveHistory from './pages/employee/LeaveHistory';
import Attendance from './pages/employee/Attendance';
import AttendanceHistory from './pages/employee/AttendanceHistory';
import Profile from './pages/employee/Profile';

import AdminDashboard from './pages/admin/Dashboard';
import LeaveRequests from './pages/admin/LeaveRequests';
import Employees from './pages/admin/Employees';
import AdminAttendance from './pages/admin/Attendance';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/apply-leave"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <ApplyLeave />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/leave-history"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <LeaveHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/attendance"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <Attendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/attendance-history"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <AttendanceHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/profile"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leave-requests"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <LeaveRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Employees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAttendance />
              </ProtectedRoute>
            }
          />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
