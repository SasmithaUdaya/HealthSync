package backend.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Builder

@Document(collection = "notifications")
@Data
public class Notification {
    @Id
    private String id;
    private String message;
    private boolean read;
    private String postId;
    private String commentId;
    private String type;
    private Date timestamp;
    private String recipientId;

}