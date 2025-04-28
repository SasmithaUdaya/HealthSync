package backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;
import java.util.List;

public class User {
    @Id
    private String userId;

    private String username;
    private String email;
    private String password;


    @DBRef(lazy = true)
    private List<Post> posts; // Posts created by this user

    private LocalDateTime createdAt;
}
