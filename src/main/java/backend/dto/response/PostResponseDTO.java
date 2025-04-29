package backend.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class PostResponseDTO {
    private String id;
    private String title;
    private String description;
    private String status;
    private String duration;
    private String imageUrl;
    private String authorId;
    private List<String> commentIds;
    private List<String> likeIds;
}