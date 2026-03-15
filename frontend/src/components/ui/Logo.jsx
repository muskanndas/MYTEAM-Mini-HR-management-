import { HiOutlineUserGroup } from 'react-icons/hi';

/**
 * MyTeam logo – use across the app for consistent branding.
 * @param {string} variant - 'auth' (large for login/signup) | 'sidebar' (compact) | 'inline'
 * @param {string} subtitle - Optional text below the logo (e.g. "Leave & Attendance Management")
 * @param {string} suffix - Optional text after the logo (e.g. "· Admin" for sidebar)
 * @param {string} className - Additional classes for the wrapper
 */
function Logo({ variant = 'auth', subtitle, suffix, className = '' }) {
  const isAuth = variant === 'auth';
  const isSidebar = variant === 'sidebar';

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <span
        className={`
          inline-flex items-center gap-1.5 font-bold tracking-tight select-none
          ${isAuth ? 'text-2xl sm:text-3xl' : ''}
          ${isSidebar ? 'text-lg' : ''}
          ${variant === 'inline' ? 'text-xl' : ''}
        `}
        role="img"
        aria-label={suffix ? `MyTeam ${suffix}` : 'MyTeam'}
      >
        <HiOutlineUserGroup
          className={`flex-shrink-0 text-indigo-600 ${isAuth ? 'h-7 w-7 sm:h-8 sm:w-8' : isSidebar ? 'h-5 w-5' : 'h-6 w-6'}`}
          aria-hidden
        />
        <span
          className={`
            bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent
            transition-all duration-200 hover:from-indigo-700 hover:to-indigo-600
          `}
        >
          MyTeam
        </span>
        {suffix && (
          <span className="text-gray-600 font-semibold normal-case ml-0.5">{suffix}</span>
        )}
      </span>
      {subtitle && (
        <p className="mt-1 text-center text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}

export default Logo;
