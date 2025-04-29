import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../services/api';

function SuggestedUsers() {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || !user.id) {
      toast.error('User not logged in.');
      navigate('/login');
    } else {
      fetchSuggestedUsers();
    }
  }, []);

  const fetchSuggestedUsers = async () => {
    try {
      const response = await API.get(`/users/suggested/${user.id}`);
      setSuggestedUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch suggested users:', error);
      toast.error('Failed to load suggested users.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-green-100 py-8 px-4">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">People You May Like 🎯</h2>

      {loading ? (
        <div className="text-gray-500 text-lg">Loading suggestions...</div>
      ) : suggestedUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center w-64">
              <div className="w-16 h-16 bg-indigo-200 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-700 mb-4">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{user.firstName} {user.lastName}</h3>
              <p className="text-sm text-gray-500 mb-4">@{user.username}</p>
              {/* Optional: Follow button in future */}
              {/* <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full text-sm">
                Follow
              </button> */}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-lg">No suggestions available 😢</div>
      )}
    </div>
  );
}

export default SuggestedUsers;
