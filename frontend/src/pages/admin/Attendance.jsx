import { useState, useEffect, useMemo } from 'react';
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

function sameDay(a, b) {
  if (!a || !b) return false;
  const d1 = new Date(a);
  const d2 = new Date(b);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return d1.getTime() === d2.getTime();
}

function Attendance() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get('/attendance/all')
      .then((res) => setRecords(res.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load attendance.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api
      .get('/admin/users')
      .then((res) => setEmployees(res.data || []))
      .catch(() => setEmployees([]));
  }, []);

  const filteredRecords = useMemo(() => {
    let list = records;
    const userId = employeeFilter;
    if (userId) {
      list = list.filter((r) => {
        const id = r.userId?._id ?? r.userId;
        return String(id) === String(userId);
      });
    }
    if (dateFilter) {
      list = list.filter((r) => sameDay(r.date, dateFilter));
    }
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [records, employeeFilter, dateFilter]);

  return (
    <DashboardLayout title="Attendance Monitoring">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Attendance Monitoring</h2>
            <p className="mt-1 text-sm text-gray-500">View attendance records of all employees.</p>
          </div>
          <div className="flex flex-wrap gap-3">
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
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {(employeeFilter || dateFilter) && (
              <button
                type="button"
                onClick={() => {
                  setEmployeeFilter('');
                  setDateFilter('');
                }}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              </div>
            ) : filteredRecords.length === 0 ? (
              <p className="py-12 text-center text-gray-500">No attendance records found.</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredRecords.map((record) => {
                    const user = record.userId;
                    const name = user?.fullName ?? '—';
                    const email = user?.email ?? '';
                    return (
                      <tr key={record._id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="text-sm font-medium text-gray-800">{name}</div>
                          <div className="text-xs text-gray-500">{email}</div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                          {formatDate(record.date)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <StatusBadge status={record.status} />
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

export default Attendance;
