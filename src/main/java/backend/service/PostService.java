package backend.service;

import backend.model.Post;
import backend.repository.PostRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public Post getPostById(String id) {
        return postRepository.findById(id).orElse(null);
    }

    public void deletePost(String id) {
        postRepository.deleteById(id);
    }
}
