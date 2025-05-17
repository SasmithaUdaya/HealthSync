import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import EditProfileDialog from "../component/EditProfileDialog";

const ProfilePage = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
  });

  useEffect(() => {
    if (!userId) return navigate("/login");
    fetchUserData();
    fetchFollowers();
    fetchFollowing();
  }, []);

  useEffect(() => {
  if (user.interests && user.interests.length > 0) {
    fetchSuggestedUsers();
  }
}, [user]);


  const fetchUserData = async () => {
    const res = await axios.get(`http://localhost:8081/api/users/${userId}`);
    setUser(res.data);
  };

  const fetchSuggestedUsers = async () => {
  try {
    const res = await axios.get(`http://localhost:8081/api/users/suggested/${userId}`);
    const allSuggested = res.data;

    // Remove users already followed
    const notFollowed = allSuggested.filter(
      (u) =>
        !following.some((f) => f.followingId === u.id) &&
        u.id !== userId // Exclude self
    );

    // Match interests
    const filtered = notFollowed.filter((u) =>
      u.interests?.some((i) => user.interests?.includes(i))
    );

    setSuggestedUsers(filtered);
  } catch (err) {
    console.error("Error fetching suggested users:", err);
  }
};


  const fetchFollowers = async () => {
  try {
    const res = await axios.get(`http://localhost:8081/api/follow/followers/${userId}`);
    const followLinks = res.data;

    // For each followerId, get the full user object
    const fullUsers = await Promise.all(
      followLinks.map(async (f) => {
        const userRes = await axios.get(`http://localhost:8081/api/users/${f.followerId}`);
        return {
          ...f,
          username: userRes.data.username,
        };
      })
    );

    setFollowers(fullUsers);
  } catch (err) {
    console.error("Error fetching followers:", err);
  }
};


  const fetchFollowing = async () => {
    const res = await axios.get(`http://localhost:8081/api/follow/following/${userId}`);
    setFollowing(res.data);
  };

  const handleFollow = async (targetId) => {
  try {
    await axios.post(`http://localhost:8081/api/follow/follow`, null, {
      params: {
        followerId: userId,
        followingId: targetId,
      },
    });

    // Refresh following list and suggestions
    fetchFollowing();
    fetchSuggestedUsers(); //  Refresh suggestions after following

  } catch (err) {
    console.error("Follow error:", err);
  }
};




const isFollowing = (targetId) => {
  return following.some((f) => f.followingId === targetId);
};


  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      await axios.delete(`http://localhost:8081/api/users/${userId}`);
      localStorage.clear();
      navigate("/");
    }
  };

  const openEditDialog = () => {
    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      email: user.email || "",
    });
    setIsEditOpen(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async () => {
    try {
      await axios.put(`http://localhost:8081/api/users/${userId}`, editForm);
      fetchUserData();
      setIsEditOpen(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleUnfollow = async (targetId) => {
  try {
    await axios.delete(`http://localhost:8081/api/follow/unfollow`, {
      params: {
        followerId: userId,
        followingId: targetId,
      },
    });
    fetchFollowing(); // refresh UI
  } catch (err) {
    console.error("Unfollow error:", err);
  }
};

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left: Suggested Users */}
      <div className="w-1/5 p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Suggested Users</h2>
        <div className="space-y-3">
          {suggestedUsers.length === 0 ? (
            <p className="text-sm text-gray-500">No suggestions available</p>
          ) : (
            suggestedUsers.map((u) => (
              <div
                key={u.id}
                className="bg-white p-4 rounded shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{u.username}</p>
                  <p className="text-sm text-gray-500">
                    {(u.interests || []).join(", ")}
                  </p>
                </div>
                {isFollowing(u.id) ? (
                <button
                  disabled
                  className="bg-gray-300 text-gray-600 text-sm px-3 py-1 rounded cursor-not-allowed"
                >
                  Following
                </button>
              ) : (
                <button
                  onClick={() => handleFollow(u.id)}
                  className="bg-indigo-500 text-white text-sm px-3 py-1 rounded hover:bg-indigo-600"
                >
                  Follow
                </button>
              )}

              </div>
            ))
          )}
        </div>
      </div>

      <div className="w-3/5 px-10 py-8">
  <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-10">
        {/* Profile picture and user info row */}
        <div className="flex items-center gap-6 mb-4">
          <img
            src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`}
            alt="Profile"
            className="w-20 h-20 rounded-full shadow-md"
          />
          <div>
            <p className="text-xl font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-500">@{user.username}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>

        {/* Interests */}
        <div className="mb-4">
          <strong className="text-gray-700">Interests:</strong>
          <div className="flex gap-2 flex-wrap mt-2">
            {(user.interests || []).map((interest, index) => (
              <span
                key={index}
                className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium"
              >
                {interest}
              </span>
            ))}
            {user.interests?.length === 0 && (
              <span className="text-sm text-gray-500">None</span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={openEditDialog}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
          >
            Update Profile
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Delete Account
          </button>
        </div>
      </div>

            <div className="grid grid-cols-2 gap-6">
        {/* Following */}
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Following</h2>
            <Link to="/following" className="text-sm text-indigo-600 hover:underline">
              View All ({following.length})
            </Link>
          </div>
          {following.length === 0 ? (
            <p className="text-sm text-gray-500">You are not following anyone.</p>
          ) : (
            <ul className="space-y-2">
              {following.map((f) => (
                <li
                  key={f.id}
                  className="bg-gray-100 px-3 py-2 rounded text-gray-800 text-sm shadow-sm"
                >
                  {f.username}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Followers */}
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Followers</h2>
            <Link to="/followers" className="text-sm text-indigo-600 hover:underline">
              View All ({followers.length})
            </Link>
          </div>
          {followers.length === 0 ? (
            <p className="text-sm text-gray-500">No followers yet.</p>
          ) : (
            <ul className="space-y-2">
              {followers.map((f) => (
                <li
                  key={f.id}
                  className="bg-gray-100 px-3 py-2 rounded text-gray-800 text-sm shadow-sm"
                >
                  {f.username}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>


      {/* Right: Sidebar */}
      {/* (Your sidebar code stays exactly as you posted, unchanged) */}
      <div className="w-64 bg-white border-l fixed right-0 top-0 h-full shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-indigo-700">HealthSync</h2>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
          <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">29°C</span>
              <span className="text-sm text-gray-500">Mostly cloudy</span>
            </div>
          </div>
          <nav className="mb-8">
            <ul className="space-y-2">
              <li>
                <Link to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                  <span className="font-medium">Home</span>
                </Link>
              </li>
              <li>
                <Link to="/learning-plans" className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                  </div>
                  <span className="font-medium">Learning Plans</span>
                </Link>
              </li>
              <li>
                <Link to="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">Profile</span>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="border-t pt-4">
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🔁 Edit Profile Dialog */}
      <EditProfileDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        formData={editForm}
        onChange={handleEditChange}
        onSave={handleProfileUpdate}
      />
    </div>

    
  );
};

export default ProfilePage;
