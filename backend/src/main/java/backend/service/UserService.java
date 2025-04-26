package backend.service;

import backend.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {

    User registerUser(User user);

    User updateUser(String userId, User updatedUser);

    void deleteUser(String userId);

    Optional<User> getUserById(String userId);

    List<User> getSuggestedUsers(String userId);
}
