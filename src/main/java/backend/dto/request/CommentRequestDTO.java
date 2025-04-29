package backend.dto.request;

import lombok.Data;

@Data
public class CommentRequestDTO {
    private String text;
    private String userId;
    private String postId;
}