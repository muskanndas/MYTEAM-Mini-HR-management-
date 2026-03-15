import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineClipboardCheck, HiOutlineClock, HiOutlineCalendar } from 'react-icons/hi';
import { DashboardLayout } from '../../components/layout';
import { StatusBadge, LeaveBalanceCard, LoadingSpinner, Alert } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function Dashboard() {
  const { user, loadUser } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    Promise.all([
      api.get('/leaves/my-leaves'),
      api.get('/attendance/my-attendance'),
    ])
      .then(([leavesRes, attendanceRes]) => {
        if (!cancelled) {
          setLeaves(leavesRes.data || []);
          setAttendance(attendanceRes.data || []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Failed to load dashboard data.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const recentLeaves = leaves.slice(0, 5);
  const recentAttendance = attendance.slice(0, 5);

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {error && <Alert type="error" message={error} />}

        <LeaveBalanceCard />

        {/* Quick actions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/employee/apply-leave"
            className="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white p-4 shadow-soft transition-all duration-200 hover:shadow-soft-lg hover:border-indigo-200 hover:-translate-y-0.5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <HiOutlinePlus className="h-5 w-5" />
            </span>
            <span className="font-medium text-gray-800">Apply Leave</span>
          </Link>
          <Link
            to="/employee/attendance"
            className="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white p-4 shadow-soft transition-all duration-200 hover:shadow-soft-lg hover:border-emerald-200 hover:-translate-y-0.5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <HiOutlineClipboardCheck className="h-5 w-5" />
            </span>
            <span className="font-medium text-gray-800">Mark Attendance</span>
          </Link>
          <Link
            to="/employee/leave-history"
            className="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white p-4 shadow-soft transition-all duration-200 hover:shadow-soft-lg hover:border-amber-200 hover:-translate-y-0.5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <HiOutlineClock className="h-5 w-5" />
            </span>
            <span className="font-medium text-gray-800">Leave History</span>
          </Link>
          <Link
            to="/employee/attendance-history"
            className="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white p-4 shadow-soft transition-all duration-200 hover:shadow-soft-lg hover:border-sky-200 hover:-translate-y-0.5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
              <HiOutlineCalendar className="h-5 w-5" />
            </span>
            <span className="font-medium text-gray-800">Attendance History</span>
          </Link>
        </div>

        {/* Recent leave requests & attendance */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200/80 bg-white shadow-soft overflow-hidden">
            <div className="border-b border-gray-200/80 px-4 py-3 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-semibold text-gray-800">Recent Leave Requests</h3>
              <Link to="/employee/leave-history" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : recentLeaves.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-gray-500">No leave requests yet.</p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {recentLeaves.map((leave) => (
                      <tr key={leave._id}>
                        <td className="px-4 py-2 text-sm text-gray-800">{leave.leaveType}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {formatDate(leave.startDate)} – {formatDate(leave.endDate)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">{leave.totalDays}</td>
                        <td className="px-4 py-2">
                          <StatusBadge status={leave.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200/80 bg-white shadow-soft overflow-hidden">
            <div className="border-b border-gray-200/80 px-4 py-3 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-semibold text-gray-800">Recent Attendance</h3>
              <Link to="/employee/attendance-history" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : recentAttendance.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-gray-500">No attendance records yet.</p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {recentAttendance.map((record) => (
                      <tr key={record._id}>
                        <td className="px-4 py-2 text-sm text-gray-800">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-4 py-2">
                          <StatusBadge status={record.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
