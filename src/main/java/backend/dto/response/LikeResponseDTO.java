package backend.dto.response;

import lombok.Data;

@Data
public class LikeResponseDTO {
    private String id;
    private boolean liked;
    private String userId;
    private String postId;
}