package backend.controller;

import backend.dto.request.LikeRequestDTO;
import backend.service.LikeDislikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/posts") // Added /api prefix
public class LikeDislikeController {

    @Autowired
    private LikeDislikeService likeDislikeService;

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> likePost(
            @PathVariable String postId,
            @RequestBody LikeRequestDTO requestDTO) {
        try {
            String result = likeDislikeService.likeOrDislikePost(postId, requestDTO.getUserId(), true);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{postId}/dislike")
    public ResponseEntity<?> dislikePost(
            @PathVariable String postId,
            @RequestBody LikeRequestDTO requestDTO) {
        try {
            String result = likeDislikeService.likeOrDislikePost(postId, requestDTO.getUserId(), false);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{postId}/likes")
    public ResponseEntity<Long> getLikes(@PathVariable String postId) {
        return ResponseEntity.ok(likeDislikeService.getLikes(postId));
    }

    @GetMapping("/{postId}/dislikes")
    public ResponseEntity<Long> getDislikes(@PathVariable String postId) {
        return ResponseEntity.ok(likeDislikeService.getDislikes(postId));
    }
}