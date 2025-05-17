package backend.controller;

import backend.dto.request.LearningPlanRequestDTO;
import backend.dto.response.LearningPlanResponseDTO;
import backend.model.LearningPlan;
import backend.service.LearningPlanService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/learning-plans")
@CrossOrigin(origins = "http://localhost:3000")
public class LearningPlanController {

    @Autowired
    private LearningPlanService learningPlanService;

    private static final String UPLOAD_DIRECTORY = "D:/HealthSync/backend/src/main/uploads/"; // Hardcoded as requested
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB max file size
    private static final List<String> ALLOWED_FILE_TYPES = List.of("image/jpeg", "image/png", "image/gif");

    // Create a new Learning Plan
    @PostMapping("/createLP/{id}")
    public ResponseEntity<LearningPlanResponseDTO> createLearningPlan(
            @RequestBody LearningPlanRequestDTO requestDTO,
            @PathVariable String id
    ) {
        try {
            log.info("Creating learning plan for user ID: {}", id);
            LearningPlanResponseDTO responseDTO = learningPlanService.createLearningPlan(requestDTO, id);
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            log.error("Error creating learning plan for user ID: {}. Error: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LearningPlanResponseDTO(null, null, null, null, null, 0, null, null, null, "Error creating learning plan: " + e.getMessage()));
        }
    }

    @PostMapping(value = "/learningimg", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> learningImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            log.warn("No file uploaded for learning image");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No file uploaded");
        }

        // Validate file type
        if (!ALLOWED_FILE_TYPES.contains(file.getContentType())) {
            log.warn("Invalid file type uploaded: {}. Allowed types: {}", file.getContentType(), ALLOWED_FILE_TYPES);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid file type. Only JPEG, PNG, and GIF are allowed.");
        }

        // Validate file size
        if (file.getSize() > MAX_FILE_SIZE) {
            log.warn("File size exceeds limit. Size: {}, Max allowed: {}", file.getSize(), MAX_FILE_SIZE);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File size exceeds 10MB limit.");
        }

        try {
            File uploadDir = new File(UPLOAD_DIRECTORY);
            if (!uploadDir.exists() && !uploadDir.mkdirs()) {
                log.error("Failed to create uploads folder at: {}", UPLOAD_DIRECTORY);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating uploads folder");
            }

            // Generate a unique file name to avoid conflicts
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") ? originalFilename.substring(originalFilename.lastIndexOf('.')) : "";
            String uniqueFilename = UUID.randomUUID().toString() + extension;
            Path filePath = Paths.get(UPLOAD_DIRECTORY, uniqueFilename);

            Files.write(filePath, file.getBytes());
            log.info("Image successfully saved: {}", filePath);
            return ResponseEntity.ok(uniqueFilename);
        } catch (IOException e) {
            log.error("Image upload failed for file: {}. Error: {}", file.getOriginalFilename(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading file: " + e.getMessage());
        }
    }

    // Get all Learning Plans
    @GetMapping("/allLP")
    public ResponseEntity<List<LearningPlanResponseDTO>> getAllLearningPlans() {
        try {
            log.info("Fetching all learning plans");
            List<LearningPlanResponseDTO> learningPlans = learningPlanService.getAllLearningPlans();
            return ResponseEntity.ok(learningPlans);
        } catch (Exception e) {
            log.error("Error fetching all learning plans: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    // Get a Learning Plan by ID
    @GetMapping("/getAll/{id}")
    public ResponseEntity<LearningPlanResponseDTO> getLearningPlanById(@PathVariable String id) {
        try {
            log.info("Fetching learning plan with ID: {}", id);
            LearningPlanResponseDTO responseDTO = learningPlanService.getLearningPlanById(id);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            log.warn("Learning plan not found with ID: {}. Error: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new LearningPlanResponseDTO(null, null, null, null, null, 0, null, null, null, e.getMessage()));
        } catch (Exception e) {
            log.error("Error fetching learning plan with ID: {}. Error: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LearningPlanResponseDTO(null, null, null, null, null, 0, null, null, null, "Error fetching learning plan: " + e.getMessage()));
        }
    }

    // Update a Learning Plan
    @PutMapping("/update/{id}")
    public ResponseEntity<LearningPlanResponseDTO> updateLearningPlan(
            @PathVariable String id,
            @RequestPart(value = "file", required = false) MultipartFile imageFile,
            @RequestPart(value = "learningPlanDetails") String learningPlanDetailsJson
    ) throws IOException {
        try {
            log.info("Received update request for learning plan ID: {}, learningPlanDetails: {}", id, learningPlanDetailsJson);

            ObjectMapper objectMapper = new ObjectMapper();
            LearningPlan learningPlanDetails = objectMapper.readValue(learningPlanDetailsJson, LearningPlan.class);

            LearningPlan updatedLearningPlan = learningPlanService.updateLearningPlan(id, learningPlanDetails, imageFile);
            LearningPlanResponseDTO responseDTO = learningPlanService.mapToResponseDTO(updatedLearningPlan);

            log.info("Learning plan updated successfully for ID: {}", id);
            return ResponseEntity.ok(responseDTO);
        } catch (IOException e) {
            log.error("IOException during update for ID: {}. Error: {}", id, e.getMessage(), e);
            throw e;
        } catch (RuntimeException e) {
            log.warn("Learning plan not found with ID: {}. Error: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new LearningPlanResponseDTO(null, null, null, null, null, 0, null, null, null, e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during update for ID: {}. Error: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LearningPlanResponseDTO(null, null, null, null, null, 0, null, null, null, "Error updating learning plan: " + e.getMessage()));
        }
    }

    // Toggle task completion
    @PatchMapping("/toggle-task/{id}/{taskIndex}")
    public ResponseEntity<LearningPlanResponseDTO> toggleTaskCompletion(
            @PathVariable String id,
            @PathVariable int taskIndex
    ) {
        try {
            if (taskIndex < 0) {
                log.warn("Invalid task index for learning plan ID: {}. Task index: {}", id, taskIndex);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new LearningPlanResponseDTO(null, null, null, null, null, 0, null, null, null, "Task index cannot be negative"));
            }

            log.info("Toggling task completion for learning plan ID: {}, task index: {}", id, taskIndex);
            LearningPlanResponseDTO updatedPlan = learningPlanService.toggleTaskCompletion(id, taskIndex);
            return ResponseEntity.ok(updatedPlan);
        } catch (RuntimeException e) {
            log.warn("Error toggling task completion for learning plan ID: {}. Error: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new LearningPlanResponseDTO(null, null, null, null, null, 0, null, null, null, e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error toggling task completion for learning plan ID: {}. Error: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LearningPlanResponseDTO(null, null, null, null, null, 0, null, null, null, "Error toggling task completion: " + e.getMessage()));
        }
    }

    // Delete a Learning Plan
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteLearningPlan(@PathVariable String id) {
        try {
            log.info("Deleting learning plan with ID: {}", id);
            boolean deleted = learningPlanService.deleteLearningPlan(id);
            if (deleted) {
                log.info("Learning plan deleted successfully for ID: {}", id);
                return ResponseEntity.noContent().build();
            } else {
                log.warn("Learning plan not found with ID: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error deleting learning plan with ID: {}. Error: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}