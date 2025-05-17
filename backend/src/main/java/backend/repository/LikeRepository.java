package backend.repository;

import backend.model.LikeDislike;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface LikeDislikeRepository extends MongoRepository<LikeDislike, String> {
    // Find a specific like/dislike action by postId and userId
    LikeDislike findByPostIdAndUserId(String postId, String userId);

    // Count likes/dislikes for a post
    long countByPostIdAndIsLiked(String postId, boolean isLiked);

    // Optional: Find all actions for a post (useful for debugging)
    List<LikeDislike> findAllByPostId(String postId);
}
