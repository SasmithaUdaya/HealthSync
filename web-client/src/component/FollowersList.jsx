import React from "react";

const FollowersList = ({ followers, onRemove }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Followers ({followers.length})</h2>
      <div className="bg-white rounded p-4 shadow-sm space-y-2">
        {followers.length === 0 ? (
          <p className="text-sm text-gray-500">No followers yet.</p>
        ) : (
          followers.map((f) => (
            <div
              key={f.id}
              className="flex justify-between items-center border rounded px-3 py-2"
            >
              <p className="text-gray-700">{f.username}</p>
              <button
                onClick={() => onRemove(f.id)}
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

export default FollowersList;
