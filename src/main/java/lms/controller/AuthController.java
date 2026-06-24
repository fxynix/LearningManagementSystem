package lms.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.stream.Collectors;
import lms.dto.auth.LoginRequest;
import lms.dto.auth.LoginResponse;
import lms.model.Role;
import lms.model.User;
import lms.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth Controller", description = "API для аутентификации")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Аутентификация пользователя",
            description = "Возвращает данные пользователя с ролями и описанием роли")
    @ApiResponse(responseCode = "200", description = "Успешный вход")
    @ApiResponse(responseCode = "401", description = "Неверный логин или пароль")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
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

        LoginResponse response = new LoginResponse(
                user.getId(),
                user.getUsername(),
                roleNames,
                roleDescription
        );
        return ResponseEntity.ok(response);
    }
}