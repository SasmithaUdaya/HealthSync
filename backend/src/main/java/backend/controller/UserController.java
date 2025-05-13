package backend.controller;

import backend.dto.request.LoginRequest;
import backend.dto.request.RegisterRequest;
import backend.dto.response.LoginResponse;
import backend.utils.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import backend.model.User;
import backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ Login
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            ApiResponse<LoginResponse> user = userService.loginUser(loginRequest);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body("Login failed: " + e.getMessage());
        }
    }

    // ✅ Register
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            ApiResponse<String> registeredUser = userService.registerUser(request);
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body("Registration failed: " + e.getMessage());
        }
    }

    // ✅ Update interests
    @PostMapping("/{userId}/interests")
    public ResponseEntity<?> updateUserInterests(
            @PathVariable String userId,
            @RequestBody List<String> interests) {
        try {
            List<String> updatedInterests = userService.updateUserInterests(userId, interests);
            return ResponseEntity.ok(updatedInterests);
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body("Failed to update interests: " + e.getMessage());
        }
    }

    // ✅ Update user (for profile editing)
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(
            @PathVariable String userId,
            @RequestBody User updatedUser) {
        try {
            User user = userService.updateUser(userId, updatedUser);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body("Failed to update user: " + e.getMessage());
        }
    }

    // ✅ Delete user
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok("User deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body("Failed to delete user: " + e.getMessage());
        }
    }

    // ✅ Get user by ID
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        Optional<User> userOptional = userService.getUserById(userId);
        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        } else {
            return ResponseEntity.badRequest().body("User not found.");
        }
    }

    // ✅ Get suggested users based on shared interests
    @GetMapping("/suggested/{userId}")
    public ResponseEntity<?> getSuggestedUsers(@PathVariable String userId) {
        try {
            List<User> suggestedUsers = userService.getSuggestedUsers(userId);
            return ResponseEntity.ok(suggestedUsers);
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body("Failed to get suggested users: " + e.getMessage());
        }
    }
}
