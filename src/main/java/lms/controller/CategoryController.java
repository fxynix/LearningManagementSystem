package lms.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lms.dto.create.CategoryCreateDto;
import lms.dto.update.CategoryUpdateDto;
import lms.model.Category;
import lms.service.CategoryService;
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
@RequestMapping("/api/categories")
@Tag(name = "Category Controller", description = "API для управления категориями")
public class CategoryController {

    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("{id}")
    @Operation(summary = "Получить категорию по ID")
    @ApiResponse(responseCode = "200", description = "Категория найдена")
    @ApiResponse(responseCode = "404", description = "Категория не найдена")
    public ResponseEntity<Category> getCategoryById(
            @Parameter(description = "ID категории", example = "1")
            @PathVariable Integer id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @GetMapping("name/{name}")
    @Operation(summary = "Получить категории по названию (с пагинацией)")
    @ApiResponse(responseCode = "200", description = "Категории найдены")
    @ApiResponse(responseCode = "404", description = "Категорий не найдено")
    public ResponseEntity<Page<Category>> getCategoriesByName(
            @Parameter(description = "Название категории", example = "Программирование")
            @PathVariable String name,
            @PageableDefault(sort = "id", direction = Sort.Direction.ASC)
            Pageable pageable) {
        return ResponseEntity.ok(categoryService.getCategoriesByTitle(name, pageable));
    }

    @GetMapping("/all_p")
    @Operation(summary = "Получить все категории (с пагинацией)")
    @ApiResponse(responseCode = "200", description = "Категории найдены")
    public ResponseEntity<Page<Category>> getAllCategories(
            @PageableDefault(sort = "id", direction = Sort.Direction.ASC)
            Pageable pageable) {
        return ResponseEntity.ok(categoryService.getAllCategories(pageable));
    }

    @GetMapping("/all")
    @Operation(summary = "Получить все категории (без пагинации)")
    @ApiResponse(responseCode = "200", description = "Категории найдены")
    public ResponseEntity<List<Category>> getAllCategoriesNoPagination() {
        return ResponseEntity.ok(categoryService.getAllCategoriesList());
    }

    @PostMapping
    @Operation(summary = "Создать категорию")
    @ApiResponse(responseCode = "201", description = "Категория создана")
    @ApiResponse(responseCode = "400", description = "Некорректные данные")
    public ResponseEntity<Category> createCategory(@Valid @RequestBody CategoryCreateDto dto) {
        Category created = categoryService.createCategory(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Обновить категорию")
    @ApiResponse(responseCode = "200", description = "Категория обновлена")
    @ApiResponse(responseCode = "404", description = "Категория не найдена")
    @ApiResponse(responseCode = "400", description = "Некорректные данные")
    public ResponseEntity<Category> updateCategory(
            @Parameter(description = "ID категории", example = "1")
            @PathVariable Integer id,
            @Valid @RequestBody CategoryUpdateDto dto) {
        return ResponseEntity.ok(categoryService.updateCategory(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить категорию")
    @ApiResponse(responseCode = "204", description = "Категория удалена")
    @ApiResponse(responseCode = "404", description = "Категория не найдена")
    public ResponseEntity<Void> deleteCategory(
            @Parameter(description = "ID категории", example = "1")
            @PathVariable Integer id) {
        categoryService.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}