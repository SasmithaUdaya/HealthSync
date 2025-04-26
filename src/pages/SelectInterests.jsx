import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserInterests } from '../services/userService';
import { toast } from 'react-toastify';

function SelectInterests() {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState([]);

  const allInterests = [
    'Coding', 'Music', 'Travel', 'Fitness',
    'Photography', 'Gaming', 'Cooking', 'Reading',
    'Art', 'Sports'
  ];

  const handleInterestClick = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        toast.error('User not logged in.');
        return;
      }

      await updateUserInterests(user.id, selectedInterests);
      toast.success('Interests saved! Showing suggestions...');
      navigate('/'); 

    } catch (error) {
      console.error('Failed to save interests:', error);
      toast.error('Failed to save interests.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-100 p-8">
      <h2 className="text-4xl font-bold text-indigo-700 mb-10 text-center">
        Select Your Interests 🎯
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mb-8">
        {allInterests.map((interest) => (
          <div
            key={interest}
            onClick={() => handleInterestClick(interest)}
            className={`cursor-pointer px-6 py-3 rounded-lg text-center font-semibold text-lg shadow-md transition-all select-none
              ${
                selectedInterests.includes(interest)
                  ? 'bg-indigo-500 text-white scale-105'
                  : 'bg-white text-indigo-600 border border-indigo-300 hover:bg-indigo-100'
              }
            `}
          >
            {interest}
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-10 rounded-xl transition-all"
      >
        Save Interests
      </button>
    </div>
  );
}

export default SelectInterests;
