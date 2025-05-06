package backend.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "likes")
@Data
public class Like {
    @Id
    private String id;
    private boolean liked;
    private String userId;
    private String postId;
}
