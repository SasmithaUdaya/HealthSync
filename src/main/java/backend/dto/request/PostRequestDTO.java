package backend.dto.request;

import lombok.Data;

@Data
public class PostRequestDTO {
    private String title;
    private String description;
    private String status;
    private String duration;
    private String imageUrl;
    private String authorId;
}