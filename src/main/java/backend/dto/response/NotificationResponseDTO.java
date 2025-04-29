package backend.dto.response;

import lombok.Data;

@Data
public class NotificationResponseDTO {
    private String id;
    private String message;
    private boolean read;
    private String userId;
    private String postId;
    private String createdAt; // Timestamp
}