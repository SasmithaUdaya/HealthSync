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
    <nav className="bg-blue-600 py-4 px-8 shadow-md flex items-center justify-between">
      {/* Left Side */}
      <Link to="/" className="text-white text-3xl font-bold tracking-wide">
        HealthSync
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-10">
        <Link to="/" className="text-white hover:text-gray-300 text-lg font-medium transition">
          Home
        </Link>

        {!user && (
          <>
            <Link to="/login" className="text-white hover:text-gray-300 text-lg font-medium transition">
              Login
            </Link>
            <Link to="/register" className="text-white hover:text-gray-300 text-lg font-medium transition">
              Register
            </Link>
          </>
        )}

        {user && (
          <div className="flex items-center gap-6">
            {/* Profile Icon */}
            <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xl">
              {user.firstName?.charAt(0)}
              {user.lastName?.charAt(0)}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
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
