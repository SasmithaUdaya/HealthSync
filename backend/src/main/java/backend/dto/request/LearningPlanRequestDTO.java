package backend.dto.request;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class LearningPlanRequestDTO {
    private String title;
    private String description;
    private String status;
    private double progress; // Still needed for manual updates via /update-progress
    private String learningImg;
    private List<Task> tasks = new ArrayList<>(); // Added tasks field

    @Data
    public static class Task {
        private String name;
        private boolean completed;
    }
}