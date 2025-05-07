package backend.service;

import backend.dto.request.PostRequestDTO;
import backend.dto.response.PostResponseDTO;
import backend.model.Post;
import backend.repository.PostRepository;
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
public class PostService {

    @Autowired
    private PostRepository postRepository;
    //private Object Collectors;

    public PostResponseDTO createPost(PostRequestDTO requestDTO) {
        try{
            //check authid
            Post newPost =  Post.builder() //update with authid
                    .reference(requestDTO.getReference())
                    .postCategory(requestDTO.getPostCategory())
                    .description(requestDTO.getDescription())
                    .focus(requestDTO.getFocus())
                    .duration(requestDTO.getDuration())
                    .postImage(requestDTO.getPostImage())
                    .build();

            // Save the new post to the database
             postRepository.save(newPost);

            // Create a response DTO
            PostResponseDTO responseDTO = new PostResponseDTO();
            responseDTO.setPostId(newPost.getPostId());
            responseDTO.setReference(newPost.getReference());
            responseDTO.setPostCategory(newPost.getPostCategory());
            responseDTO.setDescription(newPost.getDescription());
            responseDTO.setFocus(newPost.getFocus());
            responseDTO.setDuration(newPost.getDuration());
            responseDTO.setPostImage(newPost.getPostImage());


            return responseDTO;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // ✅ NEW: Get all posts
    public List<PostResponseDTO> getAllPosts() {
        List<Post> posts = postRepository.findAll();

        return posts.stream().map(post -> {
            PostResponseDTO dto = new PostResponseDTO();
            dto.setPostId(post.getPostId());
            dto.setReference(post.getReference());
            dto.setPostCategory(post.getPostCategory());
            dto.setDescription(post.getDescription());
            dto.setFocus(post.getFocus());
            dto.setDuration(post.getDuration());
            dto.setPostImage(post.getPostImage());
            return dto;
        }).collect(Collectors.toList());
    }

    public PostResponseDTO getPostById(String id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + id));

        PostResponseDTO dto = new PostResponseDTO();
        dto.setPostId(post.getPostId());
        dto.setReference(post.getReference());
        dto.setPostCategory(post.getPostCategory());
        dto.setDescription(post.getDescription());
        dto.setFocus(post.getFocus());
        dto.setDuration(post.getDuration());
        dto.setPostImage(post.getPostImage());
        return dto;
    }

    public Post updatePost(String id, Post postDetails, MultipartFile imageFile) throws IOException, IOException {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        existingPost.setReference(postDetails.getReference());
        existingPost.setPostCategory(postDetails.getPostCategory());
        existingPost.setDescription(postDetails.getDescription());
        existingPost.setFocus(postDetails.getFocus());
        existingPost.setDuration(postDetails.getDuration());

        // Save the new image if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            String uploadDir = "D:/HealthSync/backend/src/main/uploads/";
            String originalFilename = imageFile.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, originalFilename);

            Files.write(filePath, imageFile.getBytes());

            existingPost.setPostImage(originalFilename);
        }
        else{
            System.out.println("no file uploaded");
        }

        return postRepository.save(existingPost);
    }

    public boolean deletePost(String id) {
        Optional<Post> postOptional = postRepository.findById(id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();

            // Delete image file if needed
            if (post.getPostImage() != null) {
                Path imagePath = Paths.get("src/main/uploads", post.getPostImage());
                try {
                    Files.deleteIfExists(imagePath);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            postRepository.deleteById(id);
            return true;
        }
        return false;
    }




}
