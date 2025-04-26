import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 py-4 px-8 flex items-center justify-between shadow-md">
      {/* Left Side Logo */}
      <Link to="/" className="text-white text-3xl font-bold tracking-wide">
        HealthSync
      </Link>

      {/* Center Menu */}
      <div className="flex items-center space-x-12">
        <Link to="/" className="text-white hover:text-gray-300 text-xl font-medium transition duration-300">
          Home
        </Link>

        {!user && (
          <>
            <Link to="/login" className="text-white hover:text-gray-300 text-xl font-medium transition duration-300">
              Login
            </Link>
            <Link to="/register" className="text-white hover:text-gray-300 text-xl font-medium transition duration-300">
              Register
            </Link>
          </>
        )}

        {user && (
          <div className="flex items-center space-x-6">
            {/* Profile Circle */}
            <div className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xl shadow-md">
              {user.firstName?.charAt(0)}
              {user.lastName?.charAt(0)}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg transition text-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
