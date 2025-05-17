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
    //private String authorId;
    //authorId is not included in the request DTO as it will be set by the serve
}


