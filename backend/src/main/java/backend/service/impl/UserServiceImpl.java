package backend.service.impl;

import backend.model.User;
import backend.repository.UserRepository;
import backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    // ✅ Register User
    @Override
    public User registerUser(User user) {
        return userRepository.save(user);
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
    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}
