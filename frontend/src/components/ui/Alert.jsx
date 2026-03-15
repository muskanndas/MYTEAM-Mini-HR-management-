function Alert({ type = 'error', message, onDismiss, className = '' }) {
  if (!message) return null;
  const isSuccess = type === 'success';
  const styles = isSuccess
    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
    : 'border-red-200 bg-red-50 text-red-800';
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-md border p-3 text-sm ${styles} ${className}`}
      role="alert"
    >
      <p className="font-medium">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-1"
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default Alert;
