package backend.service.impl;

import backend.dto.request.LoginRequest;
import backend.dto.request.RegisterRequest;
import backend.dto.response.LoginResponse;
import backend.dto.response.UserResponseDTO;
import backend.model.User;
import backend.repository.UserRepository;
import backend.security.JwtUtils;
import backend.service.UserService;
import backend.utils.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Slf4j
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, AuthenticationManager authenticationManager, JwtUtils jwtUtils, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
    }



    @Override
    public ApiResponse<String> registerUser(RegisterRequest request) {
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                return ApiResponse.errorResponse("Email address already in use.");
            }

            String hashedPassword = passwordEncoder.encode(request.getPassword());

            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(hashedPassword);
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());

            // Save user once
            User savedUser = userRepository.save(user);
            return ApiResponse.successResponse("User Registered Successfully", jwtUtils.generateToken(savedUser.getEmail()));
        } catch (Exception e) {
            log.error("Error registering user: {}", e.getMessage(), e);
            return ApiResponse.errorResponse("Registration failed. Please try again later.");
        }
    }

    // ✅ Update User (including interests update)
    @Override
    public User updateUser(String userId, User updatedUser) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();

            if (updatedUser.getFirstName() != null) existingUser.setFirstName(updatedUser.getFirstName());
            if (updatedUser.getLastName() != null) existingUser.setLastName(updatedUser.getLastName());
            if (updatedUser.getUsername() != null) existingUser.setUsername(updatedUser.getUsername());
            if (updatedUser.getEmail() != null) existingUser.setEmail(updatedUser.getEmail());
            if (updatedUser.getPassword() != null) existingUser.setPassword(updatedUser.getPassword());
            if (updatedUser.getInterests() != null) existingUser.setInterests(updatedUser.getInterests());

            return userRepository.save(existingUser);
        } else {
            throw new RuntimeException("User not found with ID: " + userId);
        }
    }

    //  Delete User
    @Override
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    // UserServiceImpl.java
    @Override
    public List<String> updateUserInterests(String userId, List<String> interests) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setInterests(interests);
            userRepository.save(user);
            return user.getInterests();
        } else {
            throw new RuntimeException("User not found with ID: " + userId);
        }
    }


    // ✅ Get User by ID
    @Override
    public Optional<User> getUserById(String userId) {
        return userRepository.findById(userId);
    }

    // ✅ Get Suggested Users based on Interests
    @Override
    public List<User> getSuggestedUsers(String userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User currentUser = optionalUser.get();
            List<String> interests = currentUser.getInterests();

            return userRepository.findByInterestsIn(interests)
                    .stream()
                    .filter(user -> !user.getId().equals(userId)) // Do not suggest self
                    .collect(Collectors.toList());
        } else {
            throw new RuntimeException("User not found with ID: " + userId);
        }
    }

    // ✅ Login User
    @Override
    public ApiResponse<LoginResponse> loginUser(LoginRequest loginRequest) {
        try {
            // Authenticate user credentials
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(), loginRequest.getPassword()
                    )
            );

            // Check if authentication is successful
            if (authentication == null || !authentication.isAuthenticated()) {
                return ApiResponse.errorResponse("Invalid email or password");
            }

            // Get UserDetails
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Get the full user from repository to get accurate user data including name
            Optional<User> userOpt = userRepository.findByEmail(userDetails.getUsername());
            if (userOpt.isEmpty()) {
                return ApiResponse.errorResponse("User not found");
            }

            User user = userOpt.get();

            // Generate JWT token
            String token = jwtUtils.generateToken(userDetails.getUsername());

            LoginResponse loginResponse = LoginResponse.builder()
                    .accessToken(token)
                    .user(UserResponseDTO.builder()
                            .id(user.getId())
                            .email(user.getEmail())
                            .firstName(user.getFirstName())
                            .lastName(user.getLastName())
                            .username(user.getUsername())
                            .build())
                    .build();
            return ApiResponse.successResponse("User Login Successfully", loginResponse);


        } catch (BadCredentialsException e) {
            log.error("Bad credentials: {}", e.getMessage());
            return ApiResponse.errorResponse("Invalid email or password");
        } catch (Exception e) {
            log.error("Unexpected error during login: {}", e.getMessage(), e);
            return ApiResponse.errorResponse("Unexpected error occurred during login");
        }



        /*User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElse(null);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + loginRequest.getEmail());
        }

        if (!user.getPassword().equals(loginRequest.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;*/
    }
}
