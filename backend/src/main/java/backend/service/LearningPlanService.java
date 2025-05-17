package backend.service;

import backend.dto.request.LearningPlanRequestDTO;
import backend.dto.response.LearningPlanResponseDTO;
import backend.model.LearningPlan;
import backend.model.User;

import backend.repository.LearningPlanRepository;
import backend.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a new Learning Plan
    public LearningPlanResponseDTO createLearningPlan(LearningPlanRequestDTO requestDTO, String authorId) {
        try {
            log.info("Creating learning plan for author ID: {}", authorId);

            // Create a new LearningPlan entity
            LearningPlan newLearningPlan = new LearningPlan();
            newLearningPlan.setTitle(requestDTO.getTitle());
            newLearningPlan.setAuthorId(authorId);
            newLearningPlan.setLearningImg(requestDTO.getLearningImg());
            newLearningPlan.setDescription(requestDTO.getDescription());
            newLearningPlan.setStatus(requestDTO.getStatus());

            // Set tasks and calculate initial progress
            if (requestDTO.getTasks() != null) {
                List<LearningPlan.Task> tasks = requestDTO.getTasks().stream()
                        .map(dtoTask -> new LearningPlan.Task(dtoTask.getName(), dtoTask.isCompleted()))
                        .collect(Collectors.toList());
                newLearningPlan.setTasks(tasks);
            }
            newLearningPlan.calculateProgress();

            // Save the new learning plan to the database
            LearningPlan savedPlan = learningPlanRepository.save(newLearningPlan);
            log.info("Learning plan created successfully with ID: {}", savedPlan.getId());

            return mapToResponseDTO(savedPlan);
        } catch (Exception e) {
            log.error("Failed to create learning plan for author ID: {}. Error: {}", authorId, e.getMessage(), e);
            throw new RuntimeException("Failed to create learning plan: " + e.getMessage());
        }
    }

    // Get all Learning Plans
    public List<LearningPlanResponseDTO> getAllLearningPlans() {
        try {
            log.info("Fetching all learning plans");
            List<LearningPlan> learningPlans = learningPlanRepository.findAll();

            List<LearningPlanResponseDTO> responseDTOs = learningPlans.stream().map(plan -> {
                User author = userRepository.findById(plan.getAuthorId())
                        .orElseThrow(() -> new RuntimeException("Author not found with ID: " + plan.getAuthorId()));

                LearningPlanResponseDTO dto = new LearningPlanResponseDTO();
                dto.setId(plan.getId());
                dto.setTitle(plan.getTitle());
                dto.setDescription(plan.getDescription());
                dto.setStatus(plan.getStatus());
                dto.setLearningImg(plan.getLearningImg());
                dto.setProgress(plan.getProgress());
                dto.setAuthorId(author.getId());
                dto.setAuthorUsername(author.getUsername());
                dto.setTasks(plan.getTasks() != null ? plan.getTasks().stream()
                        .map(task -> new LearningPlanResponseDTO.Task(task.getName(), task.isCompleted()))
                        .collect(Collectors.toList()) : new ArrayList<>());

                return dto;
            }).collect(Collectors.toList());

            log.info("Fetched {} learning plans", responseDTOs.size());
            return responseDTOs;
        } catch (Exception e) {
            log.error("Error fetching all learning plans: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch learning plans: " + e.getMessage());
        }
    }
    // Get a Learning Plan by ID
    public LearningPlanResponseDTO getLearningPlanById(String id) {
        try {
            log.info("Fetching learning plan with ID: {}", id);
            LearningPlan learningPlan = learningPlanRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Learning Plan not found with ID: " + id));
            LearningPlanResponseDTO responseDTO = mapToResponseDTO(learningPlan);
            log.info("Successfully fetched learning plan with ID: {}", id);
            return responseDTO;
        } catch (RuntimeException e) {
            log.warn("Learning plan not found with ID: {}. Error: {}", id, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error fetching learning plan with ID: {}. Error: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch learning plan: " + e.getMessage());
        }
    }

    // Update a Learning Plan (with image)
    public LearningPlan updateLearningPlan(String id, LearningPlan learningPlanDetails, MultipartFile imageFile) throws IOException {
        try {
            log.info("Updating learning plan with ID: {}", id);
            LearningPlan existingLearningPlan = learningPlanRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Learning Plan not found with ID: " + id));

            // Update fields
            existingLearningPlan.setTitle(learningPlanDetails.getTitle());
            existingLearningPlan.setDescription(learningPlanDetails.getDescription());
            existingLearningPlan.setStatus(learningPlanDetails.getStatus());
            existingLearningPlan.setTasks(learningPlanDetails.getTasks()); // Update tasks
            existingLearningPlan.calculateProgress(); // Recalculate progress

            // Handle image upload if provided
            if (imageFile != null && !imageFile.isEmpty()) {
                String uploadDir = "D:/HealthSync/backend/src/main/uploads/";
                File directory = new File(uploadDir);
                if (!directory.exists()) {
                    if (!directory.mkdirs()) {
                        log.error("Failed to create uploads directory: {}", uploadDir);
                        throw new IOException("Failed to create uploads directory: " + uploadDir);
                    }
                    log.info("Created uploads directory: {}", uploadDir);
                }
                String originalFilename = imageFile.getOriginalFilename();
                Path filePath = Paths.get(uploadDir, originalFilename);

                Files.write(filePath, imageFile.getBytes());
                existingLearningPlan.setLearningImg(originalFilename);
                log.info("Image updated for learning plan ID: {}. New image: {}", id, originalFilename);
            } else {
                log.info("No new image uploaded for learning plan ID: {}", id);
            }

            LearningPlan updatedPlan = learningPlanRepository.save(existingLearningPlan);
            log.info("Learning plan updated successfully with ID: {}", id);
            return updatedPlan;
        } catch (IOException e) {
            log.error("IOException while updating learning plan ID: {}. Error: {}", id, e.getMessage(), e);
            throw e;
        } catch (RuntimeException e) {
            log.warn("Learning plan not found with ID: {}. Error: {}", id, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error updating learning plan with ID: {}. Error: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to update learning plan: " + e.getMessage());
        }
    }

    // Update a Learning Plan (for progress updates, without image)
    public LearningPlanResponseDTO updateLearningPlan(String id, LearningPlanRequestDTO requestDTO) {
        try {
            log.info("Updating learning plan with ID: {} for progress update", id);
            LearningPlan existingLearningPlan = learningPlanRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Learning Plan not found with ID: " + id));

            // Update fields
            existingLearningPlan.setTitle(requestDTO.getTitle());
            existingLearningPlan.setDescription(requestDTO.getDescription());
            existingLearningPlan.setStatus(requestDTO.getStatus());

            // Update tasks if provided
            if (requestDTO.getTasks() != null) {
                List<LearningPlan.Task> tasks = requestDTO.getTasks().stream()
                        .map(dtoTask -> new LearningPlan.Task(dtoTask.getName(), dtoTask.isCompleted()))
                        .collect(Collectors.toList());
                existingLearningPlan.setTasks(tasks);
            }

            // Recalculate progress based on tasks
            existingLearningPlan.calculateProgress();

            // Preserve existing image if not updated
            if (requestDTO.getLearningImg() != null) {
                existingLearningPlan.setLearningImg(requestDTO.getLearningImg());
            }

            LearningPlan updatedPlan = learningPlanRepository.save(existingLearningPlan);
            log.info("Learning plan progress updated successfully for ID: {}. New progress: {}", id, updatedPlan.getProgress());
            return mapToResponseDTO(updatedPlan);
        } catch (RuntimeException e) {
            log.warn("Learning plan not found with ID: {}. Error: {}", id, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error updating learning plan progress with ID: {}. Error: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to update learning plan progress: " + e.getMessage());
        }
    }

    // New method to toggle task completion
    public LearningPlanResponseDTO toggleTaskCompletion(String id, int taskIndex) {
        try {
            log.info("Toggling task completion for learning plan ID: {}, task index: {}", id, taskIndex);
            LearningPlan learningPlan = learningPlanRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Learning Plan not found with ID: " + id));

            if (taskIndex < 0 || taskIndex >= learningPlan.getTasks().size()) {
                throw new RuntimeException("Invalid task index: " + taskIndex);
            }

            // Toggle the task's completion status
            LearningPlan.Task task = learningPlan.getTasks().get(taskIndex);
            task.setCompleted(!task.isCompleted());

            // Recalculate progress
            learningPlan.calculateProgress();

            LearningPlan updatedPlan = learningPlanRepository.save(learningPlan);
            log.info("Task completion toggled successfully for learning plan ID: {}. New progress: {}", id, updatedPlan.getProgress());
            return mapToResponseDTO(updatedPlan);
        } catch (RuntimeException e) {
            log.warn("Error toggling task completion for learning plan ID: {}. Error: {}", id, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error toggling task completion for learning plan ID: {}. Error: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to toggle task completion: " + e.getMessage());
        }
    }

    // Delete a Learning Plan
    public boolean deleteLearningPlan(String id) {
        try {
            log.info("Deleting learning plan with ID: {}", id);
            Optional<LearningPlan> learningPlanOptional = learningPlanRepository.findById(id);
            if (learningPlanOptional.isPresent()) {
                learningPlanRepository.deleteById(id);
                log.info("Learning plan deleted successfully with ID: {}", id);
                return true;
            }
            log.warn("Learning plan not found with ID: {}", id);
            return false;
        } catch (Exception e) {
            log.error("Error deleting learning plan with ID: {}. Error: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to delete learning plan: " + e.getMessage());
        }
    }

    // Helper method to map LearningPlan to LearningPlanResponseDTO
    public LearningPlanResponseDTO mapToResponseDTO(LearningPlan learningPlan) {
        LearningPlanResponseDTO dto = new LearningPlanResponseDTO();
        dto.setId(learningPlan.getId());
        dto.setTitle(learningPlan.getTitle());
        dto.setDescription(learningPlan.getDescription());
        dto.setStatus(learningPlan.getStatus());
        dto.setLearningImg(learningPlan.getLearningImg());
        dto.setProgress(learningPlan.getProgress());
        dto.setAuthorId(learningPlan.getAuthorId());
        if (learningPlan.getTasks() != null) {
            List<LearningPlanResponseDTO.Task> tasks = learningPlan.getTasks().stream()
                    .map(task -> new LearningPlanResponseDTO.Task(task.getName(), task.isCompleted()))
                    .collect(Collectors.toList());
            dto.setTasks(tasks);
        }
        return dto;
    }
}