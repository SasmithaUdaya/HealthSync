import React from "react";

const FollowingList = ({ following, onUnfollow }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Following ({following.length})</h2>
      <div className="bg-white rounded p-4 shadow-sm space-y-2">
        {following.length === 0 ? (
          <p className="text-sm text-gray-500">You are not following anyone.</p>
        ) : (
          following.map((f) => (
            <div
              key={f.id}
              className="flex justify-between items-center border rounded px-3 py-2"
            >
              <p className="text-gray-700">{f.username}</p>
              <button
                onClick={() => onUnfollow(f.followingId)}
                className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FollowingList;
