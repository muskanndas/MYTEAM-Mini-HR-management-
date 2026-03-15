const statusStyles = {
  Pending: 'bg-amber-100 text-amber-800',
  Approved: 'bg-emerald-100 text-emerald-800',
  Rejected: 'bg-red-100 text-red-800',
  Present: 'bg-emerald-100 text-emerald-800',
  Absent: 'bg-gray-100 text-gray-700',
};

function StatusBadge({ status }) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-700';
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${style}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
