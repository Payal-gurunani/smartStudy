import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../context/Authcontext";
import { apiRequest } from '../api/apiRequest';
import { endpoints } from '../api/endPoints';
import { FiLogOut, FiUser } from 'react-icons/fi';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await apiRequest({
        method: endpoints.logout.method,
        url: endpoints.logout.url,
      });
    } catch (err) {
      console.error('Logout error:', err.message);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('visitedBefore');
      setIsAuthenticated(false);
      navigate('/');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-[#0f1b32] text-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/home" className="text-2xl font-bold tracking-wide hover:text-orange-200 transition">
          🎓 SmartStudy
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm sm:text-base font-medium">
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                className={`hover:text-orange-200 transition ${
                  isActive('/') ? 'underline underline-offset-4' : ''
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`hover:text-orange-200 transition ${
                  isActive('/register') ? 'underline underline-offset-4' : ''
                }`}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-1 hover:text-orange-200 transition"
              >
                <FiUser />
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-[#E4580B] hover:bg-red-600 px-4 py-1.5 rounded-lg transition text-white font-semibold shadow-sm"
              >
                <FiLogOut className="text-lg" />
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
