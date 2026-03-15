import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

// Simple inline icons for nav items
const icons = {
  dashboard: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  leave: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  history: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  attendance: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  profile: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  employees: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
};

const EMPLOYEE_NAV = [
  { to: '/employee/dashboard', label: 'Dashboard', icon: icons.dashboard, end: true },
  { to: '/employee/apply-leave', label: 'Apply Leave', icon: icons.leave },
  { to: '/employee/leave-history', label: 'Leave History', icon: icons.history },
  { to: '/employee/attendance', label: 'Mark Attendance', icon: icons.attendance },
  { to: '/employee/attendance-history', label: 'Attendance History', icon: icons.attendance },
  { to: '/employee/profile', label: 'Profile', icon: icons.profile },
];

const ADMIN_NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: icons.dashboard, end: true },
  { to: '/admin/leave-requests', label: 'Leave Requests', icon: icons.leave },
  { to: '/admin/employees', label: 'Employees', icon: icons.employees },
  { to: '/admin/attendance', label: 'Attendance', icon: icons.attendance },
];

function DashboardLayout({ children, title = 'Dashboard' }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdmin = user?.role === 'admin';
  const navItems = isAdmin ? ADMIN_NAV : EMPLOYEE_NAV;
  const layoutTitle = isAdmin ? 'Mini HR · Admin' : 'Mini HR · Employee';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar
          navItems={navItems}
          title={layoutTitle}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex flex-1 flex-col lg:min-w-0">
          <Navbar title={title} onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
