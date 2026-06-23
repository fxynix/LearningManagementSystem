package lms.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lms.dto.create.TestAttemptCreateDto;
import lms.dto.update.TestAttemptUpdateDto;
import lms.model.TestAttempt;
import lms.service.TestAttemptService;
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
@RequestMapping("/api/test-attempts")
@Tag(name = "Test Attempt Controller", description =
        "API для управления попытками прохождения тестов")
public class TestAttemptController {

    private final TestAttemptService testAttemptService;

    @Autowired
    public TestAttemptController(TestAttemptService testAttemptService) {
        this.testAttemptService = testAttemptService;
    }

    @GetMapping("{id}")
    @Operation(summary = "Получить попытку по ID")
    @ApiResponse(responseCode = "200", description = "Попытка найдена")
    @ApiResponse(responseCode = "404", description = "Попытка не найдена")
    public ResponseEntity<TestAttempt> getTestAttemptById(
            @Parameter(description = "ID попытки", example = "1")
            @PathVariable Integer id) {
        return ResponseEntity.ok(testAttemptService.getTestAttemptById(id));
    }

    @GetMapping
    @Operation(summary = "Получить попытки с пагинацией и фильтрацией")
    @ApiResponse(responseCode = "200", description = "Попытки найдены")
    public ResponseEntity<Page<TestAttempt>> getTestAttempts(
            @Parameter(description = "ID теста")
            @RequestParam(required = false) Integer testId,
            @Parameter(description = "ID пользователя")
            @RequestParam(required = false) Integer userId,
            @Parameter(description = "Название теста")
            @RequestParam(required = false) String  testTitle,
            @Parameter(description = "Логин пользователя")
            @RequestParam(required = false) String userUsername,
            @PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(testAttemptService.getFilteredAttempts(testId, userId, testTitle,
                userUsername, pageable));
    }

    @GetMapping("/all")
    @Operation(summary = "Получить все попытки (без пагинации)")
    @ApiResponse(responseCode = "200", description = "Попытки найдены")
    public ResponseEntity<List<TestAttempt>> getAllTestAttemptsNoPagination() {
        return ResponseEntity.ok(testAttemptService.getAllTestAttemptsList());
    }

    @PostMapping
    @Operation(summary = "Создать попытку")
    @ApiResponse(responseCode = "201", description = "Попытка создана")
    @ApiResponse(responseCode = "400", description = "Некорректные данные")
    public ResponseEntity<TestAttempt> createTestAttempt(@Valid @RequestBody
                                                             TestAttemptCreateDto dto) {
        TestAttempt created = testAttemptService.createTestAttempt(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Обновить попытку")
    @ApiResponse(responseCode = "200", description = "Попытка обновлена")
    @ApiResponse(responseCode = "404", description = "Попытка не найдена")
    @ApiResponse(responseCode = "400", description = "Некорректные данные")
    public ResponseEntity<TestAttempt> updateTestAttempt(
            @Parameter(description = "ID попытки", example = "1")
            @PathVariable Integer id,
            @Valid @RequestBody TestAttemptUpdateDto dto) {
        return ResponseEntity.ok(testAttemptService.updateTestAttempt(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить попытку")
    @ApiResponse(responseCode = "204", description = "Попытка удалена")
    @ApiResponse(responseCode = "404", description = "Попытка не найдена")
    public ResponseEntity<Void> deleteTestAttempt(
            @Parameter(description = "ID попытки", example = "1")
            @PathVariable Integer id) {
        testAttemptService.deleteTestAttempt(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}