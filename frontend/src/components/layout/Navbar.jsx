import { useNavigate } from 'react-router-dom';
import { HiOutlineMenu, HiOutlineLogout } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

function Navbar({ onMenuClick, title }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200/80 bg-white/95 backdrop-blur-sm px-4 shadow-soft">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden transition-colors"
        aria-label="Open menu"
      >
        <HiOutlineMenu className="h-6 w-6" />
      </button>
      <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-3 text-right sm:flex">
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-indigo-700">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 truncate max-w-[140px]">
              {user?.fullName}
            </p>
            <p className="text-xs text-gray-500 truncate max-w-[140px]">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          title="Logout"
        >
          <HiOutlineLogout className="h-5 w-5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
