import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout';
import { StatusBadge } from '../../components/ui';
import api from '../../services/api';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function AttendanceHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get('/attendance/my-attendance')
      .then((res) => setRecords(res.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load attendance.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Attendance History">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-4 py-3">
          <h2 className="text-xl font-semibold text-gray-800">Attendance History</h2>
          <p className="mt-1 text-sm text-gray-500">All your attendance records, newest first.</p>
        </div>
        {error && (
          <div className="mx-4 mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            </div>
          ) : records.length === 0 ? (
            <p className="px-4 py-8 text-center text-gray-500">No attendance records yet.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {records.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-800">
                      {formatDate(record.date)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusBadge status={record.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AttendanceHistory;
