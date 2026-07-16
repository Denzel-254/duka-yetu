import { Link, useLocation } from 'react-router-dom';
import { 
  FaStore, 
  FaHome, 
  FaShoppingCart, 
  FaBoxes, 
  FaUsers,
  FaSignOutAlt,
  FaUserCircle 
} from 'react-icons/fa';
import useAuthStore from '../../store/authStore';

const Navbar = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/pos', icon: FaShoppingCart, label: 'POS' },
    { path: '/products', icon: FaBoxes, label: 'Products' },
  ];

  // Only show Staff link for OWNER role
  if (user?.role === 'OWNER') {
    navItems.push({ path: '/staff', icon: FaUsers, label: 'Staff' });
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="p-2 bg-primary-600 rounded-lg">
                <FaStore className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-gray-800">Duka Yetu</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FaUserCircle className="text-2xl text-gray-400" />
              <span className="text-sm text-gray-700 hidden sm:block">
                {user?.name || 'User'}
              </span>
              <span className="text-xs text-gray-400 hidden sm:block">
                ({user?.role || 'CASHIER'})
              </span>
            </div>

            <button
              onClick={logout}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <FaSignOutAlt className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;