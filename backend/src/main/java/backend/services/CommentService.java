package com.example.ranthilini.services;

import com.example.ranthilini.models.Comment;
import com.example.ranthilini.models.Notification;
import com.example.ranthilini.models.Post;
import com.example.ranthilini.repositories.CommentRepository;
import com.example.ranthilini.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private NotificationService notificationService;

    public Comment createComment(Comment comment) {
        // Save the comment
        Comment savedComment = commentRepository.save(comment);

        // Fetch the post to get the author ID
        Post post = postRepository.findById(comment.getPostId()).orElse(null);
        if (post != null) {
            String authorId = post.getAuthorId();

            // Create a notification for the post's author
            Notification notification = new Notification();
            notification.setUserId(authorId);
            notification.setMessage("New comment on your post: " + comment.getText());
            notification.setRead(false);
            notification.setPostId(comment.getPostId());

            notificationService.createNotification(notification);
        }

        return savedComment;
    }

    public void deleteComment(String id) {
        commentRepository.deleteById(id);
    }

    public List<Comment> getCommentsForPost(String postId) {
        return commentRepository.findByPostId(postId);
    }
}
