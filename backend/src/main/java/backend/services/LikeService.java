package com.example.ranthilini.services;

import com.example.ranthilini.models.Like;
import com.example.ranthilini.models.Notification;
import com.example.ranthilini.models.Post;
import com.example.ranthilini.repositories.LikeRepository;
import com.example.ranthilini.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private NotificationService notificationService;

    public Like createLike(Like like) {
        // Save the like
        Like savedLike = likeRepository.save(like);

        // Fetch the post to get the author ID
        Post post = postRepository.findById(like.getPostId()).orElse(null);
        if (post != null) {
            String authorId = post.getAuthorId();

            // Create a notification for the post's author
            Notification notification = new Notification();
            notification.setUserId(authorId);
            notification.setMessage(savedLike.isLiked()
                    ? "Your post was liked by " + like.getUserId()
                    : "Your post was disliked by " + like.getUserId());
            notification.setRead(false);
            notification.setPostId(like.getPostId());

            notificationService.createNotification(notification);
        }

        return savedLike;
    }

    public void deleteLike(String id) {
        likeRepository.deleteById(id);
    }
}