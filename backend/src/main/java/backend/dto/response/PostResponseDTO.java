package backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostResponseDTO {
    private String postId;
    private String reference;
    private String postCategory;
    private String description;
    private String focus;
    private String duration;
    private String authorId;
    private String author;
    private String postImage;
    private String authorUsername;
    private long likes;
    private long dislikes;
    private List<CommentResponseDTO> comments;

}
