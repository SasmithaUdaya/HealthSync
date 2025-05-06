package backend.dto.response;

import lombok.Data;

@Data
public class CommentResponseDTO {
    private String id;
    private String text;
    private String userId;
    private String postId;
    private String createdAt; // You might want to add timestamp
}