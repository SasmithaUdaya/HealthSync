package backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "users") // ✅ Use MongoDB annotation
@Data
public class User {

    @Id
    private String id; // ✅ ID should be String (MongoDB generates it automatically)

    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String password;
    private List<String> interests;
}
