import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login'); // ✅ redirect to login if not found
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-green-500 mb-4">Welcome to Home Page 🏡</h1>
      {user && (
        <h2 className="text-2xl text-gray-700">Hello, {user.firstName} {user.lastName} 👋</h2>
      )}
    </div>
  );
}

export default Home;
