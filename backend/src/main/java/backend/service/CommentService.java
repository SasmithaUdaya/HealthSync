package backend.service;


import backend.model.Comment;
import backend.model.Notification;
import backend.model.Post;
import backend.repository.CommentRepository;
import backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final NotificationService notificationService;

    @Autowired
    public CommentService(CommentRepository commentRepository, PostRepository postRepository, NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.notificationService = notificationService;
    }

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

    public Comment updateComment(String commentId, String newText) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        comment.setText(newText);
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsForPost(String postId) {
        return commentRepository.findByPostId(postId);
    }
}
