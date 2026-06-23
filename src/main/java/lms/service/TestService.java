package lms.service;

import java.util.List;
import lms.dto.create.TestCreateDto;
import lms.dto.update.TestUpdateDto;
import lms.exception.NotFoundException;
import lms.model.Course;
import lms.model.Test;
import lms.repository.CourseRepository;
import lms.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TestService {

    private final TestRepository testRepository;
    private final CourseRepository courseRepository;

    @Autowired
    public TestService(TestRepository testRepository, CourseRepository courseRepository) {
        this.testRepository = testRepository;
        this.courseRepository = courseRepository;
    }

    public Page<Test> getFilteredTests(String title, Integer courseId, Pageable pageable) {
        return testRepository.findByFilters(title, courseId, pageable);
    }

    public List<Test> getAllTestsList() {
        return testRepository.findAll();
    }

    public Test getTestById(Integer id) {
        return testRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Тест с ID " + id + " не найден"));
    }

    public Test createTest(TestCreateDto dto) {
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new NotFoundException("Курс с ID " + dto.getCourseId()
                        + " нe найдeн"));

        Test test = new Test();
        test.setCourse(course);
        test.setTitle(dto.getTitle());
        test.setDescription(dto.getDescription());
        test.setContent(dto.getContent());
        test.setQuestionsCount(dto.getQuestionsCount());
        test.setStartDate(dto.getStartDate());
        test.setEndDate(dto.getEndDate());
        test.setMaxDurationMinutes(dto.getMaxDurationMinutes());
        test.setMaxAttempts(dto.getMaxAttempts());

        return testRepository.save(test);
    }

    public Test updateTest(Integer id, TestUpdateDto dto) {
        Test test = getTestById(id);

        if (dto.getCourseId() != null) {
            Course course = courseRepository.findById(dto.getCourseId())
                    .orElseThrow(() -> new NotFoundException("Курс с ID " + dto.getCourseId()
                            + " не нaйден"));
            test.setCourse(course);
        }
        if (dto.getTitle() != null) {
            test.setTitle(dto.getTitle());
        }
        if (dto.getDescription() != null) {
            test.setDescription(dto.getDescription());
        }
        if (dto.getContent() != null) {
            test.setContent(dto.getContent());
        }
        if (dto.getQuestionsCount() != null) {
            test.setQuestionsCount(dto.getQuestionsCount());
        }
        if (dto.getStartDate() != null) {
            test.setStartDate(dto.getStartDate());
        }
        if (dto.getEndDate() != null) {
            test.setEndDate(dto.getEndDate());
        }
        if (dto.getMaxDurationMinutes() != null) {
            test.setMaxDurationMinutes(dto.getMaxDurationMinutes());
        }
        if (dto.getMaxAttempts() != null) {
            test.setMaxAttempts(dto.getMaxAttempts());
        }

        return testRepository.save(test);
    }

    public void deleteTest(Integer id) {
        Test test = getTestById(id);
        testRepository.delete(test);
    }
}