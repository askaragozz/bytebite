import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = {
  CUSTOMER: [
    { to: '/customer/restaurants', label: 'Restaurants' },
    { to: '/customer/orders', label: 'My Orders' },
  ],
  RESTAURANT_OWNER: [
    { to: '/owner/dashboard', label: 'My Restaurants' },
    { to: '/owner/orders', label: 'Orders' },
  ],
  DRIVER: [
    { to: '/driver/deliveries', label: 'My Deliveries' },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-orange-500">ByteBite</Link>

      <div className="flex items-center gap-6">
        {(NAV_LINKS[user.role] || []).map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">{user.name}</span>
        <button
          onClick={handleLogout}
          className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
