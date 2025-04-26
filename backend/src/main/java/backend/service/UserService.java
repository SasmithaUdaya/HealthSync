package backend.service;

import backend.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {

    User registerUser(User user);

    User updateUser(Long userId, User updatedUser);

    void deleteUser(Long userId);

    Optional<User> getUserById(Long userId);

    List<User> getSuggestedUsers(Long userId);
}
