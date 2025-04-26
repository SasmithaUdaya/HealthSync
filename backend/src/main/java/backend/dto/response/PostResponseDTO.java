package backend.dto.response;

import lombok.Data;

@Data
public class PostResponseDTO {
    private String postId;
    private String postCategory;
    private String description;
    private String status;
    private String duration;
    private String postImage;

}
