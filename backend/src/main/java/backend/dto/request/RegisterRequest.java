package backend.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String password;
    private List<String> interests;
}
