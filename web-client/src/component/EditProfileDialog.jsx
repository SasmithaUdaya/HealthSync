import React from "react";

const EditProfileDialog = ({ isOpen, onClose, formData, onChange, onSave }) => {
  if (!isOpen) return null;

  const handleSave = () => {
    const { firstName, lastName, username, email } = formData;

    if (!firstName || !lastName || !username || !email) {
      alert("All fields must be filled out.");
      return;
    }

    onSave(); 
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">First Name</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={onChange}
              placeholder="First Name"
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Last Name</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={onChange}
              placeholder="Last Name"
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={onChange}
              placeholder="Username"
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              placeholder="Email"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileDialog;
