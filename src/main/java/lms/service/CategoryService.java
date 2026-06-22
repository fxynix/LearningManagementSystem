package lms.service;

import java.util.List;
import lms.dto.create.CategoryCreateDto;
import lms.dto.update.CategoryUpdateDto;
import lms.exception.NotFoundException;
import lms.model.Category;
import lms.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Page<Category> getAllCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    public List<Category> getAllCategoriesList() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Категория с ID " + id + " не найдена"));
    }

    public Page<Category> getCategoriesByTitle(String name, Pageable pageable) {
        return categoryRepository.findByNameContaining(name, pageable);
    }

    public Category createCategory(CategoryCreateDto dto) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        return categoryRepository.save(category);
    }

    public Category updateCategory(Integer id, CategoryUpdateDto dto) {
        Category category = getCategoryById(id);
        if (dto.getName() != null) {
            category.setName(dto.getName());
        }
        if (dto.getDescription() != null) {
            category.setDescription(dto.getDescription());
        }
        return categoryRepository.save(category);
    }

    public void deleteCategory(Integer id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }
}