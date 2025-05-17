import React, { useEffect, useState } from "react";
import axios from "axios";
import FollowingList from "../component/FollowingList";
import { useNavigate } from "react-router-dom";

const FollowingPage = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    if (!userId) return navigate("/login");
    fetchFollowing();
  }, []);

  const fetchFollowing = async () => {
  try {
    const res = await axios.get(`http://localhost:8081/api/follow/following/${userId}`);
    const followLinks = res.data;

    const fullUsers = await Promise.all(
      followLinks.map(async (f) => {
        const userRes = await axios.get(`http://localhost:8081/api/users/${f.followingId}`);
        return {
          ...f,
          username: userRes.data.username,
        };
      })
    );

    setFollowing(fullUsers);
  } catch (err) {
    console.error("Error fetching following:", err);
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
      fetchFollowing(); // refresh list
    } catch (err) {
      console.error("Unfollow error:", err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Following List</h1>
      <FollowingList following={following} onUnfollow={handleUnfollow} />
    </div>
  );
};

export default FollowingPage;
