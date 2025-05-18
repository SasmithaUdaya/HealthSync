import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const result = await axios.get("http://localhost:8081/post/getposts");
      setPosts(result.data);
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  const filteredData = useMemo(() => {
    if (!searchParam) return posts;
    return posts.filter(post =>
      post.postCategory.toLowerCase().includes(searchParam.toLowerCase()) ||
      post.description.toLowerCase().includes(searchParam.toLowerCase())
    );
  }, [posts, searchParam]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-indigo-700">HealthSync</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-white text-indigo-700 border border-indigo-600 rounded hover:bg-indigo-100"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Sign Up
          </button>
        </div>
      </div>

      <div className="text-center mt-8">
        <h2 className="text-xl font-semibold">Welcome to HealthSync Platform</h2>
        <p className="text-gray-600">Connect, learn, and share your health journeys with others.</p>
      </div>


      <div className="max-w-2xl mx-auto mt-6 px-4">
        <input
          type="text"
          placeholder="Search posts..."
          onChange={(e) => setSearchParam(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>


      <div className="max-w-2xl mx-auto mt-8 px-4 space-y-6">
        {filteredData.length > 0 ? (
          filteredData.map((post) => (
            <div key={post.postId} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-700 font-medium text-sm">{post.postId?.charAt(0) || 'U'}</span>
                </div>
                <div className="ml-2">
                  <p className="font-semibold text-sm text-gray-800">{post.postId}</p>
                  <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {post.postImage && (
                <img
                  src={`http://localhost:8081/uploads/${post.postImage}`}
                  alt="Post"
                  className="w-full h-64 object-cover rounded mb-3"
                />
              )}
              <h3 className="text-lg font-bold text-gray-800">{post.postCategory}</h3>
              <p className="text-sm text-gray-600">{post.description}</p>
              <p className="text-xs text-gray-500 mt-1">Duration: {post.duration}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No posts found</p>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
