package backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearningPlanResponseDTO {
    private String id;
    private String title;
    private String description;
    private String status;
    private String learningImg;
    private double progress;
    private String authorId;
    private List<Task> tasks = new ArrayList<>(); // Added tasks field
    private String error; // For error messages
    private String authorUsername;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Task {
        private String name;
        private boolean completed;
    }
}