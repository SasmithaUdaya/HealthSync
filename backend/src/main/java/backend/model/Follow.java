package backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "follows")
public class Follow {

    @Id
    private String id;

    private String followerId;
    private String followingId;

    // Setter methods for followerId and followingId
    public void setFollowerId(String followerId) {
        this.followerId = followerId;
    }

    public void setFollowingId(String followingId) {
        this.followingId = followingId;
    }
}
