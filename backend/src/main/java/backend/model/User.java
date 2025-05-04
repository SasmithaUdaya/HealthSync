package backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "users")
@Data
public class User {
    @Id
    private String id;
    private String username;

    private List<String> posts;
    private List<String> comments;
    private List<String> likes;
    private List<String> notifications;
}
