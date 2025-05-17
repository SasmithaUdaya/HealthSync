package backend.service;

import backend.dto.request.LoginRequest;
import backend.dto.request.RegisterRequest;
import backend.dto.response.LoginResponse;
import backend.dto.response.UserResponseDTO;
import backend.model.User;
import backend.utils.ApiResponse;

import java.util.List;
import java.util.Optional;

public interface UserService {

    ApiResponse<LoginResponse> registerUser(RegisterRequest request);

    User updateUser(String userId, User updatedUser);

    void deleteUser(String userId);

    Optional<User> getUserById(String userId);

    List<User> getSuggestedUsers(String userId);

    // UserService.java
    List<String> updateUserInterests(String userId, List<String> interests);


    // ✅ New: Login method
    ApiResponse<LoginResponse> loginUser(LoginRequest loginRequest);

    List<UserResponseDTO> getAllUsers();
}
