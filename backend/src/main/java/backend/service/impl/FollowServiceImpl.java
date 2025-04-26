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
import java.util.stream.Collectors;

@Service
public class FollowServiceImpl implements FollowService {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void followUser(Long followerId, Long followingId) {
        Optional<User> followerOpt = userRepository.findById(followerId);
        Optional<User> followingOpt = userRepository.findById(followingId);

        if (followerOpt.isPresent() && followingOpt.isPresent()) {
            Follow follow = new Follow();
            follow.setFollower(followerOpt.get());
            follow.setFollowing(followingOpt.get());
            followRepository.save(follow);
        } else {
            throw new RuntimeException("Invalid follower or following user ID.");
        }
    }

    @Override
    public void unfollowUser(Long followerId, Long followingId) {
        Optional<User> followerOpt = userRepository.findById(followerId);
        Optional<User> followingOpt = userRepository.findById(followingId);

        if (followerOpt.isPresent() && followingOpt.isPresent()) {
            followRepository.deleteByFollowerAndFollowing(followerOpt.get(), followingOpt.get());
        } else {
            throw new RuntimeException("Invalid follower or following user ID.");
        }
    }

    @Override
    public List<User> getFollowers(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            List<Follow> followers = followRepository.findByFollowing(userOpt.get());
            return followers.stream()
                    .map(Follow::getFollower)
                    .collect(Collectors.toList());
        } else {
            throw new RuntimeException("User not found.");
        }
    }

    @Override
    public List<User> getFollowing(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            List<Follow> following = followRepository.findByFollower(userOpt.get());
            return following.stream()
                    .map(Follow::getFollowing)
                    .collect(Collectors.toList());
        } else {
            throw new RuntimeException("User not found.");
        }
    }
}
