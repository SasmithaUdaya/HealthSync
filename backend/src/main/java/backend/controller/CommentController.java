package backend.controller;

import backend.dto.request.CommentRequestDTO;
import backend.dto.response.CommentResponseDTO;
import backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comment")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CommentController {
    private final CommentService commentService;

    @PostMapping("/create/{postId}")
    public ResponseEntity<CommentResponseDTO> createComment(
            @RequestBody CommentRequestDTO requestDTO,
            @PathVariable String postId) {
        CommentResponseDTO responseDTO = commentService.createComment(postId, requestDTO);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/getcomments/{postId}")
    public ResponseEntity<List<CommentResponseDTO>> getCommentsByPostId(
            @PathVariable String postId) {
        List<CommentResponseDTO> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    @PutMapping("/update/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable String commentId,
            @RequestBody CommentRequestDTO requestDTO) {
        try {
            CommentResponseDTO responseDTO = commentService.updateComment(
                    requestDTO.getPostId(),
                    commentId,
                    requestDTO.getText());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable String commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}