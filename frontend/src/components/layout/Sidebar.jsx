import { NavLink } from 'react-router-dom';
import { HiOutlineX } from 'react-icons/hi';

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 py-2.5 pr-3 pl-3 text-sm font-medium transition-colors rounded-r-lg ${
    isActive
      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 pl-[11px]'
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
  }`;

function Sidebar({ navItems, title, isOpen, onClose }) {
  return (
    <>
      {/* Overlay on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200/80 shadow-soft
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center justify-between border-b border-gray-200/80 px-4">
            <div className="flex flex-1 items-center justify-center min-w-0">{title}</div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
              aria-label="Close menu"
            >
              <HiOutlineX className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={navLinkClass}
                end={item.end}
                onClick={() => onClose?.()}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
