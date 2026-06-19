package lms.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lms.dto.create.TestCreateDto;
import lms.dto.update.TestUpdateDto;
import lms.model.Test;
import lms.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("/api/tests")
@Tag(name = "Test Controller", description = "API для управления тестами")
public class TestController {

    private final TestService testService;

    @Autowired
    public TestController(TestService testService) {
        this.testService = testService;
    }

    @GetMapping("{id}")
    @Operation(summary = "Получить тест по ID")
    @ApiResponse(responseCode = "200", description = "Тест найден")
    @ApiResponse(responseCode = "404", description = "Тест не найден")
    public ResponseEntity<Test> getTestById(
            @Parameter(description = "ID теста", example = "1")
            @PathVariable Integer id) {
        return ResponseEntity.ok(testService.getTestById(id));
    }

    @GetMapping(params = "title")
    @Operation(summary = "Получить тест(-ы) по названию")
    @ApiResponse(responseCode = "200", description = "Тест найден")
    @ApiResponse(responseCode = "404", description = "Тестов не найдено")
    public ResponseEntity<List<Test>> getTestByTitle(
            @Parameter(description = "Название теста", example = "Тест по Java (базовый)")
            @RequestParam String title) {
        return ResponseEntity.ok(testService.getTestsByTitle(title));
    }

    @GetMapping("/courseId/{courseId}")
    @Operation(summary = "Получить тесты по ID курса")
    @ApiResponse(responseCode = "200", description = "Тесты найдены")
    public ResponseEntity<List<Test>> getTestsByCourse(
            @Parameter(description = "ID курса", example = "1")
            @PathVariable Integer courseId) {
        return ResponseEntity.ok(testService.getTestsByCourse(courseId));
    }

    @GetMapping("/all")
    @Operation(summary = "Получить все тесты")
    @ApiResponse(responseCode = "200", description = "Тесты найдены")
    public ResponseEntity<List<Test>> getAllTests() {
        return ResponseEntity.ok(testService.getAllTests());
    }

    @PostMapping
    @Operation(summary = "Создать тест")
    @ApiResponse(responseCode = "201", description = "Тест создан")
    @ApiResponse(responseCode = "400", description = "Некорректные данные")
    public ResponseEntity<Test> createTest(@Valid @RequestBody TestCreateDto dto) {
        Test created = testService.createTest(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Обновить тест")
    @ApiResponse(responseCode = "200", description = "Тест обновлён")
    @ApiResponse(responseCode = "404", description = "Тест не найден")
    @ApiResponse(responseCode = "400", description = "Некорректные данные")
    public ResponseEntity<Test> updateTest(
            @Parameter(description = "ID теста", example = "1")
            @PathVariable Integer id,
            @Valid @RequestBody TestUpdateDto dto) {
        return ResponseEntity.ok(testService.updateTest(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить тест")
    @ApiResponse(responseCode = "204", description = "Тест удалён")
    @ApiResponse(responseCode = "404", description = "Тест не найден")
    public ResponseEntity<Void> deleteTest(
            @Parameter(description = "ID теста", example = "1")
            @PathVariable Integer id) {
        testService.deleteTest(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}