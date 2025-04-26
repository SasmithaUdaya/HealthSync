package backend.repository;

import backend.model.Follow;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FollowRepository extends MongoRepository<Follow, String> {

    List<Follow> findByFollowerId(String followerId);

    List<Follow> findByFollowingId(String followingId);

    void deleteByFollowerIdAndFollowingId(String followerId, String followingId);
}
