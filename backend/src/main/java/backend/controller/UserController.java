package backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import backend.model.User;
import backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ Login
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        try {
            User user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Login failed: " + e.getMessage());
        }
    }

    // ✅ Register
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
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
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Update user
    @PutMapping("/{userId}")
    public User updateUser(@PathVariable String userId, @RequestBody User updatedUser) {
        return userService.updateUser(userId, updatedUser);
    }

    // ✅ Delete user
    @DeleteMapping("/{userId}")
    public void deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
    }

    // ✅ Get user by ID
    @GetMapping("/{userId}")
    public Optional<User> getUserById(@PathVariable String userId) {
        return userService.getUserById(userId);
    }

    // ✅ Get suggested users
    @GetMapping("/suggested/{userId}")
    public ResponseEntity<?> getSuggestedUsers(@PathVariable String userId) {
        try {
            List<User> suggestedUsers = userService.getSuggestedUsers(userId);
            return ResponseEntity.ok(suggestedUsers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
