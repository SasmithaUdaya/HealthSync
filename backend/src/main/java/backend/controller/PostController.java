package backend.controller;


import backend.dto.request.PostRequestDTO;
import backend.dto.response.PostResponseDTO;
import backend.exception.PostNotFoundException;
import backend.model.Post;
import backend.service.PostService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

@Slf4j
@RequestMapping("/post")
@RestController
public class PostController {
    //create crud operation

    @Autowired
    private PostService postService;

    //create inserting part

    @PostMapping("/create/{id}")
    public ResponseEntity<PostResponseDTO> newPostModel(@RequestBody PostRequestDTO postRequestDTO, @PathVariable String id) {
        // Get authenticated user (if needed)

        PostResponseDTO postResponseDTO = postService.createPost(postRequestDTO, id);
        return ResponseEntity.ok(postResponseDTO);
    }



    @PostMapping(value = "/postimage",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String postImage(@RequestParam("file") MultipartFile file) {
        // Set the correct path to the uploads folder
        String folder = "D:/HealthSync/backend/src/main/uploads/";
        String postImage = file.getOriginalFilename();

        try {
            File uploadDir = new File(folder);
            if (!uploadDir.exists()) {
                if (uploadDir.mkdirs()) {
                    log.info("Uploads folder created at: {}", folder);
                } else {
                    log.error("Failed to create uploads folder at: {}", folder);
                    return "Error creating uploads folder";
                }
            }

            // Save the image to the specified path
            file.transferTo(Paths.get(folder + postImage));
            log.info("Image successfully saved: {}", folder + postImage);
        } catch (IOException e) {
            log.error("Image upload failed", e);
            return "Error uploading file: " + postImage;
        }
        return postImage;
    }



    // Read - Get all posts
    @GetMapping("/getposts")
    public ResponseEntity<?> getAllPosts() {
        try {
            return ResponseEntity.ok(postService.getAllPosts());
        } catch (Exception e) {
            log.error("Failed to fetch posts", e);
            return ResponseEntity.internalServerError().body("Failed to fetch posts");
        }
    }

    @GetMapping("getpost/{id}")
    public ResponseEntity<PostResponseDTO> getPostById(@PathVariable String id) {
        PostResponseDTO post = postService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    private final String UPLOAD_DIR = "D:/HealthSync/backend/src/main/uploads/";
    @GetMapping("/uploads/{filename}")
    public ResponseEntity<FileSystemResource> getImage(@PathVariable String filename) {
        File file = new File(UPLOAD_DIR + filename);
        if (!file.exists()) {
            throw new PostNotFoundException("File not found: " + filename);
        }
        return ResponseEntity.ok(new FileSystemResource(file));
    }

    @PutMapping("/posts/{id}")
    public ResponseEntity<Post> updatePost(
            @PathVariable String id,
            @RequestPart(value = "file", required = false) MultipartFile imageFile,
            @RequestPart(value = "postDetails") String postDetailsJson
    ) throws IOException {

        // Manually convert JSON string into Post object
        ObjectMapper objectMapper = new ObjectMapper();
        Post postDetails = objectMapper.readValue(postDetailsJson, Post.class);

        Post updatedPost = postService.updatePost(id, postDetails, imageFile);
        return ResponseEntity.ok(updatedPost);
    }


    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> deletePost(@PathVariable String id) {
        boolean isDeleted = postService.deletePost(id);
        if (isDeleted) {
            return ResponseEntity.ok("Post deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");
        }
    }







}
