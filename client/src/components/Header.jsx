import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../context/Authcontext";
import { apiRequest } from '../api/apiRequest';
import { endpoints } from '../api/endPoints';
import { FiLogOut, FiUser } from 'react-icons/fi';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-[#0f1b32] text-white px-6 py-4 shadow-md sticky top-0 z-50 ">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-orange-200 transition">
          🎓 Study Partner
        </Link>

       
        <nav className="flex items-center gap-6 text-sm sm:text-base font-medium">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className={`hover:text-orange-200 transition ${
                  isActive('/login') ? 'underline underline-offset-4' : ''
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

            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
