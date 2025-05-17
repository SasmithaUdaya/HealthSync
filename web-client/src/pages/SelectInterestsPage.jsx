import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const SelectInterestsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const allInterests = [
  {
    label: "Mental Health Awareness",
    image: "https://img.icons8.com/color/96/mental-health.png",
  },
  {
    label: "Fitness & Exercise",
    image: "https://img.icons8.com/color/96/dumbbell.png",
  },
  {
    label: "Nutrition & Healthy Eating",
    image: "https://img.icons8.com/color/96/salad.png",
  },
  {
    label: "Yoga & Meditation",
    image: "https://img.icons8.com/color/96/yoga.png",
  },
  {
    label: "Sleep & Recovery",
    image: "https://img.icons8.com/color/96/sleeping-in-bed.png",
  },
  {
  label: "Learning Plans",
  image: "https://img.icons8.com/fluency/96/training.png"
  },
  {
    label: "Weight Management",
    image: "https://img.icons8.com/color/96/scale.png",
  },
  {
    label: "Personal Hygiene & Wellness",
    image: "https://img.icons8.com/fluency/96/wash-your-hands.png",
  },
  ];
  const [selected, setSelected] = useState([]);

  const toggleInterest = (interest) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`http://localhost:8081/api/users/${userId}/interests`, selected);
      alert("Registration complete!");
      navigate("/home");
    } catch (error) {
      alert("Failed to save interests.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Select Your Interests
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {allInterests.map((interest) => (
            <div
              key={interest.label}
              onClick={() => toggleInterest(interest.label)}
              className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center transition-all duration-200 hover:shadow-md ${
                selected.includes(interest.label)
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <img src={interest.image} alt={interest.label} className="w-16 h-16 mb-2" />
              <span className="text-center text-sm font-medium">{interest.label}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Submit
        </button>
        <p className="text-center text-sm mt-4 text-gray-600">
          Want to go back?{" "}
          <span
            className="text-indigo-600 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register Page
          </span>
        </p>
      </div>
    </div>
  );
};

export default SelectInterestsPage;
