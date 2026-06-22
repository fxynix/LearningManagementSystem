package lms.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lms.dto.create.UserCreateDto;
import lms.dto.update.UserUpdateDto;
import lms.model.User;
import lms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Controller", description = "API для управления пользователями")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("{id}")
    @Operation(summary = "Получить пользователя по ID")
    @ApiResponse(responseCode = "200", description = "Пользователь найден")
    @ApiResponse(responseCode = "404", description = "Пользователь не найден")
    public ResponseEntity<User> getUserById(
            @Parameter(description = "ID пользователя", example = "1")
            @PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping
    @Operation(summary = "Получить всех пользователей (с пагинацией)")
    @ApiResponse(responseCode = "200", description = "Пользователи найдены")
    public ResponseEntity<Page<User>> getAllUsers(
            @PageableDefault(sort = "id", direction = Sort.Direction.ASC)
            Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }

    @GetMapping("username/{username}")
    @Operation(summary = "Получить пользователей по логину (с пагинацией)")
    @ApiResponse(responseCode = "200", description = "Пользователи найдены")
    @ApiResponse(responseCode = "404", description = "Пользователи не найдены")
    public ResponseEntity<Page<User>> getUsersByUsername(
            @Parameter(description = "Логин пользователя (часть)", example = "ivan")
            @PathVariable String username,
            @PageableDefault(sort = "id", direction = Sort.Direction.ASC)
            Pageable pageable) {
        return ResponseEntity.ok(userService.getUsersByUsername(username, pageable));
    }

    @GetMapping("/all")
    @Operation(summary = "Получить всех пользователей (без пагинации)")
    @ApiResponse(responseCode = "200", description = "Пользователи найдены")
    public ResponseEntity<List<User>> getAllUsersNoPagination() {
        return ResponseEntity.ok(userService.getAllUsersList());
    }

    @PostMapping
    @Operation(summary = "Создать пользователя")
    @ApiResponse(responseCode = "201", description = "Пользователь создан")
    @ApiResponse(responseCode = "400", description = "Некорректные данные")
    public ResponseEntity<User> createUser(@Valid @RequestBody UserCreateDto dto) {
        User created = userService.createUser(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Обновить пользователя")
    @ApiResponse(responseCode = "200", description = "Пользователь обновлён")
    @ApiResponse(responseCode = "404", description = "Пользователь не найден")
    @ApiResponse(responseCode = "400", description = "Некорректные данные")
    public ResponseEntity<User> updateUser(
            @Parameter(description = "ID пользователя", example = "1")
            @PathVariable Integer id,
            @Valid @RequestBody UserUpdateDto dto) {
        return ResponseEntity.ok(userService.updateUser(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить пользователя")
    @ApiResponse(responseCode = "204", description = "Пользователь удалён")
    @ApiResponse(responseCode = "404", description = "Пользователь не найден")
    public ResponseEntity<Void> deleteUser(
            @Parameter(description = "ID пользователя", example = "1")
            @PathVariable Integer id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}