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
    <nav className="bg-blue-600 p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-white text-2xl font-bold">
          HealthSync
        </Link>
      </div>

      <div className="flex items-center space-x-6">
        <Link to="/" className="text-white hover:text-gray-200 text-lg">Home</Link>
        {!user && (
          <>
            <Link to="/login" className="text-white hover:text-gray-200 text-lg">Login</Link>
            <Link to="/register" className="text-white hover:text-gray-200 text-lg">Register</Link>
          </>
        )}
        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
