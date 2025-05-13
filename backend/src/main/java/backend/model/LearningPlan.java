package backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "LearningPlan")
public class LearningPlan {

    @Id
    private String lpId;
    private String lpTitle;
    private String lpCategory;
    private String lpDescription;
    private String lpObjectives;
    private String lpStatus; // e.g., Not Started, In Progress, Completed
    private String lpDuration;
    private String lpImage;
    private String ownerId;

    private List<String> followers;
    private List<String> likedUserIds;
    //private List<Comment> comments;
    private List<String> badges;
    private List<String> mediaFiles;

}
