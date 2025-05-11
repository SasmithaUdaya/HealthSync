package backend.dto.response;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.List;

@Builder
@Data
public class LPResponseDTO {

    private String lpId;                // Unique identifier
    private String lpTitle;            // Title of the learning plan
    private String lpCategory;
    private String lpDescription;
    private String lpObjectives;
    private String lpDuration;
    private String lpStatus;           // e.g., In Progress, Completed
    private String lpImage;            // Image filename or URL
    private String ownerId;            // ID of the user who created the plan

    private int likes;                 // Number of likes
    private int followers;             // Number of followers
    private List<String> comments;     // Could be replaced with a comment DTO
    private List<String> mediaFiles;   // Additional media resources (optional)
    private List<String> badges;       // Achieved badges
}
