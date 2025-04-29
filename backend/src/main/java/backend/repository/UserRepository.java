package backend.repository;

import backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface UserRepository extends MongoRepository<User, String> {

    List<User> findByInterestsIn(List<String> interests);

    //  New: Find User by Email (for login)
    User findByEmail(String email);
}
