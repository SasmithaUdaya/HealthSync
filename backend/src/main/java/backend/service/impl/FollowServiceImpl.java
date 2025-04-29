package backend.service.impl;

import backend.model.Follow;
import backend.model.User;
import backend.repository.FollowRepository;
import backend.repository.UserRepository;
import backend.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FollowServiceImpl implements FollowService {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void followUser(String followerId, String followingId) {
        Follow follow = new Follow();
        follow.setFollowerId(followerId);
        follow.setFollowingId(followingId);
        followRepository.save(follow);
    }

    @Override
    public void unfollowUser(String followerId, String followingId) {
        followRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
    }

    @Override
    public List<Follow> getFollowers(String userId) {
        return followRepository.findByFollowingId(userId);
    }

    @Override
    public List<Follow> getFollowing(String userId) {
        return followRepository.findByFollowerId(userId);
    }
}
