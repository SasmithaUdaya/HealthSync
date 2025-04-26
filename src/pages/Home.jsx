import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';

function Home() {
  const [user, setUser] = useState(null);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchSuggestedUsers(userData.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchSuggestedUsers = async (userId) => {
    try {
      const res = await API.get(`/users/suggested/${userId}`);
      setSuggestedUsers(res.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast.error('Failed to fetch suggestions');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8 px-4">
      <h1 className="text-4xl font-bold text-indigo-700 mb-6">Welcome to HealthSync 🏡</h1>

      {user && (
        <h2 className="text-2xl font-semibold text-gray-700 mb-10">
          Hello, {user.firstName} {user.lastName} 👋
        </h2>
      )}

      <div className="w-full max-w-6xl">
        <h3 className="text-2xl font-bold text-gray-700 mb-8">People You May Like 🎯</h3>

        {suggestedUsers.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8">
            {suggestedUsers.map((suggested) => (
              <div
                key={suggested.id}
                className="flex items-center bg-white shadow-lg rounded-lg p-4 w-[22rem] hover:shadow-2xl transition transform hover:scale-105"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center text-2xl font-bold text-white">
                    {suggested.firstName?.charAt(0)}{suggested.lastName?.charAt(0)}
                  </div>
                </div>
                <div className="ml-4 flex flex-col">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {suggested.firstName} {suggested.lastName}
                  </h4>
                  <p className="text-gray-500">@{suggested.username}</p>
                  <button className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs px-4 py-1 rounded-full transition">
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center">No suggestions available 😢</div>
        )}
      </div>
    </div>
  );
}

export default Home;
