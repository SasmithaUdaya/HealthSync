package backend.service;

import backend.model.Follow;
import java.util.List;

public interface FollowService {
    void followUser(String followerId, String followingId);
    void unfollowUser(String followerId, String followingId);
    List<Follow> getFollowing(String userId);
    List<Follow> getFollowers(String userId);
}
