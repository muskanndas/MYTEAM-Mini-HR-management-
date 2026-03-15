function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClass = size === 'sm' ? 'h-6 w-6 border-2' : size === 'lg' ? 'h-12 w-12 border-2' : 'h-8 w-8 border-2';
  return (
    <div
      className={`animate-spin rounded-full border-indigo-600 border-t-transparent ${sizeClass} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export default LoadingSpinner;
