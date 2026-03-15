import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '../../components/layout';
import { StatusBadge, LoadingSpinner, Alert } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function LeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [actioningId, setActioningId] = useState(null);

  const fetchLeaves = useCallback(() => {
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (employeeFilter) params.employeeId = employeeFilter;
    setLoading(true);
    setError('');
    api
      .get('/admin/leaves', { params })
      .then((res) => setLeaves(res.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load leave requests.'))
      .finally(() => setLoading(false));
  }, [statusFilter, employeeFilter]);

  const fetchEmployees = () => {
    api
      .get('/admin/users')
      .then((res) => setEmployees(res.data || []))
      .catch(() => setEmployees([]));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const toast = useToast();

  const handleStatusUpdate = (leaveId, status) => {
    setError('');
    setActioningId(leaveId);
    api
      .put(`/admin/leaves/${leaveId}`, { status })
      .then(() => {
        fetchLeaves();
        toast.success(status === 'Approved' ? 'Leave approved.' : 'Leave rejected.');
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Failed to update leave status.';
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setActioningId(null));
  };

  return (
    <DashboardLayout title="Leave Requests">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Leave Requests</h2>
            <p className="mt-1 text-sm text-gray-500">Approve or reject employee leave requests.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All employees</option>
              {employees
                .filter((u) => u.role === 'employee')
                .map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.fullName}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {error && <Alert type="error" message={error} />}

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <LoadingSpinner />
              </div>
            ) : leaves.length === 0 ? (
              <p className="py-12 text-center text-gray-500">No leave requests found.</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Start</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">End</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Days</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Applied</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Reason</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {leaves.map((leave) => {
                    const user = leave.userId;
                    const name = user?.fullName ?? '—';
                    const email = user?.email ?? '';
                    return (
                      <tr key={leave._id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="text-sm font-medium text-gray-800">{name}</div>
                          <div className="text-xs text-gray-500">{email}</div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{leave.leaveType}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                          {formatDate(leave.startDate)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                          {formatDate(leave.endDate)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{leave.totalDays}</td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <StatusBadge status={leave.status} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                          {formatDate(leave.appliedDate)}
                        </td>
                        <td className="max-w-[180px] truncate px-4 py-3 text-sm text-gray-600" title={leave.reason}>
                          {leave.reason || '—'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                          {leave.status === 'Pending' && (
                            <span className="flex justify-end gap-2">
                              <button
                                type="button"
                                disabled={actioningId === leave._id}
                                onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                                className="font-medium text-emerald-600 hover:text-emerald-500 disabled:opacity-50"
                              >
                                {actioningId === leave._id ? '...' : 'Approve'}
                              </button>
                              <button
                                type="button"
                                disabled={actioningId === leave._id}
                                onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                                className="font-medium text-red-600 hover:text-red-500 disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default LeaveRequests;
