package backend.controller;

import backend.dto.request.LPRequestDTO;
import backend.dto.response.LPResponseDTO;
import backend.model.LearningPlan;
import backend.service.LearningPlanService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.Optional;

@Slf4j
@RequestMapping("/learning-plan")
@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class LearningPlanController {

    @Autowired
    private LearningPlanService learningPlanService;

    // Create a new Learning Plan
    @PostMapping("/create")
    public ResponseEntity<LPResponseDTO> createLearningPlan(@RequestBody LPRequestDTO lpRequestDTO) {
        try {
            LPResponseDTO lpResponseDTO = learningPlanService.createLP(lpRequestDTO);
            return ResponseEntity.ok(lpResponseDTO);
        } catch (Exception e) {
            log.error("Failed to create learning plan", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Upload an image for the Learning Plan
    @PostMapping(value = "/lpimage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String uploadImage(@RequestParam("file") MultipartFile file) {
        String folder = "C:/Users/ASUS/Desktop/Y3 Sem 1 SLIIT/HealthSync/HealthSync/backend/src/main/uploads/";
        String lpImage = file.getOriginalFilename();

        try {
            File uploadDir = new File(folder);
            if (!uploadDir.exists()) {
                if (uploadDir.mkdirs()) {
                    log.info("Uploads folder created at: {}", folder);
                } else {
                    log.error("Failed to create uploads folder at: {}", folder);
                    return "Error creating uploads folder";
                }
            }

            file.transferTo(Paths.get(folder + lpImage));
            log.info("Image successfully saved: {}", folder + lpImage);
        } catch (IOException e) {
            log.error("Image upload failed", e);
            return "Error uploading file: " + lpImage;
        }
        return lpImage;
    }

    // Get all Learning Plans
    @GetMapping("/getlearningplans")
    public ResponseEntity<?> getAllLearningPlans() {
        try {
            return ResponseEntity.ok(learningPlanService.getAllLearningPlans());
        } catch (Exception e) {
            log.error("Failed to fetch learning plans", e);
            return ResponseEntity.internalServerError().body("Failed to fetch learning plans");
        }
    }

    // Get a Learning Plan by ID
    @GetMapping("getlearningplan/{id}")
    public ResponseEntity<Optional<LPResponseDTO>> getLearningPlanById(@PathVariable String id) {
            Optional<LPResponseDTO> lpResponseDTO = learningPlanService.getLearningPlanById(id);
            return ResponseEntity.ok(lpResponseDTO);
    }

    // Get image associated with the Learning Plan
    private final String UPLOAD_DIR = "C:/Users/ASUS/Desktop/Y3 Sem 1 SLIIT/HealthSync/HealthSync/backend/src/main/uploads/";

    @GetMapping("/uploads/{filename}")
    public ResponseEntity<FileSystemResource> getImage(@PathVariable String filename) {
        File file = new File(UPLOAD_DIR + filename);
        if (!file.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // Returns 404 if file is not found
        }
        return ResponseEntity.ok(new FileSystemResource(file));  // Returns the file if found
    }


    // Update an existing Learning Plan
    @PutMapping("/learningplan/{id}")
    public ResponseEntity<LearningPlan> updateLearningPlan(
            @PathVariable String id,
            @RequestPart(value = "file", required = false) MultipartFile imageFile,
            @RequestPart(value = "learningPlanDetails") String learningPlanDetailsJson
    ) throws IOException {

        // Manually convert JSON string into LearningPlan object
        ObjectMapper objectMapper = new ObjectMapper();
        LearningPlan learningPlanDetails = objectMapper.readValue(learningPlanDetailsJson, LearningPlan.class);

        LearningPlan updatedLearningPlan = learningPlanService.updateLearningPlan(id, learningPlanDetails, imageFile);
        return ResponseEntity.ok(updatedLearningPlan);
    }

    // Delete a Learning Plan
    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> deleteLearningPlan(@PathVariable String id) {
        boolean isDeleted = learningPlanService.deleteLearningPlan(id);
        if (isDeleted) {
            return ResponseEntity.ok("Learning Plan deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Learning Plan not found");
        }
    }
}
