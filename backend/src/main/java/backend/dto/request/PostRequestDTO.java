package backend.dto.request;


import lombok.Data;

@Data
public class PostRequestDTO {
    private String postCategory;
    private String description;
    private String status;
    private String duration;
    private String postImage;

}
