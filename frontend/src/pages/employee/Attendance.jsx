import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout';
import { StatusBadge, LoadingSpinner } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

function formatDate(d) {
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function isToday(dateStr) {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return d.getTime() === t.getTime();
}

function Attendance() {
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = new Date();

  useEffect(() => {
    api
      .get('/attendance/my-attendance')
      .then((res) => {
        const records = res.data || [];
        const todayEntry = records.find((r) => isToday(r.date));
        setTodayRecord(todayEntry || null);
      })
      .catch(() => setTodayRecord(null))
      .finally(() => setLoading(false));
  }, []);

  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!status) {
      setMessage({ type: 'error', text: 'Please select Present or Absent.' });
      return;
    }
    setMessage({ type: '', text: '' });
    setSubmitting(true);
    api
      .post('/attendance/mark', { status })
      .then(() => {
        setMessage({ type: 'success', text: 'Attendance marked successfully.' });
        setTodayRecord({ date: today.toISOString(), status });
        toast.success('Attendance marked successfully.');
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Failed to mark attendance.';
        setMessage({ type: 'error', text: msg });
        toast.error(msg);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <DashboardLayout title="Mark Attendance">
      <div className="max-w-xl">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">Mark Attendance</h2>
          <p className="mt-1 text-sm text-gray-500">
            One record per day. You can only mark attendance for today.
          </p>
          <p className="mt-2 text-lg font-medium text-gray-700">
            Today: {formatDate(today)}
          </p>

          {loading ? (
            <div className="mt-6 flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : todayRecord ? (
            <div className="mt-6 rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-600">Attendance already marked for today</p>
              <p className="mt-2">
                <StatusBadge status={todayRecord.status} />
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {message.text && (
                <div
                  className={`rounded-md p-3 text-sm ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  {message.text}
                </div>
              )}
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-2">Status</span>
                <div className="flex gap-4">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="Present"
                      checked={status === 'Present'}
                      onChange={(e) => setStatus(e.target.value)}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-800">Present</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="Absent"
                      checked={status === 'Absent'}
                      onChange={(e) => setStatus(e.target.value)}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-800">Absent</span>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Mark Attendance'}
              </button>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Attendance;
