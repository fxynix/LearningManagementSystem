package lms.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lms.dto.create.CourseCreateDto;
import lms.dto.update.CourseUpdateDto;
import lms.model.Course;
import lms.service.CourseService;
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
@RequestMapping("/api/courses")
@Tag(name = "Course Controller", description = "API для управления курсами")
public class CourseController {

    private final CourseService courseService;

    @Autowired
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("{id}")
    @Operation(summary = "Получить курс по ID")
    @ApiResponse(responseCode = "200", description = "Курс найден")
    @ApiResponse(responseCode = "404", description = "Курс не найден")
    public ResponseEntity<Course> getCourseById(
            @Parameter(description = "ID курса", example = "1")
            @PathVariable Integer id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @GetMapping("/all_p")
    @Operation(summary = "Получить все курсы (с пагинацией)")
    @ApiResponse(responseCode = "200", description = "Курсы найдены")
    public ResponseEntity<Page<Course>> getAllCourses(
            @PageableDefault(sort = "id", direction = Sort.Direction.ASC)
            Pageable pageable) {
        return ResponseEntity.ok(courseService.getAllCourses(pageable));
    }


    @GetMapping
    @Operation(summary = "Получить курсы с пагинацией и фильтрацией с учётом прав пользователя")
    @ApiResponse(responseCode = "200", description = "Курсы найдены")
    public ResponseEntity<Page<Course>> getCourses(
            @Parameter(description = "Название (частичное совпадение)")
            @RequestParam(required = false) String title,
            @Parameter(description = "ID категории")
            @RequestParam(required = false) Integer categoryId,
            @Parameter(description = "ID преподавателя (фильтр)")
            @RequestParam(required = false) Integer teacherId,
            @Parameter(description = "ID текущего пользователя для проверки прав")
            @RequestParam(required = false) Integer userId,
            @Parameter(description = "Список ролей пользователя (передавать через запятую)")
            @RequestParam(required = false) String roles,
            @PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<Course> courses = courseService.getFilteredCourses(title, categoryId, teacherId,
                userId, roles, pageable);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/all")
    @Operation(summary = "Получить все курсы (без пагинации)")
    @ApiResponse(responseCode = "200", description = "Курсы найдены")
    public ResponseEntity<List<Course>> getAllCoursesNoPagination() {
        return ResponseEntity.ok(courseService.getAllCoursesList());
    }

    @PostMapping
    @Operation(summary = "Создать курс")
    @ApiResponse(responseCode = "201", description = "Курс создан")
    @ApiResponse(responseCode = "400", description = "Некорректные данные")
    public ResponseEntity<Course> createCourse(@Valid @RequestBody CourseCreateDto dto) {
        Course created = courseService.createCourse(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Обновить курс")
    @ApiResponse(responseCode = "200", description = "Курс обновлён")
    @ApiResponse(responseCode = "404", description = "Курс не найден")
    @ApiResponse(responseCode = "400", description = "Некорректные данные")
    public ResponseEntity<Course> updateCourse(
            @Parameter(description = "ID курса", example = "1")
            @PathVariable Integer id,
            @Valid @RequestBody CourseUpdateDto dto) {
        return ResponseEntity.ok(courseService.updateCourse(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить курс")
    @ApiResponse(responseCode = "204", description = "Курс удалён")
    @ApiResponse(responseCode = "404", description = "Курс не найден")
    public ResponseEntity<Void> deleteCourse(
            @Parameter(description = "ID курса", example = "1")
            @PathVariable Integer id) {
        courseService.deleteCourse(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}