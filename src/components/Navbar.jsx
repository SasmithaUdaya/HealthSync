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
      <Link to="/" className="text-white text-2xl font-bold">
        HealthSync
      </Link>
      <div className="flex space-x-6">
        <Link to="/" className="text-white hover:text-gray-300">Home</Link>
        {!user && (
          <>
            <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
            <Link to="/register" className="text-white hover:text-gray-300">Register</Link>
          </>
        )}
        {user && (
          <button onClick={handleLogout} className="text-white hover:text-gray-300">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
