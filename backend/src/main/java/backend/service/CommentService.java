package backend.service;

import backend.dto.request.CommentRequestDTO;
import backend.dto.response.CommentResponseDTO;
import backend.exception.PostNotFoundException;
import backend.model.Comment;
import backend.model.Notification;
import backend.repository.CommentRepository;
import backend.repository.PostRepository;
import backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final NotificationRepository notificationRepository;

    public CommentResponseDTO createComment(String postId, CommentRequestDTO requestDTO) {
        if (!postRepository.existsById(postId)) {
            throw new PostNotFoundException("Post not found with ID: " + postId);
        }

        Comment comment = Comment.builder()
                .postId(postId)
                .text(requestDTO.getText())
                .author(requestDTO.getAuthor())
                .timestamp(new Date())
                .build();

        Comment savedComment = commentRepository.save(comment);

        // Create notification
        createNotification(postId, "New comment added: " + requestDTO.getText(), savedComment.getId());

        return mapToCommentResponseDTO(savedComment);
    }

    public List<CommentResponseDTO> getCommentsByPostId(String postId) {
        if (!postRepository.existsById(postId)) {
            throw new PostNotFoundException("Post not found with ID: " + postId);
        }

        return commentRepository.findByPostId(postId).stream()
                .map(this::mapToCommentResponseDTO)
                .collect(Collectors.toList());
    }

    public CommentResponseDTO updateComment(String postId, String commentId, String text) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new PostNotFoundException("Comment not found with ID: " + commentId));

        if (!comment.getPostId().equals(postId)) {
            throw new IllegalArgumentException("Comment does not belong to the specified post");
        }

        comment.setText(text);
        Comment updatedComment = commentRepository.save(comment);

        createNotification(postId, "Comment updated: " + text, commentId);

        return mapToCommentResponseDTO(updatedComment);
    }

    public void deleteComment(String commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new PostNotFoundException("Comment not found with ID: " + commentId));

        createNotification(comment.getPostId(), "Comment deleted", commentId);
        commentRepository.delete(comment);
    }

    private CommentResponseDTO mapToCommentResponseDTO(Comment comment) {
        return CommentResponseDTO.builder()
                .id(comment.getId())
                .postId(comment.getPostId())
                .text(comment.getText())
                .author(comment.getAuthor())
                .timestamp(comment.getTimestamp())
                .build();
    }

    private void createNotification(String postId, String message, String commentId) {
        Notification notification = Notification.builder()
                .postId(postId)
                .message(message)
                .commentId(commentId)
                .read(false)
                .timestamp(new Date())
                .build();
        notificationRepository.save(notification);
    }
}