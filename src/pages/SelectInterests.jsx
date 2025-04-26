import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserInterests } from '../services/userService'; // 👈 You will create this API call

function SelectInterests() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const navigate = useNavigate();
  const interests = ['Coding', 'Music', 'Travel', 'Fitness', 'Photography', 'Gaming', 'Cooking', 'Reading', 'Art', 'Sports'];

  const handleSelect = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        alert('Please login again.');
        navigate('/login');
        return;
      }

      await updateUserInterests(user.id, selectedInterests);

      // Update localStorage after updating interests
      const updatedUser = { ...user, interests: selectedInterests };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      alert('Interests saved successfully!');
      navigate('/');
    } catch (error) {
      console.error('Failed to save interests:', error);
      alert('Failed to save interests.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Select Your Interests 🎯</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {interests.map((interest, index) => (
          <button
            key={index}
            onClick={() => handleSelect(interest)}
            className={`px-6 py-2 rounded-full border-2 ${
              selectedInterests.includes(interest)
                ? 'bg-green-400 text-white border-green-600'
                : 'border-gray-400'
            }`}
          >
            {interest}
          </button>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Save Interests
      </button>
    </div>
  );
}

export default SelectInterests;
