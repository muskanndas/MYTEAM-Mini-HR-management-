import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Alert, PasswordInput, Logo } from '../../components/ui';

const STEP_EMAIL = 1;
const STEP_OTP_RESET = 2;

function ForgotPassword() {
  const [step, setStep] = useState(STEP_EMAIL);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/auth/send-otp', { email: email.trim() });
      toast.success('OTP sent to your email. Check your inbox.');
      setStep(STEP_OTP_RESET);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Check the email or try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp.trim()) {
      setError('OTP is required.');
      return;
    }
    if (!newPassword) {
      setError('New password is required.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/auth/reset-password', {
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });
      toast.success('Password reset successfully. You can sign in now.');
      setStep(STEP_EMAIL);
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP or reset failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(STEP_EMAIL);
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/30 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-soft-lg border border-gray-200/80 p-8">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-600" aria-hidden="true" />
          <div className="flex justify-center mb-6">
            <Logo variant="auth" subtitle="Leave & Attendance Management" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {step === STEP_EMAIL ? 'Forgot password' : 'Reset password'}
          </h2>

          {error && <Alert type="error" message={error} className="mb-4" />}

          {step === STEP_EMAIL && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <p className="text-sm text-gray-600 mb-2">
                Enter your email and we&apos;ll send you a one-time code to reset your password.
              </p>
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-400 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 bg-indigo-600 text-white font-medium rounded-lg shadow-soft hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === STEP_OTP_RESET && (
            <form onSubmit={handleVerifyAndReset} className="space-y-4">
              <p className="text-sm text-gray-600 mb-2">
                Enter the OTP sent to <strong>{email}</strong> and your new password.
              </p>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-400 transition-colors font-mono tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
                <p className="mt-1 text-xs text-gray-500">OTP expires in 10 minutes.</p>
              </div>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                  New password
                </label>
                <PasswordInput
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-gray-500">At least 6 characters</p>
              </div>
              <div>
                <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm new password
                </label>
                <PasswordInput
                  id="confirm-new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 bg-indigo-600 text-white font-medium rounded-lg shadow-soft hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Resetting...' : 'Verify OTP & Reset password'}
              </button>
              <button
                type="button"
                onClick={handleBackToEmail}
                className="w-full py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:ring-offset-2 transition-colors"
              >
                Use a different email
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
