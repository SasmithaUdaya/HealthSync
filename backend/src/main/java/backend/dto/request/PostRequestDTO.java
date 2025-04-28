package backend.dto.request;


import lombok.Data;

@Data
public class PostRequestDTO {
    private String reference;
    private String postCategory;
    private String description;
    private String focus;
    private String duration;
    private String postImage;

}


