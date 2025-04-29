package backend.dto.request;

import lombok.Data;

@Data
public class LikeRequestDTO {
    private boolean liked;
    private String userId;
    private String postId;
}