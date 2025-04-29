package backend.controller;

import backend.model.Like;
import backend.service.LikeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping
    public Like createLike(@RequestBody Like like) {
        return likeService.createLike(like);
    }

    @DeleteMapping("/{id}")
    public void deleteLike(@PathVariable String id) {
        likeService.deleteLike(id);
    }
}
