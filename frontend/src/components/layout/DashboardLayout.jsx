import { useState } from 'react';
import {
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineClipboardCheck,
  HiOutlineUser,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../ui';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const iconClass = 'h-5 w-5';
const icons = {
  dashboard: <HiOutlineHome className={iconClass} />,
  leave: <HiOutlineCalendar className={iconClass} />,
  history: <HiOutlineClock className={iconClass} />,
  attendance: <HiOutlineClipboardCheck className={iconClass} />,
  profile: <HiOutlineUser className={iconClass} />,
  employees: <HiOutlineUserGroup className={iconClass} />,
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
  const layoutTitle = <Logo variant="sidebar" suffix={isAdmin ? '· Admin' : '· Employee'} />;

  return (
    <div className="min-h-screen bg-gray-50/80">
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
