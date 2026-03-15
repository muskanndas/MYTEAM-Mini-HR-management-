import { useEffect } from 'react';
import { DashboardLayout } from '../../components/layout';
import { LeaveBalanceCard } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function Profile() {
  const { user, loadUser } = useAuth();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (!user) {
    return (
      <DashboardLayout title="Profile">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  const roleLabel = user.role === 'admin' ? 'Admin' : 'Employee';

  return (
    <DashboardLayout title="Profile">
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Full Name</dt>
              <dd className="mt-1 text-gray-900">{user.fullName || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-gray-900">{user.email || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-gray-900">{roleLabel}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Date of Joining</dt>
              <dd className="mt-1 text-gray-900">{formatDate(user.dateOfJoining)}</dd>
            </div>
          </dl>
        </div>
        {user.role === 'employee' && <LeaveBalanceCard />}
      </div>
    </DashboardLayout>
  );
}

export default Profile;
