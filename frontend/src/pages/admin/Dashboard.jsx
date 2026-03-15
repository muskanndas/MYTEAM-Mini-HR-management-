import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineUserGroup, HiOutlineClock, HiOutlineClipboardCheck, HiOutlineCalendar } from 'react-icons/hi';
import { DashboardLayout } from '../../components/layout';
import { LoadingSpinner, Alert } from '../../components/ui';
import api from '../../services/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Admin Dashboard">
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Admin Dashboard">
        <Alert type="error" message={error} />
      </DashboardLayout>
    );
  }

  const { totalEmployees = 0, pendingLeaves = 0, todayAttendance = 0, totalLeaves = 0 } = stats || {};

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
          <p className="mt-1 text-sm text-gray-500">Key metrics at a glance.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <HiOutlineUserGroup className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <HiOutlineClock className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-medium text-amber-800">Pending Leave Requests</p>
                <p className="text-2xl font-bold text-amber-900">{pendingLeaves}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <HiOutlineClipboardCheck className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-medium text-emerald-800">Today&apos;s Attendance</p>
                <p className="text-2xl font-bold text-emerald-900">{todayAttendance}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                <HiOutlineCalendar className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Leave Records</p>
                <p className="text-2xl font-bold text-gray-900">{totalLeaves}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            to="/admin/leave-requests"
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <HiOutlineClock className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium text-gray-800">Leave Requests</p>
              <p className="text-sm text-gray-500">Approve or reject pending leaves</p>
            </div>
          </Link>
          <Link
            to="/admin/employees"
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <HiOutlineUserGroup className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium text-gray-800">Employees</p>
              <p className="text-sm text-gray-500">View all employees</p>
            </div>
          </Link>
          <Link
            to="/admin/attendance"
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <HiOutlineClipboardCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium text-gray-800">Attendance</p>
              <p className="text-sm text-gray-500">Monitor attendance records</p>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
