package lms.controller;

import java.util.List;
import java.util.stream.Collectors;
import lms.dto.auth.LoginRequest;
import lms.dto.auth.LoginResponse;
import lms.exception.AuthenticationException;
import lms.model.Role;
import lms.model.User;
import lms.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = authService.authenticate(request.getUsername(), request.getPassword());
            List<String> roleNames = user.getRoles().stream()
                    .map(Role::getName)
                    .collect(Collectors.toList());

            String roleDescription;
            if (roleNames.contains("ADMIN")) {
                roleDescription = "Администратор";
            } else if (roleNames.contains("TEACHER")) {
                roleDescription = "Преподаватель";
            } else {
                roleDescription = "Студент";
            }

            return ResponseEntity.ok(new LoginResponse(
                    user.getId(),
                    user.getUsername(),
                    roleNames,
                    roleDescription
            ));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}