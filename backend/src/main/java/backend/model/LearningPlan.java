package backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "learningPlans")
public class LearningPlan {
    @Id
    private String id;
    private String title;
    private String description;
    private String status;
    private String learningImg;
    private double progress;
    private String authorId;
    private List<Task> tasks = new ArrayList<>(); // Added tasks field

    // Inner Task class
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Task {
        private String name;
        private boolean completed;
    }

    // Calculate progress based on completed tasks
    public void calculateProgress() {
        if (tasks == null || tasks.isEmpty()) {
            this.progress = 0;
            return;
        }
        long completedTasks = tasks.stream().filter(Task::isCompleted).count();
        this.progress = (completedTasks * 100.0) / tasks.size();
    }
}