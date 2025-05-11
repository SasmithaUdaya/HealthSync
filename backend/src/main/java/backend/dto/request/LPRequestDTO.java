package backend.dto.request;


import lombok.Data;

import java.util.List;

@Data
public class LPRequestDTO {
    private String lpTitle;
    private String lpCategory;
    private String lpDescription;
    private String lpObjectives;
    private String lpDuration;
    private String lpImage;
    private String ownerId;
    private List<String> mediaFiles;

}
