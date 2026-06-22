package lms.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lms.dto.create.CourseCreateDto;
import lms.dto.update.CourseUpdateDto;
import lms.exception.NotFoundException;
import lms.model.Category;
import lms.model.Course;
import lms.model.Role;
import lms.model.User;
import lms.repository.CategoryRepository;
import lms.repository.CourseRepository;
import lms.repository.RoleRepository;
import lms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Autowired
    public CourseService(CourseRepository courseRepository,
                         CategoryRepository categoryRepository,
                         UserRepository userRepository,
                         RoleRepository roleRepository) {
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public Course getCourseById(Integer id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Курс с ID " + id + " не нaйден"));
    }

    public Page<Course> getAllCourses(Pageable pageable) {
        return courseRepository.findAll(pageable);
    }

    public Page<Course> getCoursesByTitle(String title, Pageable pageable) {
        return courseRepository.findByTitleContaining(title, pageable);
    }

    public Page<Course> getCoursesByCategory(Integer categoryId, Pageable pageable) {
        return courseRepository.findByCategoryId(categoryId, pageable);
    }

    public Page<Course> getCoursesByTeacher(Integer teacherId, Pageable pageable) {
        return courseRepository.findByTeacherId(teacherId, pageable);
    }

    public List<Course> getAllCoursesList() {
        return courseRepository.findAll();
    }

    public Course createCourse(CourseCreateDto dto) {
        Course course = new Course();
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Категория с ID "
                            + dto.getCategoryId() + " не найдена "));
            course.setCategory(category);
        }

        if (dto.getTeacherId() != null) {
            User teacher = userRepository.findById(dto.getTeacherId())
                    .orElseThrow(() -> new NotFoundException("Преподаватель с ID "
                            + dto.getTeacherId() + " не найдeн"));
            course.setTeacher(teacher);
        }

        if (dto.getRoleIds() != null && !dto.getRoleIds().isEmpty()) {
            Set<Role> roles = dto.getRoleIds().stream()
                    .map(roleId -> roleRepository.findById(roleId)
                            .orElseThrow(() -> new NotFoundException("Роль с ID "
                                    + roleId + " нe найдена")))
                    .collect(Collectors.toSet());
            course.setRoles(roles);
        }

        return courseRepository.save(course);
    }

    public Course updateCourse(Integer id, CourseUpdateDto dto) {
        Course course = getCourseById(id);

        if (dto.getTitle() != null) {
            course.setTitle(dto.getTitle());
        }
        if (dto.getDescription() != null) {
            course.setDescription(dto.getDescription());
        }

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Категория с ID "
                            + dto.getCategoryId() + " не нaйдена"));
            course.setCategory(category);
        }

        if (dto.getTeacherId() != null) {
            User teacher = userRepository.findById(dto.getTeacherId())
                    .orElseThrow(() -> new NotFoundException("Преподаватель с ID "
                            + dto.getTeacherId() + " нe найден"));
            course.setTeacher(teacher);
        }

        if (dto.getRoleIds() != null) {
            Set<Role> roles = dto.getRoleIds().stream()
                    .map(roleId -> roleRepository.findById(roleId)
                            .orElseThrow(() -> new NotFoundException("Роль с ID" + " "
                                    + roleId + " не найдeна")))
                    .collect(Collectors.toSet());
            course.setRoles(roles);
        }

        return courseRepository.save(course);
    }

    public void deleteCourse(Integer id) {
        Course course = getCourseById(id);
        courseRepository.delete(course);
    }


}