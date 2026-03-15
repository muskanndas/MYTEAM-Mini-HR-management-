import { useAuth } from '../../context/AuthContext';

const INITIAL_LEAVE_BALANCE = 20;

function LeaveBalanceCard({ className = '' }) {
  const { user } = useAuth();
  const remaining = user?.leaveBalance ?? 0;
  const total = INITIAL_LEAVE_BALANCE;
  const used = Math.max(0, total - remaining);

  return (
    <div
      className={`rounded-xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50 to-indigo-50/70 p-6 shadow-soft ${className}`}
      role="region"
      aria-label="Leave balance"
    >
      <h2 className="text-sm font-semibold text-indigo-800 uppercase tracking-wide">Leave Balance</h2>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-indigo-900">{total}</p>
          <p className="text-xs text-indigo-600">Total (days)</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-indigo-900">{used}</p>
          <p className="text-xs text-indigo-600">Used (days)</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-indigo-900">{remaining}</p>
          <p className="text-xs text-indigo-600">Remaining (days)</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-indigo-600/90">
        Approved leave reduces your balance.
      </p>
    </div>
  );
}

export default LeaveBalanceCard;
export { INITIAL_LEAVE_BALANCE };
