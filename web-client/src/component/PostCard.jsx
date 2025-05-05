import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  return (
    <div className="bg-black rounded-lg overflow-hidden shadow-md mb-4">
      <img
        src={'https://static.independent.co.uk/2025/03/14/12/14/If-you-understand-the-principles-behind-lifting-weight-effectively-results-are-sure-to-follow.jpeg' ||post.imageUrl}
        alt={post.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
        <p className="text-gray-400 mb-4">{post.description}</p>
        <Link to={`/post/${post.id}`}>
        <button
          className="bg-secondary-orange text-white px-4 py-2 rounded hover:bg-[#DB3535] transition"
        >
          READ MORE
        </button></Link>
      </div>
    </div>
  );
};

export default PostCard;