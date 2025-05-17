package backend.controller;

import backend.model.Notification;
import backend.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/post/{postId}")
    public List<Notification> getNotificationsByPostId(@PathVariable String postId) {
        return notificationService.getNotificationsByPostId(postId);
    }

    @GetMapping("/comment/{commentId}")
    public List<Notification> getNotificationsByCommentId(@PathVariable String commentId) {
        return notificationService.getNotificationsByCommentId(commentId);
    }

    @PutMapping("/{id}/read")
    public void markNotificationAsRead(@PathVariable String id) {
        notificationService.markNotificationAsRead(id);
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable String id) {
        notificationService.deleteNotification(id);
    }

    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationService.getAllNotifications();
    }
}