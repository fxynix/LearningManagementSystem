package lms.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lms.dto.create.LectureCreateDto;
import lms.dto.update.LectureUpdateDto;
import lms.model.Lecture;
import lms.service.LectureService;
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
@RequestMapping("/api/lectures")
@Tag(name = "Lecture Controller", description = "API для управления лекциями")
public class LectureController {

    private final LectureService lectureService;

    @Autowired
    public LectureController(LectureService lectureService) {
        this.lectureService = lectureService;
    }

    @GetMapping("{id}")
    @Operation(summary = "Получить лекцию по ID")
    @ApiResponse(responseCode = "200", description = "Лекция найдена")
    @ApiResponse(responseCode = "404", description = "Лекция не найдена")
    public ResponseEntity<Lecture> getLectureById(
            @Parameter(description = "ID лекции", example = "1")
            @PathVariable Integer id) {
        return ResponseEntity.ok(lectureService.getLectureById(id));
    }

    @GetMapping(params = "title")
    @Operation(summary = "Получить лекцию(-и) по названию")
    @ApiResponse(responseCode = "200", description = "Лекция найдена")
    @ApiResponse(responseCode = "404", description = "Лекций не найдено")
    public ResponseEntity<List<Lecture>> getLectureByTitle(
            @Parameter(description = "Название лекции", example = "Введение в Java")
            @RequestParam String title) {
        return ResponseEntity.ok(lectureService.getLecturesByTitle(title));
    }

    @GetMapping("/courseId/{courseId}")
    @Operation(summary = "Получить лекции по ID курса")
    @ApiResponse(responseCode = "200", description = "Лекции найдены")
    public ResponseEntity<List<Lecture>> getLecturesByCourse(
            @Parameter(description = "ID курса", example = "1")
            @PathVariable Integer courseId) {
        return ResponseEntity.ok(lectureService.getLecturesByCourse(courseId));
    }

    @GetMapping("/all")
    @Operation(summary = "Получить все лекции")
    @ApiResponse(responseCode = "200", description = "Лекции найдены")
    public ResponseEntity<List<Lecture>> getAllLectures() {
        return ResponseEntity.ok(lectureService.getAllLectures());
    }

    @PostMapping
    @Operation(summary = "Создать лекцию")
    @ApiResponse(responseCode = "201", description = "Лекция создана")
    @ApiResponse(responseCode = "400", description = "Некорректные данные")
    public ResponseEntity<Lecture> createLecture(@Valid @RequestBody LectureCreateDto dto) {
        Lecture created = lectureService.createLecture(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Обновить лекцию")
    @ApiResponse(responseCode = "200", description = "Лекция обновлена")
    @ApiResponse(responseCode = "404", description = "Лекция не найдена")
    @ApiResponse(responseCode = "400", description = "Некорректные данные")
    public ResponseEntity<Lecture> updateLecture(
            @Parameter(description = "ID лекции", example = "1")
            @PathVariable Integer id,
            @Valid @RequestBody LectureUpdateDto dto) {
        return ResponseEntity.ok(lectureService.updateLecture(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить лекцию")
    @ApiResponse(responseCode = "204", description = "Лекция удалена")
    @ApiResponse(responseCode = "404", description = "Лекция не найдена")
    public ResponseEntity<Void> deleteLecture(
            @Parameter(description = "ID лекции", example = "1")
            @PathVariable Integer id) {
        lectureService.deleteLecture(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}