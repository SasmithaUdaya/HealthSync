import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import api from "../api/api.js";


const SelectInterestsPage = () => {


    const { userId } = useParams();
    const navigate = useNavigate();
    const allInterests = ["a", "b", "c", "d", "e", "f"];
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

            await api.post(`/api/users/interests/${userId}`, selected);
            alert("Registration complete!");
            navigate("/login");
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
                <div className="flex flex-wrap gap-3 justify-center mb-6">
                    {allInterests?.map((interest) => (
                        <button
                            key={interest}
                            onClick={() => toggleInterest(interest)}
                            className={`px-4 py-2 rounded border transition-all duration-200 ${
                                selected.includes(interest)
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-200 text-gray-800 hover:bg-indigo-100"
                            }`}
                        >
                            {interest.toUpperCase()}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleSubmit}
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                    Finish Registration
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
