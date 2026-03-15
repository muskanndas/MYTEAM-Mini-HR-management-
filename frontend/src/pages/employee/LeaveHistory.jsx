import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout';
import { StatusBadge, LeaveBalanceCard, LoadingSpinner, Alert } from '../../components/ui';
import LeaveForm from '../../components/forms/LeaveForm';
import { useAuth } from '../../context/AuthContext';
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

function LeaveHistory() {
  const { loadUser } = useAuth();
  const toast = useToast();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editError, setEditError] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const fetchLeaves = () => {
    setLoading(true);
    setError('');
    api
      .get('/leaves/my-leaves')
      .then((res) => setLeaves(res.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load leave history.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const leaveToEdit = editId ? leaves.find((l) => l._id === editId) : null;

  const handleEditSubmit = async (values) => {
    if (!editId) return;
    setEditError('');
    setEditSubmitting(true);
    try {
      await api.put(`/leaves/${editId}`, values);
      setEditId(null);
      fetchLeaves();
      toast.success('Leave request updated.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update leave.';
      setEditError(msg);
      toast.error(msg);
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleCancelLeave = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this leave request?')) return;
    setError('');
    try {
      await api.delete(`/leaves/${id}`);
      fetchLeaves();
      if (editId === id) setEditId(null);
      toast.success('Leave request cancelled.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to cancel leave.';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <DashboardLayout title="Leave History">
      <div className="space-y-6">
        <LeaveBalanceCard />
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-4 py-3">
            <h2 className="text-xl font-semibold text-gray-800">Leave History</h2>
            {/* <p className="mt-1 text-sm text-gray-500">View and manage your leave requests.</p> */}
          </div>
        {error && (
          <div className="mx-4 mt-4">
            <Alert type="error" message={error} />
          </div>
        )}
        <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : leaves.length === 0 ? (
            <p className="px-4 py-8 text-center text-gray-500">No leave requests yet.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                {leaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-800">{leave.leaveType}</td>
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
                    <td className="max-w-[200px] truncate px-4 py-3 text-sm text-gray-600" title={leave.reason}>
                      {leave.reason || '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                      {leave.status === 'Pending' && (
                        <span className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditId(leave._id)}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancelLeave(leave._id)}
                            className="font-medium text-red-600 hover:text-red-500"
                          >
                            Cancel
                          </button>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        </div>
      </div>

      {/* Edit modal */}
      {leaveToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800">Edit Leave Request</h3>
            {editError && (
              <Alert type="error" message={editError} className="mt-3" />
            )}
            <div className="mt-4">
              <LeaveForm
                initialValues={{
                  leaveType: leaveToEdit.leaveType,
                  startDate: leaveToEdit.startDate,
                  endDate: leaveToEdit.endDate,
                  reason: leaveToEdit.reason || '',
                }}
                onSubmit={handleEditSubmit}
                submitLabel={editSubmitting ? 'Saving...' : 'Save'}
                disabled={editSubmitting}
                onCancel={() => {
                  setEditId(null);
                  setEditError('');
                }}
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default LeaveHistory;
