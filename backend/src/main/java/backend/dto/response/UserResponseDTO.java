package backend.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class UserResponseDTO {
    private String id;
    private String username;
    private List<String> postIds;
    private List<String> commentIds;
    private List<String> likeIds;
    private List<String> notificationIds;
}