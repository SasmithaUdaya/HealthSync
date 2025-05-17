import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FollowersList from "../component/FollowersList"; // make sure this path is correct

const FollowersPage = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    if (!userId) return navigate("/login");
    fetchFollowers();
  }, []);

  const fetchFollowers = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/api/follow/followers/${userId}`);
      const data = await Promise.all(
        res.data.map(async (f) => {
          const userRes = await axios.get(`http://localhost:8081/api/users/${f.followerId}`);
          return {
            id: f.followerId,
            username: userRes.data.username,
          };
        })
      );
      setFollowers(data);
    } catch (err) {
      console.error("Failed to load followers", err);
    }
  };

  const handleRemove = async (followerId) => {
    try {
      await axios.delete(`http://localhost:8081/api/follow/unfollow`, {
        params: {
          followerId: followerId,
          followingId: userId,
        },
      });
      fetchFollowers(); // refresh list
    } catch (err) {
      console.error("Failed to remove follower", err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">My Followers</h1>
      <FollowersList followers={followers} onRemove={handleRemove} />
    </div>
  );
};

export default FollowersPage;
