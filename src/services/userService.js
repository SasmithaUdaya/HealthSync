import API from './api'; // ✅ You are using API instance correctly

// ✅ Register User
export const registerUser = async (userData) => {
  try {
    const response = await API.post('/users/register', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// ✅ Login User
export const loginUser = async (userData) => {
  try {
    const response = await API.post('/users/login', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update User Interests
export const updateUserInterests = async (userId, interests) => {
    try {
      const response = await API.put(`/users/${userId}`, { interests });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  