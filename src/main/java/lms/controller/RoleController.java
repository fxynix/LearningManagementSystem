package lms.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lms.dto.create.RoleCreateDto;
import lms.dto.update.RoleUpdateDto;
import lms.model.Role;
import lms.model.User;
import lms.service.RoleService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles")
@Tag(name = "Role Controller", description = "API для управления ролями")
public class RoleController {

    private final RoleService roleService;

    @Autowired
    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping("{id}")
    @Operation(summary = "Получить роль по ID")
    @ApiResponse(responseCode = "200", description = "Роль найдена")
    @ApiResponse(responseCode = "404", description = "Роль не найдена")
    public ResponseEntity<Role> getRoleById(
            @Parameter(description = "ID роли", example = "1")
            @PathVariable Integer id) {
        return ResponseEntity.ok(roleService.getRoleById(id));
    }

    @GetMapping
    @Operation(summary = "Получить роли с пагинацией и фильтрацией по названию")
    @ApiResponse(responseCode = "200", description = "Роли найдены")
    public ResponseEntity<Page<Role>> getRoles(
            @Parameter(description = "Название (частичное совпадение)")
            @RequestParam(required = false) String name,
            @PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        if (name != null) {
            return ResponseEntity.ok(roleService.getRolesByName(name, pageable));
        } else {
            return ResponseEntity.ok(roleService.getAllRoles(pageable));
        }
    }

    @GetMapping("/{id}/users")
    @Operation(summary = "Получить всех пользователей с данной ролью")
    @ApiResponse(responseCode = "200", description = "Пользователи найдены")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable Integer id) {
        return ResponseEntity.ok(roleService.getUsersByRole(id));
    }

    @GetMapping("/all")
    @Operation(summary = "Получить все роли (без пагинации)")
    @ApiResponse(responseCode = "200", description = "Роли найдены")
    public ResponseEntity<List<Role>> getAllRolesNoPagination() {
        return ResponseEntity.ok(roleService.getAllRolesList());
    }

    @PostMapping
    @Operation(summary = "Создать роль")
    @ApiResponse(responseCode = "201", description = "Роль создана")
    @ApiResponse(responseCode = "400", description = "Некорректные данные")
    public ResponseEntity<Role> createRole(@Valid @RequestBody RoleCreateDto dto) {
        Role created = roleService.createRole(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Обновить роль")
    @ApiResponse(responseCode = "200", description = "Роль обновлена")
    @ApiResponse(responseCode = "404", description = "Роль не найдена")
    @ApiResponse(responseCode = "400", description = "Некорректные данные")
    public ResponseEntity<Role> updateRole(
            @Parameter(description = "ID роли", example = "1")
            @PathVariable Integer id,
            @Valid @RequestBody RoleUpdateDto dto) {
        return ResponseEntity.ok(roleService.updateRole(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить роль")
    @ApiResponse(responseCode = "204", description = "Роль удалена")
    @ApiResponse(responseCode = "404", description = "Роль не найдена")
    public ResponseEntity<Void> deleteRole(
            @Parameter(description = "ID роли", example = "1")
            @PathVariable Integer id) {
        roleService.deleteRole(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}