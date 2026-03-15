import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout';
import { LeaveBalanceCard, Alert } from '../../components/ui';
import LeaveForm from '../../components/forms/LeaveForm';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

function ApplyLeave() {
  const { loadUser } = useAuth();
  const toast = useToast();
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleSubmit = async (values) => {
    setApiError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await api.post('/leaves/apply', values);
      setSuccess('Leave applied successfully.');
      toast.success('Leave applied successfully.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to apply leave.';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Apply Leave">
      <div className="max-w-2xl space-y-6">
        <LeaveBalanceCard />
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">Apply for Leave</h2>
          
        {success && (
          <Alert type="success" message={success} className="mt-4" />
        )}
        {apiError && (
          <Alert type="error" message={apiError} className="mt-4" />
        )}
          <div className="mt-6">
            <LeaveForm
              onSubmit={handleSubmit}
              submitLabel={submitting ? 'Submitting...' : 'Apply Leave'}
              disabled={submitting}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ApplyLeave;
