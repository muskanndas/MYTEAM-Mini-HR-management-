import { useState, useEffect } from 'react';

const LEAVE_TYPES = ['Casual', 'Sick', 'Paid'];

function getTotalDays(start, end) {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  if (s > e) return 0;
  return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
}

function toInputDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toISOString().slice(0, 10);
}

function LeaveForm({ initialValues = {}, onSubmit, submitLabel = 'Apply Leave', onCancel, disabled = false }) {
  const [leaveType, setLeaveType] = useState(initialValues.leaveType || 'Casual');
  const [startDate, setStartDate] = useState(toInputDate(initialValues.startDate));
  const [endDate, setEndDate] = useState(toInputDate(initialValues.endDate));
  const [reason, setReason] = useState(initialValues.reason || '');
  const [error, setError] = useState('');

  const totalDays = getTotalDays(startDate, endDate);

  useEffect(() => {
    setLeaveType(initialValues.leaveType || 'Casual');
    setStartDate(toInputDate(initialValues.startDate));
    setEndDate(toInputDate(initialValues.endDate));
    setReason(initialValues.reason || '');
  }, [initialValues.leaveType, initialValues.startDate, initialValues.endDate, initialValues.reason]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!leaveType || !startDate || !endDate) {
      setError('Leave type, start date and end date are required.');
      return;
    }
    if (!reason.trim()) {
      setError('Reason is required.');
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      setError('Start date must be before or equal to end date.');
      return;
    }
    onSubmit({ leaveType, startDate, endDate, reason: reason.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      <div>
        <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700 mb-1">
          Leave Type
        </label>
        <select
          id="leaveType"
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          required
        >
          {LEAVE_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>
      </div>
      <div>
        <span className="block text-sm font-medium text-gray-700">Total Days</span>
        <p className="mt-1 text-lg font-semibold text-gray-900">{totalDays > 0 ? totalDays : '—'}</p>
      </div>
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
          Reason
        </label>
        <textarea
          id="reason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          placeholder="Brief reason for leave"
          required
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={disabled}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default LeaveForm;
export { getTotalDays, toInputDate, LEAVE_TYPES };
