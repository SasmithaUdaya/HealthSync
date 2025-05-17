package backend.service;

import backend.model.Notification;

import backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public void markNotificationAsRead(String id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    public void deleteNotification(String id) {
        notificationRepository.deleteById(id);
    }

    public Notification getNotificationById(String id) {
        return notificationRepository.findById(id).orElse(null);
    }

    public List<Notification> getNotificationsByPostId(String postId) {
        return notificationRepository.findByPostId(postId);
    }

    public List<Notification> getNotificationsByCommentId(String commentId) {
        return notificationRepository.findByCommentId(commentId);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Notification createLikeNotification(String postId, String recipientId) {
        Notification notification = Notification.builder()
                .message("Your post received a like")
                .read(false)
                .postId(postId)
                .recipientId(recipientId) // Add recipient ID
                .type("LIKE")
                .build();
        return notificationRepository.save(notification);
    }

    public Notification createDislikeNotification(String postId, String recipientId) {
        Notification notification = Notification.builder()
                .message("Your post received a dislike")
                .read(false)
                .postId(postId)
                .recipientId(recipientId) // Add recipient ID
                .type("DISLIKE")
                .build();
        return notificationRepository.save(notification);
    }

}