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
    private String postImage;
    // Assuming you want to include the user ID in the response
}
