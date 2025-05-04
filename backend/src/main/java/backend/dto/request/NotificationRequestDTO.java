package backend.dto.request;

import lombok.Data;

@Data
public class NotificationRequestDTO {
    private String message;
    private String userId;
    private String postId;
}