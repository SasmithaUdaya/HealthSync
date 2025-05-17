package backend.dto.response;

import lombok.Data;

@Data
public class PostResponseDTO {
    private String postId;
    private String reference;
    private String postCategory;
    private String description;
    private String focus;
    private String duration;
    private String authorId;
    private String postImage;
    private String authorUsername;

}
