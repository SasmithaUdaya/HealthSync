package backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "Post")
public class Post {

    @Id
    private String postId;
    private String postCategory;
    private String description;
    private String status;
    private String duration;
    private String postImage;

}
