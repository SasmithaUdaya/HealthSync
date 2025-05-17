package backend.service;

import backend.model.LikeDislike;
import backend.model.Post;
import backend.repository.LikeDislikeRepository;
import backend.repository.PostRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LikeDislikeService {

    @Autowired
    private LikeDislikeRepository likeDislikeRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PostRepository postRepository; // Add this to get post author

    public String likeOrDislikePost(String postId, String userId, boolean isLiked) {
        // Get the post to find the author
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Check if user already liked/disliked this post
        LikeDislike existingAction = likeDislikeRepository.findByPostIdAndUserId(postId, userId);

        if (existingAction != null) {
            // User is changing their action
            if (existingAction.isLiked() == isLiked) {
                // User is clicking the same button again - remove the action
                likeDislikeRepository.delete(existingAction);
                return isLiked ? "Like removed" : "Dislike removed";
            } else {
                // User is changing from like to dislike or vice versa
                existingAction.setIsLiked(isLiked);
                likeDislikeRepository.save(existingAction);

                // Create notification for the change
                if (isLiked) {
                    notificationService.createLikeNotification(postId, post.getAuthorId());
                } else {
                    notificationService.createDislikeNotification(postId, post.getAuthorId());
                }
                return isLiked ? "Changed to like" : "Changed to dislike";
            }
        } else {
            // New action
            LikeDislike newAction = new LikeDislike();
            newAction.setPostId(postId);
            newAction.setUserId(userId);
            newAction.setIsLiked(isLiked);
            likeDislikeRepository.save(newAction);

            // Create notification for new action
            if (isLiked) {
                notificationService.createLikeNotification(postId, post.getAuthorId());
            } else {
                notificationService.createDislikeNotification(postId, post.getAuthorId());
            }
            return isLiked ? "Post liked successfully" : "Post disliked successfully";
        }
    }

    public long getLikes(String postId) {
        return likeDislikeRepository.countByPostIdAndIsLiked(postId, true);
    }

    public long getDislikes(String postId) {
        return likeDislikeRepository.countByPostIdAndIsLiked(postId, false);
    }

    // Optional: Get user's current action status for a post
    public Boolean getUserAction(String postId, String userId) {
        LikeDislike action = likeDislikeRepository.findByPostIdAndUserId(postId, userId);
        return action != null ? action.isLiked() : null;
    }
}