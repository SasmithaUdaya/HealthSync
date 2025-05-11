package backend.service;

import backend.dto.request.LPRequestDTO;
import backend.dto.response.LPResponseDTO;
import backend.model.LearningPlan;
import backend.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    public LPResponseDTO createLP(LPRequestDTO requestDTO) {
        try {
            LearningPlan newLP = LearningPlan.builder()
                    .lpTitle(requestDTO.getLpTitle())
                    .lpCategory(requestDTO.getLpCategory())
                    .lpDescription(requestDTO.getLpDescription())
                    .lpObjectives(requestDTO.getLpObjectives())
                    .lpDuration(requestDTO.getLpDuration())
                    .lpImage(requestDTO.getLpImage())
                    .ownerId(requestDTO.getOwnerId())
                    .mediaFiles(requestDTO.getMediaFiles())
                    .build();

            learningPlanRepository.save(newLP);

            return LPResponseDTO.builder()
                    .lpId(newLP.getLpId())
                    .lpTitle(newLP.getLpTitle())
                    .lpCategory(newLP.getLpCategory())
                    .lpDescription(newLP.getLpDescription())
                    .lpObjectives(newLP.getLpObjectives())
                    .lpStatus(newLP.getLpStatus())
                    .lpDuration(newLP.getLpDuration())
                    .lpImage(newLP.getLpImage())
                    .ownerId(newLP.getOwnerId())
                    .likes(0)
                    .followers(0)
                    .comments(List.of())
                    .mediaFiles(List.of())
                    .badges(List.of())
                    .build();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public List<LPResponseDTO> getAllLearningPlans() {
        List<LearningPlan> plans = learningPlanRepository.findAll();

        return plans.stream().map(lp -> LPResponseDTO.builder()
                .lpId(lp.getLpId())
                .lpTitle(lp.getLpTitle())
                .lpCategory(lp.getLpCategory())
                .lpDescription(lp.getLpDescription())
                .lpObjectives(lp.getLpObjectives())
                .lpStatus(lp.getLpStatus())
                .lpDuration(lp.getLpDuration())
                .lpImage(lp.getLpImage())
                .ownerId(lp.getOwnerId())
                .likes(0) // Replace with actual logic if available
                .followers(0)
                .comments(List.of())
                .mediaFiles(List.of())
                .badges(List.of())
                .build()
        ).collect(Collectors.toList());
    }

    public Optional<LPResponseDTO> getLearningPlanById(String id) {
        return learningPlanRepository.findById(id).map(lp -> LPResponseDTO.builder()
                .lpId(lp.getLpId())
                .lpTitle(lp.getLpTitle())
                .lpCategory(lp.getLpCategory())
                .lpDescription(lp.getLpDescription())
                .lpObjectives(lp.getLpObjectives())
                .lpStatus(lp.getLpStatus())
                .lpDuration(lp.getLpDuration())
                .lpImage(lp.getLpImage())
                .ownerId(lp.getOwnerId())
                .likes(0)
                .followers(0)
                .comments(List.of())
                .mediaFiles(List.of())
                .badges(List.of())
                .build()
        );
    }

    public LearningPlan updateLearningPlan(String id, LearningPlan requestDTO, MultipartFile imageFile) throws IOException {
        LearningPlan existingLP = learningPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Learning Plan not found"));

        existingLP.setLpTitle(requestDTO.getLpTitle());
        existingLP.setLpCategory(requestDTO.getLpCategory());
        existingLP.setLpDescription(requestDTO.getLpDescription());
        existingLP.setLpObjectives(requestDTO.getLpObjectives());
        existingLP.setLpDuration(requestDTO.getLpDuration());
        existingLP.setOwnerId(requestDTO.getOwnerId());

        if (imageFile != null && !imageFile.isEmpty()) {
            String uploadDir = "D:/HealthSync/backend/src/main/uploads/";
            String originalFilename = imageFile.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, originalFilename);

            Files.write(filePath, imageFile.getBytes());
            existingLP.setLpImage(originalFilename);
        }

        return learningPlanRepository.save(existingLP);
    }

    public boolean deleteLearningPlan(String id) {
        Optional<LearningPlan> lpOptional = learningPlanRepository.findById(id);
        if (lpOptional.isPresent()) {
            LearningPlan lp = lpOptional.get();

            if (lp.getLpImage() != null) {
                Path imagePath = Paths.get("src/main/uploads", lp.getLpImage());
                try {
                    Files.deleteIfExists(imagePath);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            learningPlanRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
