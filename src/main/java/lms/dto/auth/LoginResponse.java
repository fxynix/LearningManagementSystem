package lms.dto.auth;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private Integer id;
    private String username;
    private List<String> roles;
    private String roleDescription;
}