package backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.userdetails.User;


// Remove the userId field from Post class
@Document(collection = "Post")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {
    @Id
    private String postId;
    private String postCategory;
    private String description;
    private String focus;
    private String duration;
    private String postImage;
    private String reference;
    private Data createdAt;

}