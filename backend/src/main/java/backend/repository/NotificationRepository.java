package backend.repository;

import backend.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByPostId(String postId);

    List<Notification> findByCommentId(String commentId);
}
