package backend.controller;

import backend.model.Comment;
import backend.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping
    public Comment createComment(@RequestBody Comment comment) {
        return commentService.createComment(comment);
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable String id) {
        commentService.deleteComment(id);
    }

    @GetMapping("/post/{postId}")
    public List<Comment> getCommentsForPost(@PathVariable String postId) {
        return commentService.getCommentsForPost(postId);
    }

    @PutMapping("/{id}")
    public Comment updateComment(
            @PathVariable String id,
            @RequestBody Comment updatedComment) {
        return commentService.updateComment(id, updatedComment.getText());
    }

}
