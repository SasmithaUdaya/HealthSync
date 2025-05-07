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
    //authorId is not included in the response DTO as it will be set by the server
    // Assuming you want to include the user ID in the response
}
