package backend.controller;

import backend.model.Follow;
import backend.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follow")
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/follow")
    public String followUser(@RequestParam String followerId, @RequestParam String followingId) {
        followService.followUser(followerId, followingId);
        return "Followed successfully!";
    }

    @DeleteMapping("/unfollow")
    public String unfollowUser(@RequestParam String followerId, @RequestParam String followingId) {
        followService.unfollowUser(followerId, followingId);
        return "Unfollowed successfully!";
    }

    @GetMapping("/followers/{userId}")
    public List<Follow> getFollowers(@PathVariable String userId) {
        return followService.getFollowers(userId);
    }

    @GetMapping("/following/{userId}")
    public List<Follow> getFollowing(@PathVariable String userId) {
        return followService.getFollowing(userId);
    }
}
